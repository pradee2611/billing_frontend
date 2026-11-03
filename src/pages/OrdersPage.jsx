import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteOrder, getOrderGroups } from "../api/client.js";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import OrderDateGroup from "../components/OrderDateGroup.jsx";
import OrderDetailsModal from "../components/OrderDetailsModal.jsx";
import PageHeader from "../components/PageHeader.jsx";
import SearchBar from "../components/SearchBar.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import useAsync from "../hooks/useAsync.js";
import { formatMoney, paymentLabel, SHEET_URL, sumBy, todayIso } from "../utils/format.js";

const FILTERS = [["ALL", "All"], ["CASH", "Cash"], ["GPAY", "GPay"], ["SPLIT", "Split"]];

function Stat({ label, value, tone }) {
  return (
    <div className={`stat-card ${tone ?? ""}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value num">{value}</div>
    </div>
  );
}

export default function OrdersPage() {
  const navigate = useNavigate();
  const [version, setVersion] = useState(0);
  const { data: groups, loading, error } = useAsync(getOrderGroups, [version]);
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("ALL");

  const today = useMemo(() => {
    const orders = groups?.find((g) => g.date === todayIso())?.orders ?? [];
    const cash = sumBy(orders, (o) => o.cash_amount);
    const gpay = sumBy(orders, (o) => o.gpay_amount);
    return { count: orders.length, total: cash + gpay, cash, gpay, less: sumBy(orders, (o) => o.less_amount) };
  }, [groups]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const digits = q.replace(/\D/g, "");
    return (groups ?? [])
      .map((g) => ({
        date: g.date,
        orders: g.orders.filter(
          (o) => (mode === "ALL" || o.payment_mode === mode) && (!q ||
            (digits && (String(o.id) === digits || o.customer_phone.includes(digits))) ||
            o.customer_name.toLowerCase().includes(q))
        ),
      }))
      .filter((g) => g.orders.length > 0);
  }, [groups, search, mode]);

  const closeDelete = () => {
    setDeleting(null);
    setDeleteError("");
  };

  const confirmDelete = async () => {
    setDeleteBusy(true);
    try {
      await deleteOrder(deleting.id);
      closeDelete();
      setVersion((v) => v + 1);
    } catch {
      setDeleteError("Could not delete the bill. Check the backend and try again.");
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <>
      <PageHeader title="Orders" subtitle="Every bill, grouped by day">
        {SHEET_URL && <a href={SHEET_URL} target="_blank" rel="noreferrer" className="btn btn-outline-success">Open Google Sheet ↗</a>}
        <Link to="/new" className="btn btn-primary">+ New bill</Link>
      </PageHeader>

      <div className="stat-grid mb-4">
        <Stat label="Today's sales" value={formatMoney(today.total)} tone="stat-main" />
        <Stat label="Bills today" value={today.count} />
        <Stat label="Cash" value={formatMoney(today.cash)} />
        <Stat label="GPay" value={formatMoney(today.gpay)} />
        <Stat label="Less given" value={formatMoney(today.less)} />
      </div>

      <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
        <div style={{ maxWidth: 320, flex: "1 1 220px" }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Find bill no., name or phone…" />
        </div>
        <div className="chips">
          {FILTERS.map(([value, label]) => (
            <button key={value} className={`chip ${mode === value ? "active" : ""}`} onClick={() => setMode(value)}>{label}</button>
          ))}
        </div>
      </div>

      <StatusMessage
        loading={loading}
        error={error}
        empty={groups && filtered.length === 0}
        emptyText={groups?.length === 0 ? "No bills yet. Create your first bill." : "No bills match."}
      />
      {filtered.map((group) => (
        <OrderDateGroup key={group.date} date={group.date} orders={group.orders} onView={setViewing}
          onEdit={(order) => navigate(`/edit/${order.id}`)}
          onDelete={setDeleting}
        />
      ))}

      {viewing && <OrderDetailsModal order={viewing} onClose={() => setViewing(null)} />}

      {deleting && (
        <ConfirmDialog
          title={`Delete ${deleting.number}?`}
          confirmLabel="Yes, delete bill"
          danger
          requireText="DELETE"
          busy={deleteBusy}
          error={deleteError}
          onConfirm={confirmDelete}
          onCancel={closeDelete}
        >
          <p className="mb-2">
            {formatMoney(deleting.payable)} · {deleting.item_count} pcs · {paymentLabel(deleting.payment_mode)}
            {deleting.customer_name && <> · {deleting.customer_name}</>}
          </p>
          This removes the bill from Orders, the day totals and the Google Sheet.
        </ConfirmDialog>
      )}
    </>
  );
}
