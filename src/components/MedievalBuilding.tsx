const MedievalBuilding = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 240 300"
    fill="none"
    stroke="hsl(348, 50%, 28%)"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Tree left */}
    <ellipse cx="35" cy="238" rx="16" ry="28" />
    <ellipse cx="30" cy="222" rx="10" ry="16" />
    <line x1="35" y1="266" x2="35" y2="275" />

    {/* Main palazzo */}
    <rect x="55" y="95" width="110" height="180" />

    {/* Merlature palazzo */}
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <g key={`m${i}`}>
        <line x1={55 + i * 18} y1="95" x2={55 + i * 18} y2="84" />
        <line x1={55 + i * 18} y1="84" x2={55 + i * 18 + 12} y2="84" />
        <line x1={55 + i * 18 + 12} y1="84" x2={55 + i * 18 + 12} y2="95" />
      </g>
    ))}

    {/* Arched windows row 1 */}
    {[0, 1, 2].map((i) => (
      <path key={`w1${i}`} d={`M${72 + i * 35},125 L${72 + i * 35},148 Q${80 + i * 35},118 ${88 + i * 35},148 L${88 + i * 35},125`} />
    ))}

    {/* Arched windows row 2 */}
    {[0, 1, 2].map((i) => (
      <path key={`w2${i}`} d={`M${72 + i * 35},175 L${72 + i * 35},198 Q${80 + i * 35},168 ${88 + i * 35},198 L${88 + i * 35},175`} />
    ))}

    {/* Small windows row 3 */}
    {[0, 1, 2].map((i) => (
      <rect key={`w3${i}`} x={74 + i * 35} y="228" width="12" height="16" rx="6" />
    ))}

    {/* Main arched door */}
    <path d="M95,275 L95,248 Q110,232 125,248 L125,275" />

    {/* Tower */}
    <rect x="165" y="30" width="45" height="245" />

    {/* Tower pointed roof */}
    <polygon points="165,30 187,0 210,30" />

    {/* Tower arched windows */}
    {[0, 1, 2].map((i) => (
      <path key={`tw${i}`} d={`M177,${60 + i * 60} L177,${82 + i * 60} Q184,${53 + i * 60} ${191},${82 + i * 60} L191,${60 + i * 60}`} />
    ))}

    {/* Tower small window */}
    <rect x="180" y="245" width="10" height="14" rx="5" />

    {/* Ground */}
    <line x1="20" y1="275" x2="220" y2="275" />
  </svg>
);

export default MedievalBuilding;
