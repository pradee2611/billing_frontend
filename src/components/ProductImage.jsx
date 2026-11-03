const ACCENTS = ["#e03131", "#f08c00", "#7048e8", "#1c7ed6", "#2f9e44", "#d6336c"];
const DARK = "#2b1d1d";
const GOLD = "#ffd43b";

const CATEGORIES = [
  [/^\d+ cm /i, "sparkler"],
  [/\bShot$/i, "shot"],
  [/Single (Ball|Pipe)|Fancy/i, "fancy"],
  [/Rocket/i, "rocket"],
  [/Paper Bomb/i, "paper"],
  [/Bomb/i, "bomb"],
  [/Flower Pots|Koti/i, "pot"],
  [/Chakkar|Spinner/i, "chakkar"],
  [/Twinkling/i, "star"],
  [/Bijili|Oola/i, "bijili"],
  [/Wala|Chorsa|^\d+ Deluxe/i, "wala"],
  [/Match Box|Gun|Toy Story/i, "kids"],
  [/Helicopter|Drone|Bambaram|Butterfly|Pop Throw|Wonder Throw|Lolli|Photo Flash|Smoke/i, "toy"],
  [/Kuruvi|Lakshmi|Jallikattu|Hulk/i, "single"],
];

export function categoryOf(name) {
  for (const [re, cat] of CATEGORIES) if (re.test(name)) return cat;
  return "fountain";
}

const hash = (s) => [...s].reduce((a, ch) => a + ch.charCodeAt(0), 0);

const Burst = ({ x, y, r = 14, colors = [GOLD, "#ff922b", "#fff3bf"], n = 10 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2;
      const col = colors[i % colors.length];
      return (
        <g key={i}>
          <line x1={x + Math.cos(a) * r * 0.35} y1={y + Math.sin(a) * r * 0.35} x2={x + Math.cos(a) * r * 0.8} y2={y + Math.sin(a) * r * 0.8} stroke={col} strokeWidth="2" strokeLinecap="round" />
          <circle cx={x + Math.cos(a) * r} cy={y + Math.sin(a) * r} r="1.8" fill={col} />
        </g>
      );
    })}
  </g>
);

const Spark = ({ x, y, r = 5 }) => (
  <g transform={`translate(${x} ${y})`} stroke={GOLD} strokeWidth="1.8" strokeLinecap="round">
    {[0, 45, 90, 135].map((a) => <line key={a} x1={-r} y1="0" x2={r} y2="0" transform={`rotate(${a})`} />)}
  </g>
);

const Fuse = ({ d, sx, sy }) => (
  <>
    <path d={d} stroke="#6b4a2b" strokeWidth="2" fill="none" strokeLinecap="round" />
    <Spark x={sx} y={sy} />
  </>
);

