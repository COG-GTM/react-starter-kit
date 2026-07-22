interface VialArtProps {
  accent: string;
  label: string;
  className?: string;
}

/** Lightweight SVG "product photo" so the demo needs no image assets. */
export function VialArt({ accent, label, className }: VialArtProps) {
  const id = `g-${label.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label={`${label} vial`}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id={`${id}-fluid`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.15" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="200" height="200" fill={`url(#${id})`} />
      {/* vial body */}
      <rect
        x="78"
        y="52"
        width="44"
        height="112"
        rx="10"
        fill="white"
        stroke={accent}
        strokeWidth="2.5"
      />
      {/* fluid */}
      <rect
        x="82"
        y="108"
        width="36"
        height="52"
        rx="7"
        fill={`url(#${id}-fluid)`}
      />
      {/* cap */}
      <rect x="84" y="38" width="32" height="20" rx="4" fill={accent} />
      <rect
        x="88"
        y="30"
        width="24"
        height="12"
        rx="3"
        fill={accent}
        opacity="0.7"
      />
      {/* label band */}
      <rect x="78" y="82" width="44" height="20" fill="white" opacity="0.85" />
      <line x1="84" y1="88" x2="116" y2="88" stroke={accent} strokeWidth="2" />
      <line
        x1="84"
        y1="94"
        x2="110"
        y2="94"
        stroke={accent}
        strokeWidth="1.5"
        opacity="0.6"
      />
    </svg>
  );
}
