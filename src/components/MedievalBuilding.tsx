const MedievalBuilding = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 300 380"
    fill="none"
    stroke="hsl(348, 50%, 28%)"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Ground / base */}
    <line x1="30" y1="350" x2="270" y2="350" />

    {/* Main palazzo body */}
    <rect x="60" y="120" width="140" height="230" />

    {/* Main door - arched */}
    <path d="M110,350 L110,300 Q130,275 150,300 L150,350" />

    {/* Windows row 1 */}
    <path d="M80,155 L80,185 Q90,145 100,185 L100,155" />
    <path d="M120,155 L120,185 Q130,145 140,185 L140,155" />
    <path d="M160,155 L160,185 Q170,145 180,185 L180,155" />

    {/* Windows row 2 */}
    <path d="M80,215 L80,245 Q90,205 100,245 L100,215" />
    <path d="M120,215 L120,245 Q130,205 140,245 L140,215" />
    <path d="M160,215 L160,245 Q170,205 180,245 L180,215" />

    {/* Windows row 3 - smaller */}
    <rect x="82" y="280" width="16" height="20" rx="8" />
    <rect x="122" y="280" width="16" height="20" rx="8" />
    <rect x="162" y="280" width="16" height="20" rx="8" />

    {/* Merlature top of palazzo */}
    <line x1="60" y1="120" x2="60" y2="108" />
    <line x1="60" y1="108" x2="72" y2="108" />
    <line x1="72" y1="108" x2="72" y2="120" />
    <line x1="80" y1="120" x2="80" y2="108" />
    <line x1="80" y1="108" x2="92" y2="108" />
    <line x1="92" y1="108" x2="92" y2="120" />
    <line x1="100" y1="120" x2="100" y2="108" />
    <line x1="100" y1="108" x2="112" y2="108" />
    <line x1="112" y1="108" x2="112" y2="120" />
    <line x1="120" y1="120" x2="120" y2="108" />
    <line x1="120" y1="108" x2="132" y2="108" />
    <line x1="132" y1="108" x2="132" y2="120" />
    <line x1="140" y1="120" x2="140" y2="108" />
    <line x1="140" y1="108" x2="152" y2="108" />
    <line x1="152" y1="108" x2="152" y2="120" />
    <line x1="160" y1="120" x2="160" y2="108" />
    <line x1="160" y1="108" x2="172" y2="108" />
    <line x1="172" y1="108" x2="172" y2="120" />
    <line x1="180" y1="120" x2="180" y2="108" />
    <line x1="180" y1="108" x2="192" y2="108" />
    <line x1="192" y1="108" x2="192" y2="120" />
    <line x1="196" y1="120" x2="196" y2="108" />
    <line x1="196" y1="108" x2="200" y2="108" />
    <line x1="200" y1="108" x2="200" y2="120" />

    {/* Tower (torre civica) */}
    <rect x="200" y="40" width="55" height="310" />

    {/* Tower pointed top */}
    <polygon points="200,40 227,5 255,40" />

    {/* Tower windows */}
    <path d="M212,75 L212,100 Q220,65 228,100 L228,75" />
    <path d="M212,130 L212,155 Q220,120 228,155 L228,130" />
    <path d="M212,190 L212,215 Q220,180 228,215 L228,190" />
    <rect x="214" y="260" width="12" height="18" rx="6" />
    <rect x="214" y="310" width="12" height="18" rx="6" />

    {/* Tower merlature */}
    <line x1="200" y1="40" x2="200" y2="32" />
    <line x1="200" y1="32" x2="210" y2="32" />
    <line x1="210" y1="32" x2="210" y2="40" />
    <line x1="216" y1="40" x2="216" y2="32" />
    <line x1="216" y1="32" x2="226" y2="32" />
    <line x1="226" y1="32" x2="226" y2="40" />
    <line x1="232" y1="40" x2="232" y2="32" />
    <line x1="232" y1="32" x2="242" y2="32" />
    <line x1="242" y1="32" x2="242" y2="40" />
    <line x1="248" y1="40" x2="248" y2="32" />
    <line x1="248" y1="32" x2="255" y2="32" />
    <line x1="255" y1="32" x2="255" y2="40" />

    {/* Small tree / shrub beside building */}
    <ellipse cx="45" cy="310" rx="18" ry="30" />
    <line x1="45" y1="340" x2="45" y2="350" />
    <ellipse cx="42" cy="295" rx="12" ry="18" />
  </svg>
);

export default MedievalBuilding;
