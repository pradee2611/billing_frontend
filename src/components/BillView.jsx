import { formatDateTime, formatMoney, paymentLabel } from "../utils/format.js";
import BrandLogo, { BrandName } from "./BrandLogo.jsx";

const PHONES = "63748 17953 · 63826 26343 · 70102 62389 · 82709 32722";

/** The bill itself — shown on screen and used as the print layout. */
export default function BillView({ order }) {
  const less = Number(order.less_amount) || 0;
  return (
    <div className="bill-sheet">
      <div className="text-center mb-3">
        <div className="d-flex justify-content-center align-items-center gap-2">
          <BrandLogo size={40} />
          <BrandName className="brand-name-lg" />
        </div>
        <div className="small text-secondary mt-1">Perinayakampalayam Main Road, near Sendhur Hotel, Coimbatore</div>
        <div className="small text-secondary num">{PHONES}</div>
      </div>

      <div className="d-flex justify-content-between small border-top border-bottom py-2 mb-2">
        <span><strong>{order.number}</strong></span>
        <span className="text-secondary">{formatDateTime(order.created_at)}</span>
        <span>Paid by <strong>{order.payment_mode === "SPLIT" ? "Cash + GPay" : paymentLabel(order.payment_mode)}</strong></span>
      </div>

      {(order.customer_name || order.customer_phone) && (
        <div className="small mb-2">
          Customer: <strong>{order.customer_name || "—"}</strong>
          {order.customer_phone && <span className="num"> · {order.customer_phone}</span>}
        </div>
      )}

      <table className="table table-sm bill-table mb-2">
        <thead>
          <tr><th>Code</th><th>Item</th><th className="text-end">Rate</th><th className="text-end">Qty</th><th className="text-end">Amount</th></tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.code}>
              <td className="num">{item.code}</td>
              <td>{item.product_name}{item.name_ta && <div className="small text-secondary">{item.name_ta}</div>}</td>
              <td className="num text-end">{formatMoney(item.unit_price)}</td>
              <td className="num text-end">{item.quantity}</td>
              <td className="num text-end">{formatMoney(item.line_total)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="bill-sum">
        <div><span>MRP total</span><s className="num">{formatMoney(order.mrp_total)}</s></div>
        <div className="text-success"><span>You saved (80% off)</span><span className="num">{formatMoney(order.savings)}</span></div>
        {less > 0 && (
          <>
            <div className="fw-semibold"><span>Total</span><span className="num">{formatMoney(order.total)}</span></div>
            <div><span>Less (round off)</span><span className="num">− {formatMoney(less)}</span></div>
          </>
        )}
        <div className="grand"><span>{less > 0 ? "Amount received" : "Total"}</span><span className="num">{formatMoney(order.payable)}</span></div>
        {order.payment_mode === "SPLIT" && (
          <>
            <div><span>Paid in cash</span><span className="num">{formatMoney(order.cash_amount)}</span></div>
            <div><span>Paid by GPay</span><span className="num">{formatMoney(order.gpay_amount)}</span></div>
          </>
        )}
      </div>

      <div className="text-center small text-secondary mt-3">நன்றி! மீண்டும் வருக · Thank you, visit again!</div>
    </div>
  );
}
