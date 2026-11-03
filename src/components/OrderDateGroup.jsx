import { formatDate, formatMoney, formatTime, paymentLabel, sumBy } from "../utils/format.js";

export default function OrderDateGroup({ date, orders, onView, onEdit, onDelete }) {
  const cash = sumBy(orders, (o) => o.cash_amount);
  const gpay = sumBy(orders, (o) => o.gpay_amount);
  const less = sumBy(orders, (o) => o.less_amount);
  const act = (handler, order) => (e) => {
    e.stopPropagation();
    handler(order);
  };

  return (
    <section className="app-card mb-3 overflow-hidden">
      <header className="day-head">
        <div>
          <h2 className="h6 fw-bold mb-0">{formatDate(date)}</h2>
          <span className="small text-secondary">{orders.length} bill{orders.length === 1 ? "" : "s"}</span>
        </div>
        <div className="day-split">
          <span className="pill pill-cash">Cash <b className="num">{formatMoney(cash)}</b></span>
          <span className="pill pill-gpay">GPay <b className="num">{formatMoney(gpay)}</b></span>
          {less > 0 && <span className="pill pill-less">Less <b className="num">{formatMoney(less)}</b></span>}
          <span className="day-total num">{formatMoney(cash + gpay)}</span>
        </div>
      </header>
      <div className="table-responsive">
        <table className="table align-middle table-hover">
          <thead>
            <tr>
              <th>Bill no.</th>
              <th className="d-none d-sm-table-cell">Time</th>
              <th>Customer</th>
              <th className="d-none d-sm-table-cell">Payment</th>
              <th className="text-end d-none d-sm-table-cell">Items</th>
              <th className="text-end">Total</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} role="button" onClick={() => onView(order)}>
                <td className="fw-semibold lh-sm">
                  {order.number}
                  <div className="d-sm-none small fw-normal text-secondary">{formatTime(order.created_at)} · {paymentLabel(order.payment_mode)}</div>
                </td>
                <td className="d-none d-sm-table-cell">{formatTime(order.created_at)}</td>
                <td className="lh-sm">
                  {order.customer_name || <span className="text-secondary">—</span>}
                  {order.customer_phone && <div className="small text-secondary num">{order.customer_phone}</div>}
                </td>
                <td className="d-none d-sm-table-cell"><span className={`pill pill-${order.payment_mode.toLowerCase()}`}>{paymentLabel(order.payment_mode)}</span></td>
                <td className="num text-end d-none d-sm-table-cell">{order.item_count}</td>
                <td className="num text-end fw-semibold lh-sm">
                  {formatMoney(order.payable)}
                  {Number(order.less_amount) > 0 && <div className="small fw-normal text-secondary">less {formatMoney(order.less_amount)}</div>}
                </td>
                <td className="text-end row-actions">
                  <button className="btn btn-sm btn-outline-primary" onClick={act(onView, order)}>View</button>
                  <button className="btn btn-sm btn-outline-secondary" onClick={act(onEdit, order)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={act(onDelete, order)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
