import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createOrder, getOrder, getProducts, updateOrder } from "../api/client.js";
import BillModal from "../components/BillModal.jsx";
import CartSidebar from "../components/CartSidebar.jsx";
import CategoryChips from "../components/CategoryChips.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import ProductTable from "../components/ProductTable.jsx";
import QuickEntry from "../components/QuickEntry.jsx";
import SearchBar from "../components/SearchBar.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import useAsync from "../hooks/useAsync.js";
import useCart from "../hooks/useCart.js";
import { formatMoney, paymentLabel, splitInvalid } from "../utils/format.js";

/** The billing screen. With a bill id in the URL (/edit/:id) it edits that saved bill instead. */
export default function NewOrderPage() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const cart = useCart();
  const codeRef = useRef(null);
  const loadedFor = useRef(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [cashAmount, setCashAmount] = useState("");
  const [receivedAmount, setReceivedAmount] = useState("");
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [activeCode, setActiveCode] = useState(null);

  const { data: products, loading, error } = useAsync(getProducts, []);
  const { data: original, error: originalError } = useAsync(() => (id ? getOrder(id) : Promise.resolve(null)), [id]);

  useEffect(() => {
    if (activeCode) document.getElementById(`row-${activeCode}`)?.scrollIntoView({ block: "nearest" });
  }, [activeCode]);

  // Fill the bill from the saved order once, keeping the prices it was sold at.
  useEffect(() => {
    if (!products || !original || loadedFor.current === original.id) return;
    loadedFor.current = original.id;
    cart.load(
      original.items.map((item) => {
        const base = products.find((p) => p.id === item.product_id) ?? {
          id: item.product_id, code: item.code, category: "", name: item.product_name, name_ta: item.name_ta ?? "",
        };
        return { product: { ...base, price: item.unit_price, mrp: item.mrp }, quantity: item.quantity };
      })
    );
    setCustomer({ name: original.customer_name, phone: original.customer_phone });
    setPaymentMode(original.payment_mode);
    setCashAmount(original.payment_mode === "SPLIT" ? String(Number(original.cash_amount)) : "");
    setReceivedAmount(Number(original.less_amount) > 0 ? String(Number(original.payable)) : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, original]);

  const categories = useMemo(() => [...new Set((products ?? []).map((p) => p.category))], [products]);
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (products ?? []).filter(
      (p) =>
        (category === "All" || p.category === category) &&
        (!q || p.name.toLowerCase().includes(q) || p.name_ta.includes(q) || String(p.code) === q)
    );
  }, [products, search, category]);

  // The cashier enters the amount actually received; the round-off is what is left of the total.
  const received = receivedAmount === "" ? cart.total : Number(receivedAmount);
  const less = cart.total - received;
  const payable = received;
  const lessInvalid = receivedAmount !== "" && (received <= 0 || received > cart.total);

  const payload = () => ({
    payment_mode: paymentMode,
    customer_name: customer.name,
    customer_phone: customer.phone,
    less_amount: Math.max(0, less).toFixed(2),
    ...(paymentMode === "SPLIT" ? { cash_amount: cashAmount } : {}),
    items: cart.items.map(({ product, quantity }) => ({ product: product.id, quantity })),
  });

  const save = async () => {
    setSubmitting(true);
    setSubmitError(false);
    try {
      setReceipt(editing ? await updateOrder(id, payload()) : await createOrder(payload()));
      setConfirming(false);
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  // New bills save straight away; edits to a saved bill ask first.
  const confirm = () => {
    if (cart.items.length === 0 || submitting) return;
    if (customer.phone && customer.phone.length !== 10) return;
    if (lessInvalid) return;
    if (paymentMode === "SPLIT" && splitInvalid(payable, cashAmount)) return;
    if (editing) setConfirming(true);
    else save();
  };

  const newBill = () => {
    cart.clear();
    setCustomer({ name: "", phone: "" });
    setCashAmount("");
    setReceivedAmount("");
    setReceipt(null);
    setSearch("");
    setCategory("All");
    setTimeout(() => codeRef.current?.focus(), 0);
  };

  const finish = () => (editing ? navigate("/") : newBill());

  // Keyboard shortcuts: F2 code box, F8 cash, F9 GPay, Ctrl+Enter confirm.
  const confirmRef = useRef(confirm);
  confirmRef.current = confirm;
  useEffect(() => {
    const onKey = (e) => {
      if (receipt || confirming) return;
      if (e.key === "F2") { e.preventDefault(); codeRef.current?.focus(); }
      else if (e.key === "F8") { e.preventDefault(); setPaymentMode("CASH"); }
      else if (e.key === "F9") { e.preventDefault(); setPaymentMode("GPAY"); }
      else if (e.key === "F10") { e.preventDefault(); setPaymentMode("SPLIT"); }
      else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); confirmRef.current(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [receipt, confirming]);

  if (editing && originalError) {
    return (
      <div className="alert alert-danger">
        This bill could not be found. It may have been deleted. <Link to="/">Back to orders</Link>
      </div>
    );
  }

  return (
    <>
      {editing && original && (
        <div className="edit-banner mb-3">
          <strong>Editing {original.number}</strong>
          <span className="text-secondary small">Changes replace the saved bill and its Google Sheet rows.</span>
          <Link to="/" className="btn btn-sm btn-outline-secondary ms-auto">Cancel editing</Link>
        </div>
      )}

      <div className="row g-3">
        <div className="col-lg-8">
          {products && (
            <div className="quick-entry-wrap">
              <QuickEntry products={products} onAdd={cart.add} onActive={setActiveCode} codeRef={codeRef} />
            </div>
          )}
          <div className="app-card overflow-hidden mt-3">
            <div className="p-3 border-bottom d-grid gap-2">
              <SearchBar value={search} onChange={setSearch} placeholder="Search by name or Tamil name…" />
              {products && <CategoryChips categories={categories} value={category} onChange={setCategory} />}
            </div>
            <StatusMessage loading={loading} error={error} empty={products && visible.length === 0} emptyText="No items match your search." />
            {visible.length > 0 && <ProductTable products={visible} cart={cart} activeCode={activeCode} />}
          </div>
        </div>
        <div className="col-lg-4">
          <CartSidebar
            cart={cart}
            customer={customer}
            onCustomer={setCustomer}
            paymentMode={paymentMode}
            onPayment={setPaymentMode}
            cashAmount={cashAmount}
            onCashAmount={setCashAmount}
            receivedAmount={receivedAmount}
            onReceivedAmount={setReceivedAmount}
            onConfirm={confirm}
            confirmLabel={editing ? "Save changes" : "Confirm bill"}
            submitting={submitting && !confirming}
            error={submitError && !confirming}
          />
        </div>
      </div>

      {cart.items.length > 0 && !receipt && (
        <div className="mobile-bar d-lg-none no-print">
          <button className="btn btn-outline-light" onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); codeRef.current?.focus(); }}>＋ Items</button>
          <div className="text-center lh-sm"><div className="small">{cart.count} pcs</div><strong className="num">{formatMoney(payable)}</strong></div>
          <button className="btn btn-warning fw-semibold" onClick={() => document.getElementById("bill-panel")?.scrollIntoView({ behavior: "smooth", block: "end" })}>Review bill ›</button>
        </div>
      )}

      {confirming && original && (
        <ConfirmDialog
          title={`Save changes to ${original.number}?`}
          confirmLabel="Yes, save changes"
          busy={submitting}
          error={submitError ? "Could not save the bill. Check the backend and try again." : ""}
          onConfirm={save}
          onCancel={() => { setConfirming(false); setSubmitError(false); }}
        >
          <p className="mb-2">
            To pay {formatMoney(original.payable)} → <strong>{formatMoney(payable)}</strong> · {paymentLabel(paymentMode)}{paymentMode === "SPLIT" && <> (Cash {formatMoney(cashAmount)} + GPay {formatMoney(payable - Number(cashAmount))})</>}
          </p>
          The saved bill and its Google Sheet rows will be replaced.
        </ConfirmDialog>
      )}

      {receipt && (
        <BillModal
          order={receipt}
          onClose={finish}
          primary={{ label: editing ? "Back to orders ↵" : "New bill ↵", onClick: finish }}
        />
      )}
    </>
  );
}
