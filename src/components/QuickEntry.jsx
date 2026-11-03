import { useEffect, useMemo, useState } from "react";
import { formatMoney } from "../utils/format.js";

/** Code → Enter jumps to quantity → type it → Enter adds the item and returns to the code box. */
export default function QuickEntry({ products, onAdd, onActive, codeRef }) {
  const [code, setCode] = useState("");
  const [qty, setQty] = useState("1");
  const [last, setLast] = useState(null);
  const byCode = useMemo(() => new Map(products.map((p) => [p.code, p])), [products]);
  const match = code ? byCode.get(Number(code)) : null;
  const unknown = code !== "" && !match;

  useEffect(() => onActive?.(match?.code ?? null), [match, onActive]);

  /** Arrow keys walk the catalog: Down = next code, Up = previous (wraps around). */
  const step = (direction) => {
    const index = match ? products.findIndex((p) => p.code === match.code) : -1;
    const next = index === -1 ? (direction > 0 ? 0 : products.length - 1) : (index + direction + products.length) % products.length;
    setCode(String(products[next].code));
  };

  const submit = () => {
    if (!match) return;
    const quantity = Math.max(1, parseInt(qty, 10) || 1);
    onAdd(match, quantity);
    setLast({ product: match, quantity });
    setCode("");
    setQty("1");
    codeRef.current?.focus();
  };

  const onCodeKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (match) e.currentTarget.closest(".quick-entry").querySelector("[data-qty]").select();
    } else if (e.key === "*" || e.key === " " || e.key.toLowerCase() === "x") {
      e.preventDefault();
      if (code) e.currentTarget.closest(".quick-entry").querySelector("[data-qty]").select();
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      step(e.key === "ArrowDown" ? 1 : -1);
    } else if (e.key === "Escape") {
      setCode("");
    }
  };

  const onQtyKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const delta = e.key === "ArrowUp" ? 1 : -1;
      setQty(String(Math.max(1, (parseInt(qty, 10) || 1) + delta)));
    }
  };

  return (
    <div className="app-card quick-entry p-3">
      <div className="d-flex align-items-end gap-2">
        <label className="qe-field qe-code">
          <span className="qe-label">Item code <kbd>F2</kbd></span>
          <input
            ref={codeRef}
            autoFocus
            inputMode="numeric"
            className={`form-control form-control-lg qe-input ${unknown ? "is-invalid" : ""}`}
            placeholder="e.g. 12"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 3))}
            onKeyDown={onCodeKey}
          />
        </label>
        <label className="qe-field qe-qty">
          <span className="qe-label">Qty</span>
          <input
            data-qty
            inputMode="numeric"
            className="form-control form-control-lg qe-input text-center"
            value={qty}
            onChange={(e) => setQty(e.target.value.replace(/\D/g, "").slice(0, 5))}
            onFocus={(e) => e.target.select()}
            onKeyDown={onQtyKey}
          />
        </label>
        <button className="btn btn-primary btn-lg qe-add" disabled={!match} onClick={submit}>Add</button>
      </div>

      <div className="qe-preview mt-2" aria-live="polite">
        {match ? (
          <span>
            <span className="code-badge">{match.code}</span> <strong>{match.name}</strong>
            <span className="text-secondary d-block d-sm-inline"><span className="d-none d-sm-inline"> · </span>{match.name_ta}</span>
            <span className="num fw-semibold text-success ms-sm-2">{formatMoney(match.price)}</span>
            <s className="ms-1 small text-secondary num">{formatMoney(match.mrp)}</s>
          </span>
        ) : unknown ? (
          <span className="text-danger">No item with code {code}</span>
        ) : last ? (
          <span className="text-success">
            ✓ Added {last.quantity} × <strong>{last.product.name}</strong>
          </span>
        ) : (
          <span className="text-secondary">Type a code → <kbd>Enter</kbd> → type quantity → <kbd>Enter</kbd> to add · <kbd>↑</kbd><kbd>↓</kbd> browse items</span>
        )}
      </div>
    </div>
  );
}
