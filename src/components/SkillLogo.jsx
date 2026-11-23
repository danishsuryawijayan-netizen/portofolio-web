const frame = (children) => (
  <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
    {children}
  </svg>
);

const label = (text, size, fill = '#fff') => (
  <text
    x="24"
    y="25"
    textAnchor="middle"
    dominantBaseline="central"
    fontSize={size}
    fontWeight="800"
    fill={fill}
  >
    {text}
  </text>
);

const shield = (color, glyph) =>
  frame(
    <>
      <path d="M8 6h32l-3 32-13 4-13-4z" fill={color} />
      {label(glyph, 18)}
    </>,
  );

const hexagon = (color, glyph, size = 12) =>
  frame(
    <>
      <polygon points="24,3 42,13.5 42,34.5 24,45 6,34.5 6,13.5" fill={color} />
      {label(glyph, size)}
    </>,
  );

const tile = (color, glyph, textColor = '#fff', size = 14) =>
  frame(
    <>
      <rect x="4" y="4" width="40" height="40" rx="9" fill={color} />
      {label(glyph, size, textColor)}
    </>,
  );

const reactAtom = (color) =>
  frame(
    <g fill="none" stroke={color} strokeWidth="2.2">
      <ellipse cx="24" cy="24" rx="20" ry="8.5" />
      <ellipse cx="24" cy="24" rx="20" ry="8.5" transform="rotate(60 24 24)" />
      <ellipse cx="24" cy="24" rx="20" ry="8.5" transform="rotate(120 24 24)" />
      <circle cx="24" cy="24" r="3.4" fill={color} stroke="none" />
    </g>,
  );

// Logo di-approximasi dengan bentuk sederhana. Ganti dengan SVG resmi dari pemilik merek jika ingin akurat.
const LOGOS = {
  html: shield('#E34F26', '5'),
  css: shield('#1572B6', '3'),
  javascript: tile('#F7DF1E', 'JS', '#111', 15),
  react: reactAtom('#61DAFB'),
  r3f: reactAtom('#00C8FF'),
  vite: frame(<polygon points="28,3 10,27 21,27 17,45 37,19 26,19" fill="#BD34FE" />),
  threejs: frame(
    <g fill="none" stroke="#111" strokeWidth="2.4" strokeLinejoin="round">
      <path d="M24 6 40 14 24 22 8 14Z" />
      <path d="M8 14v20l16 8V22" />
      <path d="M40 14v20l-16 8" />
    </g>,
  ),
  webgl: hexagon('#E0523A', 'GL', 12),
  glsl: hexagon('#7B5CFF', 'GLSL', 8),
  gsap: frame(
    <>
      <circle cx="24" cy="24" r="21" fill="#88CE02" />
      {label('gs', 14)}
    </>,
  ),
  canvas: frame(
    <>
      <rect x="6" y="8" width="36" height="32" rx="6" fill="none" stroke="#FF6B3D" strokeWidth="2.4" />
      <path d="M6 20h36M6 28h36M18 8v32M30 8v32" stroke="#FF6B3D" strokeWidth="1.2" opacity="0.6" />
      <circle cx="24" cy="24" r="3.5" fill="#FF6B3D" />
    </>,
  ),
  nodejs: hexagon('#5FA04E', 'N', 15),
  git: frame(
    <>
      <path d="M24 4 44 24 24 44 4 24Z" fill="#F05032" />
      <path d="M18 17v14h12" fill="none" stroke="#fff" strokeWidth="2" />
      <circle cx="18" cy="17" r="3" fill="#fff" />
      <circle cx="18" cy="31" r="3" fill="#fff" />
      <circle cx="30" cy="31" r="3" fill="#fff" />
    </>,
  ),
};

export default function SkillLogo({ id }) {
  return LOGOS[id] ?? null;
}