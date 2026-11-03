export default function SearchBar({ value, onChange, placeholder = "Search items" }) {
  return (
    <input
      type="search"
      className="form-control"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
