export default function QuantityInput({ value, onChange, size = "sm" }) {
  const set = (next) => onChange(Math.max(1, Math.min(10000, next || 1)));
  return (
    <div className={`input-group input-group-${size} qty-input`}>
      <button type="button" className="btn btn-outline-secondary" onClick={() => set(value - 1)} aria-label="Decrease">−</button>
      <input
        className="form-control text-center px-1"
        inputMode="numeric"
        value={value}
        onChange={(e) => set(parseInt(e.target.value, 10))}
        aria-label="Quantity"
      />
      <button type="button" className="btn btn-outline-secondary" onClick={() => set(value + 1)} aria-label="Increase">+</button>
    </div>
  );
}
