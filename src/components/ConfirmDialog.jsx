import { useEffect, useState } from "react";

/** Blocking yes/no prompt. Cancel is focused by default so a stray Enter never confirms.
 * With `requireText` the confirm button stays disabled until that word is typed (case-insensitive). */
export default function ConfirmDialog({ title, children, confirmLabel, danger, busy, error, requireText, onConfirm, onCancel }) {
  const [typed, setTyped] = useState("");
  const unlocked = !requireText || typed.trim().toLowerCase() === requireText.toLowerCase();
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && !busy && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel, busy]);

  return (
    <>
      <div className="modal d-block" tabIndex="-1" role="alertdialog" aria-modal="true" onClick={() => !busy && onCancel()}>
        <div className="modal-dialog modal-dialog-centered modal-sm-wide" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-body p-4">
              <h2 className="h5 fw-bold mb-2">{title}</h2>
              <div className="text-secondary">{children}</div>
              {requireText && (
                <div className="mt-3">
                  <label className="small fw-semibold d-block mb-1" htmlFor="confirm-text">
                    Type <code className="fs-6">{requireText}</code> to confirm
                  </label>
                  <input
                    id="confirm-text"
                    className="form-control"
                    autoFocus
                    autoComplete="off"
                    value={typed}
                    disabled={busy}
                    placeholder={requireText}
                    onChange={(e) => setTyped(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && unlocked && !busy && onConfirm()}
                  />
                </div>
              )}
              {error && <div className="alert alert-danger py-2 small mt-3 mb-0">{error}</div>}
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline-secondary" autoFocus={!requireText} disabled={busy} onClick={onCancel}>Cancel</button>
              <button className={`btn ${danger ? "btn-danger" : "btn-primary"}`} disabled={busy || !unlocked} onClick={onConfirm}>
                {busy ? "Please wait…" : confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" />
    </>
  );
}
