export default function BrandLogo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="brand-logo">
      <circle cx="32" cy="32" r="30" fill="#7a0c1c" stroke="#ffd43b" strokeWidth="2" />
      <g stroke="#ffd43b" strokeWidth="4" strokeLinecap="round">
        <path d="M32 12v12M32 40v12M12 32h12M40 32h12" />
      </g>
      <g stroke="#ff922b" strokeWidth="3.5" strokeLinecap="round">
        <path d="M18 18l8 8M38 38l8 8M46 18l-8 8M26 38l-8 8" />
      </g>
      <circle cx="32" cy="32" r="4.5" fill="#fff3bf" />
    </svg>
  );
}

export function BrandName({ tamil = true, className = "" }) {
  return (
    <span className={`brand-name ${className}`}>
      <span className="brand-en">Friends Crackers</span>
      {tamil && <span className="brand-ta">பட்டாசு கடை</span>}
    </span>
  );
}
