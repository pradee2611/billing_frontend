export default function CategoryChips({ categories, value, onChange }) {
  return (
    <div className="chips">
      {["All", ...categories].map((name) => (
        <button
          key={name}
          type="button"
          className={`chip ${value === name ? "active" : ""}`}
          onClick={() => onChange(name)}
        >
          {name}
        </button>
      ))}
    </div>
  );
}
