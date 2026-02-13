const MedievalBuilding = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 280 320"
    fill="none"
    stroke="hsl(348, 50%, 28%)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Tower left */}
    <rect x="40" y="80" width="60" height="200" />
    <rect x="45" y="120" width="16" height="24" rx="8" />
    <rect x="75" y="120" width="16" height="24" rx="8" />
    <rect x="45" y="170" width="16" height="24" rx="8" />
    <rect x="75" y="170" width="16" height="24" rx="8" />
    <rect x="55" y="230" width="30" height="50" rx="15" />
    {/* Tower left top - merlature */}
    <line x1="40" y1="80" x2="40" y2="65" />
    <line x1="40" y1="65" x2="52" y2="65" />
    <line x1="52" y1="65" x2="52" y2="80" />
    <line x1="58" y1="80" x2="58" y2="65" />
    <line x1="58" y1="65" x2="70" y2="65" />
    <line x1="70" y1="65" x2="70" y2="80" />
    <line x1="76" y1="80" x2="76" y2="65" />
    <line x1="76" y1="65" x2="88" y2="65" />
    <line x1="88" y1="65" x2="88" y2="80" />
    <line x1="94" y1="80" x2="94" y2="65" />
    <line x1="94" y1="65" x2="100" y2="65" />
    <line x1="100" y1="65" x2="100" y2="80" />

    {/* Main building */}
    <rect x="100" y="130" width="100" height="150" />
    <rect x="120" y="160" width="20" height="30" rx="10" />
    <rect x="160" y="160" width="20" height="30" rx="10" />
    <rect x="120" y="210" width="20" height="30" rx="10" />
    <rect x="160" y="210" width="20" height="30" rx="10" />
    {/* Main door */}
    <rect x="135" y="240" width="30" height="40" rx="15" />

    {/* Roof main */}
    <polygon points="95,130 150,70 205,130" />

    {/* Tower right */}
    <rect x="200" y="100" width="50" height="180" />
    <rect x="210" y="140" width="14" height="20" rx="7" />
    <rect x="230" y="140" width="14" height="20" rx="7" />
    <rect x="210" y="180" width="14" height="20" rx="7" />
    <rect x="230" y="180" width="14" height="20" rx="7" />
    <rect x="215" y="240" width="24" height="40" rx="12" />
    {/* Tower right pointed top */}
    <polygon points="200,100 225,50 250,100" />

    {/* Ground line */}
    <line x1="20" y1="280" x2="270" y2="280" />
  </svg>
);

export default MedievalBuilding;
