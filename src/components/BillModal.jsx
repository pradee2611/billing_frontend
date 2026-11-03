import { useEffect, useState } from "react";
import { cleanPhone, whatsappUrl } from "../utils/whatsapp.js";
import BillView from "./BillView.jsx";

/** Bill preview with Print and WhatsApp. `primary` adds a main action button (e.g. "New bill"). */
export default function BillModal({ order, onClose, primary }) {
  const [phone, setPhone] = useState(order.customer_phone || "");
  const valid = cleanPhone(phone).length === 10;

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true" onClick={onClose}>
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-body print-area">
              <BillView order={order} />
            </div>
            <div className="modal-footer no-print">
              <div className="d-flex align-items-center gap-2 me-auto">
                {!order.customer_phone && (
                  <input
                    className="form-control form-control-sm wa-phone"
                    inputMode="numeric"
                    placeholder="WhatsApp number"
                    aria-label="WhatsApp number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  />
                )}
                <a
                  className={`btn btn-success ${valid ? "" : "disabled"}`}
                  href={valid ? whatsappUrl(order, phone) : undefined}
                  target="_blank"
                  rel="noreferrer"
                  aria-disabled={!valid}
                  title={valid ? "Open WhatsApp with this bill" : "Enter a 10-digit number"}
                >
                  Send on WhatsApp
                </a>
              </div>
              <button className="btn btn-outline-secondary" onClick={onClose}>Close</button>
              <button className="btn btn-outline-primary" onClick={() => window.print()}>🖨 Print</button>
              {primary && (
                <button className="btn btn-primary" autoFocus onClick={primary.onClick}>{primary.label}</button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show no-print" />
    </>
  );
}