const ART = {
  single: (c) => (
    <g transform="rotate(-30 32 36)">
      <rect x="24" y="22" width="16" height="32" rx="3" fill={c} />
      <rect x="24" y="31" width="16" height="7" fill={GOLD} />
      <rect x="24" y="22" width="16" height="5" rx="2" fill={DARK} />
      <Fuse d="M32 22 q1 -6 6 -8" sx={39} sy={13} />
    </g>
  ),
  wala: (c) => {
    const pts = Array.from({ length: 7 }, (_, i) => {
      const t = (i + 0.5) / 7;
      return [6 + 52 * t, 18 + 32 * t * (1 - t)];
    });
    return (
      <g>
        <path d="M6 18 Q32 34 58 18" stroke="#6b4a2b" strokeWidth="2" fill="none" />
        {pts.map(([x, y], i) => (
          <g key={i}>
            <rect x={x - 3} y={y} width="6" height="16" rx="2" fill={c} />
            <rect x={x - 3} y={y + 6} width="6" height="3" fill={GOLD} />
          </g>
        ))}
        <Spark x={58} y={14} />
      </g>
    );
  },
  bijili: (c) => (
    <g>
      {[-24, -8, 8, 24].map((a) => (
        <g key={a} transform={`rotate(${a} 32 56)`}>
          <rect x="29.5" y="22" width="5" height="32" rx="2" fill={a % 16 ? c : DARK} />
          <rect x="29.5" y="30" width="5" height="3" fill={GOLD} />
        </g>
      ))}
      <rect x="22" y="48" width="20" height="9" rx="2" fill="#fff" stroke={DARK} strokeWidth="1.5" />
      <Spark x={50} y={18} />
    </g>
  ),
  bomb: (c) => (
    <g>
      <circle cx="32" cy="38" r="18" fill="#2b2b36" />
      <path d="M20 30 q4 -8 12 -9" stroke="#6b6b80" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="32" cy="40" r="6" fill={c} />
      <Fuse d="M32 20 q2 -8 9 -10" sx={43} sy={9} />
    </g>
  ),
  paper: (c) => (
    <g>
      <circle cx="32" cy="40" r="17" fill="#f3e2c0" stroke="#c9a46b" strokeWidth="2" />
      <polygon points="25,26 39,26 36,15 28,15" fill="#e8cf9b" stroke="#c9a46b" strokeWidth="1.5" />
      <rect x="15" y="38" width="34" height="7" fill={c} />
      <Spark x={44} y={12} />
    </g>
  ),
  rocket: (c) => (
    <g transform="rotate(35 32 32)">
      <rect x="31" y="42" width="2" height="18" fill="#a8743a" />
      <rect x="25" y="16" width="14" height="28" rx="3" fill={c} />
      <polygon points="25,18 39,18 32,4" fill={DARK} />
      <polygon points="25,38 18,48 25,44" fill={GOLD} />
      <polygon points="39,38 46,48 39,44" fill={GOLD} />
      <rect x="25" y="26" width="14" height="5" fill="#fff" opacity=".85" />
    </g>
  ),
  pot: (c) => (
    <g>
      {[-55, -28, 0, 28, 55].map((a, i) => (
        <g key={a} transform={`rotate(${a} 32 36)`}>
          <line x1="32" y1="30" x2="32" y2="12" stroke={[GOLD, "#ff922b", "#fff3bf", "#ff6b6b", GOLD][i]} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="32" cy="9" r="2" fill={GOLD} />
        </g>
      ))}
      <polygon points="19,58 45,58 41,38 23,38" fill={c} />
      <rect x="21" y="34" width="22" height="6" rx="2" fill={DARK} />
    </g>
  ),
  chakkar: (c) => (
    <g>
      <circle cx="32" cy="34" r="15" fill="none" stroke={c} strokeWidth="5" />
      {[0, 60, 120].map((a) => <line key={a} x1="32" y1="19" x2="32" y2="49" stroke={DARK} strokeWidth="2" transform={`rotate(${a} 32 34)`} />)}
      <circle cx="32" cy="34" r="4.5" fill={GOLD} />
      <path d="M50 24 q6 6 2 14" stroke={GOLD} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M14 44 q-6 -6 -2 -14" stroke="#ff922b" strokeWidth="2" fill="none" strokeLinecap="round" />
      <Spark x={52} y={14} />
    </g>
  ),
  star: (c) => (
    <g>
      <path d="M32 8 L37 27 L56 32 L37 37 L32 56 L27 37 L8 32 L27 27 Z" fill={GOLD} stroke={c} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="32" cy="32" r="4" fill={c} />
      <Spark x={50} y={12} r={4} />
      <Spark x={14} y={50} r={4} />
    </g>
  ),
  fountain: (c) => (
    <g>
      {[-52, -26, 0, 26, 52].map((a, i) => (
        <g key={a} transform={`rotate(${a} 32 40)`}>
          <line x1="32" y1="38" x2="32" y2={[16, 10, 8, 10, 16][i]} stroke={[GOLD, "#ff922b", "#fff3bf", "#ff922b", GOLD][i]} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="32" cy={[13, 7, 5, 7, 13][i]} r="2" fill={[c, GOLD, "#fff", GOLD, c][i]} />
        </g>
      ))}
      <rect x="22" y="38" width="20" height="6" rx="2" fill={DARK} />
      <rect x="24" y="44" width="16" height="14" rx="3" fill={c} />
      <rect x="24" y="49" width="16" height="3" fill={GOLD} />
    </g>
  ),
  fancy: (c) => (
    <g>
      <Burst x={32} y={21} r={17} colors={[GOLD, c, "#fff3bf"]} n={12} />
      <rect x="26" y="42" width="12" height="16" rx="2" fill={c} />
      <rect x="26" y="48" width="12" height="3" fill={GOLD} />
    </g>
  ),
  shot: (c) => (
    <g>
      <Burst x={20} y={18} r={11} colors={[GOLD, c]} n={9} />
      <Burst x={44} y={14} r={10} colors={["#ff922b", "#fff3bf"]} n={9} />
      <rect x="8" y="34" width="48" height="24" rx="3" fill={c} />
      {[16, 26, 36, 46].map((x) => <circle key={x} cx={x} cy="40" r="3.5" fill={DARK} />)}
      <rect x="8" y="48" width="48" height="4" fill={GOLD} />
    </g>
  ),
  sparkler: (c) => (
    <g>
      <line x1="12" y1="56" x2="40" y2="28" stroke="#9ca3af" strokeWidth="3" strokeLinecap="round" />
      <line x1="12" y1="56" x2="26" y2="42" stroke={c} strokeWidth="3" strokeLinecap="round" />
      <Burst x={44} y={22} r={13} colors={[GOLD, "#fff3bf", "#ff922b"]} n={12} />
    </g>
  ),
  kids: (c) => (
    <g>
      {[22, 32, 42].map((x) => (
        <g key={x}>
          <line x1={x} y1="28" x2={x} y2="14" stroke="#c9a46b" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx={x} cy="13" r="3.5" fill="#e03131" />
        </g>
      ))}
      <rect x="12" y="28" width="40" height="26" rx="3" fill={c} />
      <rect x="12" y="35" width="40" height="11" fill="#fff7e6" />
      <rect x="12" y="46" width="40" height="3" fill={DARK} opacity=".35" />
    </g>
  ),
  toy: (c) => (
    <g>
      <line x1="10" y1="22" x2="54" y2="22" stroke={DARK} strokeWidth="3" strokeLinecap="round" />
      <line x1="30" y1="22" x2="30" y2="32" stroke={DARK} strokeWidth="3" />
      <ellipse cx="30" cy="40" rx="15" ry="9" fill={c} />
      <ellipse cx="25" cy="38" rx="6" ry="4" fill="#fff" opacity=".75" />
      <rect x="42" y="37" width="16" height="4" rx="2" fill={c} />
      <line x1="18" y1="52" x2="42" y2="52" stroke={DARK} strokeWidth="2.5" strokeLinecap="round" />
      <Spark x={54} y={12} r={4} />
    </g>
  ),
};

export default function ProductImage({ name, size = 56 }) {
  const accent = ACCENTS[hash(name) % ACCENTS.length];
  const art = ART[categoryOf(name)](accent);
  return (
    <span className="product-img" style={{ width: size, height: size, background: `linear-gradient(145deg, ${accent}22, #fff7e6)` }}>
      <svg viewBox="0 0 64 64" width={size * 0.86} height={size * 0.86} role="img" aria-label={name}>{art}</svg>
    </span>
  );
}
