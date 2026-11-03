import { formatMoney, PAYMENT_MODES, splitInvalid } from "../utils/format.js";
import QuantityInput from "./QuantityInput.jsx";

export default function CartSidebar({ cart, customer, onCustomer, paymentMode, onPayment, cashAmount, onCashAmount, receivedAmount, onReceivedAmount, onConfirm, confirmLabel = "Confirm bill", submitting, error }) {
  const empty = cart.items.length === 0;
  const split = paymentMode === "SPLIT";
  // The cashier types what the customer actually pays; the round-off is the difference.
  const received = receivedAmount === "" ? cart.total : Number(receivedAmount);
  const less = cart.total - received;
  const payable = received;
  const lessBad = !empty && receivedAmount !== "" && (received <= 0 || received > cart.total);
  const splitBad = split && !empty && !lessBad && splitInvalid(payable, cashAmount);

  return (
    <aside id="bill-panel" className="app-card bill-panel sticky-panel">
      <div className="bill-head">
        <h2 className="h6 fw-bold mb-0">Current bill</h2>
        <span className="text-secondary small">{empty ? "No items" : `${cart.items.length} items · ${cart.count} pcs`}</span>
        {!empty && <button className="btn btn-link btn-sm text-danger text-decoration-none p-0 ms-auto" onClick={cart.clear}>Clear</button>}
      </div>

      <div className="bill-lines">
        {empty ? (
          <div className="bill-empty">
            <div className="fs-1" aria-hidden="true">🧾</div>
            Type an item code to start billing
          </div>
        ) : (
          cart.items.map(({ product, quantity }) => (
            <div key={product.id} className="bill-line">
              <div className="d-flex justify-content-between gap-2">
                <div className="lh-sm">
                  <span className="code-badge me-1">{product.code}</span>
                  <span className="fw-medium">{product.name}</span>
                  <div className="small text-secondary num">{formatMoney(product.price)} each</div>
                </div>
                <div className="text-end">
                  <div className="num fw-semibold">{formatMoney(Number(product.price) * quantity)}</div>
                  <button className="btn btn-link btn-sm p-0 text-danger text-decoration-none" onClick={() => cart.remove(product.id)}>Remove</button>
                </div>
              </div>
              <div className="mt-1"><QuantityInput value={quantity} onChange={(q) => cart.setQuantity(product.id, q)} /></div>
            </div>
          ))
        )}
      </div>

      <div className="bill-totals">
        <div className="d-flex justify-content-between text-secondary small">
          <span>MRP total</span><s className="num">{formatMoney(cart.mrp)}</s>
        </div>
        <div className="d-flex justify-content-between text-success small">
          <span>Discount (80% off)</span><span className="num">− {formatMoney(cart.savings)}</span>
        </div>
        <div className="d-flex justify-content-between align-items-baseline mt-1">
          <span className="fw-semibold">Total</span>
          <span className={`num ${less > 0 ? "fw-semibold" : "bill-total"}`}>{formatMoney(cart.total)}</span>
        </div>
        <div className="less-row">
          <label className="small fw-semibold mb-0" htmlFor="less-input">Amount received</label>
          <div className="input-group input-group-sm less-input">
            <span className="input-group-text">₹</span>
            <input
              id="less-input"
              className={`form-control ${lessBad ? "is-invalid" : ""}`}
              inputMode="decimal"
              placeholder={String(cart.total)}
              value={receivedAmount}
              onChange={(e) => onReceivedAmount(e.target.value.replace(/[^\d.]/g, "").slice(0, 10))}
            />
          </div>
        </div>
        <div className="chips chips-sm mb-1">
          <span className="small text-secondary align-self-center">Round down to</span>
          {[10, 100, 500, 1000].map((step) => (
            <button
              key={step}
              type="button"
              className="chip"
              disabled={empty || cart.total <= step || cart.total % step === 0}
              onClick={() => onReceivedAmount(String(cart.total - +(cart.total % step).toFixed(2)))}
            >
              ₹{step}
            </button>
          ))}
        </div>
        {lessBad && <div className="small text-danger mb-1">Amount must be more than ₹0 and not more than the total.</div>}
        {less > 0 && !lessBad && (
          <>
            <div className="d-flex justify-content-between small text-danger">
              <span>Less (round off)</span><span className="num">− {formatMoney(less)}</span>
            </div>
            <div className="d-flex justify-content-between align-items-baseline">
              <span className="fw-semibold">Amount received</span>
              <span className="bill-total num">{formatMoney(payable)}</span>
            </div>
          </>
        )}
      </div>

      <div className="p-3 pt-2">
        <div className="row g-2 mb-3">
          <div className="col-6">
            <input
              className="form-control"
              placeholder="Customer name"
              maxLength={80}
              value={customer.name}
              onChange={(e) => onCustomer({ ...customer, name: e.target.value })}
              aria-label="Customer name"
            />
          </div>
          <div className="col-6">
            <input
              className={`form-control ${customer.phone && customer.phone.length < 10 ? "is-invalid" : ""}`}
              placeholder="Phone (10 digits)"
              inputMode="numeric"
              value={customer.phone}
              onChange={(e) => onCustomer({ ...customer, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
              aria-label="Customer phone"
            />
          </div>
        </div>
        <div className="btn-group w-100 mb-3" role="group" aria-label="Payment mode">
          {PAYMENT_MODES.map(({ value, label, key }) => (
            <button
              key={value}
              type="button"
              className={`btn pay-btn ${paymentMode === value ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => onPayment(value)}
            >
              {label} <kbd>{key}</kbd>
            </button>
          ))}
        </div>

        {split && (
          <div className="split-box mb-3">
            <div className="input-group">
              <span className="input-group-text">Cash ₹</span>
              <input
                className={`form-control ${splitBad && cashAmount !== "" ? "is-invalid" : ""}`}
                inputMode="decimal"
                placeholder="In hand"
                value={cashAmount}
                onChange={(e) => onCashAmount(e.target.value.replace(/[^\d.]/g, "").slice(0, 10))}
                aria-label="Cash received"
              />
              <button type="button" className="btn btn-outline-secondary" disabled={empty} onClick={() => onCashAmount(String(Math.floor(payable / 2)))}>Half</button>
            </div>
            <div className="d-flex justify-content-between small mt-2">
              <span>GPay balance</span>
              <strong className="num">{formatMoney(Math.max(0, payable - (Number(cashAmount) || 0)))}</strong>
            </div>
            {splitBad && cashAmount !== "" && <div className="small text-danger mt-1">Cash must be more than ₹0 and less than the amount to pay.</div>}
          </div>
        )}

        {error && <div className="alert alert-danger py-2 small">Could not save the bill. Check the backend and try again.</div>}

        <button className="btn btn-success btn-lg w-100 confirm-btn" disabled={empty || submitting || splitBad || lessBad} onClick={onConfirm}>
          {submitting ? "Saving…" : <>{confirmLabel} · {formatMoney(payable)} <kbd>Ctrl+Enter</kbd></>}
        </button>
      </div>
    </aside>
  );
}
