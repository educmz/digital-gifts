// Dibujos de pingüinos en SVG, para pintarlos con los colores de cada amigo.
// fur = cuerpo, ear = pico y patitas, cheek = mejillas.

const LINE = '#4a3f6b'
const BELLY = '#ffffff'

type Colors = { fur: string; ear: string; cheek: string }
type Props = Colors & { className?: string }

export function PenguinFace({ fur, ear, cheek, className }: Props) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <ellipse cx="36" cy="95" rx="12" ry="5" fill={ear} stroke={LINE} strokeWidth="2" />
      <ellipse cx="64" cy="95" rx="12" ry="5" fill={ear} stroke={LINE} strokeWidth="2" />
      <ellipse cx="50" cy="55" rx="40" ry="39" fill={fur} stroke={LINE} strokeWidth="3" />
      <ellipse cx="50" cy="72" rx="26" ry="22" fill={BELLY} />
      <circle cx="37" cy="42" r="15" fill={BELLY} />
      <circle cx="63" cy="42" r="15" fill={BELLY} />
      <ellipse cx="50" cy="52" rx="25" ry="15" fill={BELLY} />
      <ellipse className="mascot-eye" cx="38" cy="44" rx="3.8" ry="5.4" fill={LINE} />
      <ellipse className="mascot-eye" cx="62" cy="44" rx="3.8" ry="5.4" fill={LINE} />
      <circle cx="39.4" cy="42" r="1.4" fill="#fff" />
      <circle cx="63.4" cy="42" r="1.4" fill="#fff" />
      <path d="M42 54 H58 L50 63 Z" fill={ear} stroke={LINE} strokeWidth="2" strokeLinejoin="round" />
      <ellipse cx="28" cy="55" rx="6" ry="3.6" fill={cheek} opacity=".75" />
      <ellipse cx="72" cy="55" rx="6" ry="3.6" fill={cheek} opacity=".75" />
    </svg>
  )
}

// Pingüino que se asoma por el borde superior de la carta.
export function PenguinPeek({ fur, ear, cheek, className }: Props) {
  return (
    <svg className={className} viewBox="0 0 160 72" aria-hidden="true">
      <path d="M20 72 C20 32 48 16 80 16 C112 16 140 32 140 72 Z" fill={fur} stroke={LINE} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="62" cy="45" r="17" fill={BELLY} />
      <circle cx="98" cy="45" r="17" fill={BELLY} />
      <ellipse cx="80" cy="57" rx="24" ry="14" fill={BELLY} />
      <ellipse className="mascot-eye" cx="62" cy="45" rx="4.2" ry="6" fill={LINE} />
      <ellipse className="mascot-eye" cx="98" cy="45" rx="4.2" ry="6" fill={LINE} />
      <circle cx="63.6" cy="43" r="1.6" fill="#fff" />
      <circle cx="99.6" cy="43" r="1.6" fill="#fff" />
      <path d="M72 54 H88 L80 63 Z" fill={ear} stroke={LINE} strokeWidth="2" strokeLinejoin="round" />
      <ellipse cx="44" cy="58" rx="7" ry="4" fill={cheek} opacity=".75" />
      <ellipse cx="116" cy="58" rx="7" ry="4" fill={cheek} opacity=".75" />
      <ellipse cx="28" cy="67" rx="15" ry="8" transform="rotate(-8 28 67)" fill={fur} stroke={LINE} strokeWidth="3" />
      <ellipse cx="132" cy="67" rx="15" ry="8" transform="rotate(8 132 67)" fill={fur} stroke={LINE} strokeWidth="3" />
    </svg>
  )
}

// Pingüino dormido con gorrito.
export function SleepingPenguin({ fur, ear, cheek, className }: Props) {
  return (
    <svg className={className} viewBox="0 0 150 124" aria-hidden="true">
      <ellipse cx="50" cy="118" rx="14" ry="5.5" fill={ear} stroke={LINE} strokeWidth="2.5" />
      <ellipse cx="84" cy="118" rx="14" ry="5.5" fill={ear} stroke={LINE} strokeWidth="2.5" />
      <path d="M30 70 Q10 84 18 108 Q32 100 38 84 Z" fill={fur} stroke={LINE} strokeWidth="3" strokeLinejoin="round" />
      <path d="M104 70 Q124 84 116 108 Q102 100 96 84 Z" fill={fur} stroke={LINE} strokeWidth="3" strokeLinejoin="round" />
      <ellipse cx="67" cy="76" rx="40" ry="42" fill={fur} stroke={LINE} strokeWidth="3" />
      <ellipse cx="67" cy="86" rx="27" ry="30" fill={BELLY} />
      <ellipse cx="67" cy="58" rx="27" ry="18" fill={BELLY} />
      <path d="M52 58 q5 5 10 0 M72 58 q5 5 10 0" fill="none" stroke={LINE} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M61 64 H73 L67 71 Z" fill={ear} stroke={LINE} strokeWidth="2" strokeLinejoin="round" />
      <ellipse cx="46" cy="66" rx="6" ry="3.6" fill={cheek} opacity=".75" />
      <ellipse cx="88" cy="66" rx="6" ry="3.6" fill={cheek} opacity=".75" />
      <path d="M38 40 Q50 6 90 22 Q94 32 96 42 Z" fill={cheek} stroke={LINE} strokeWidth="3" strokeLinejoin="round" />
      <rect x="36" y="38" width="62" height="9" rx="4.5" fill={BELLY} stroke={LINE} strokeWidth="3" />
      <circle cx="94" cy="20" r="6.5" fill={BELLY} stroke={LINE} strokeWidth="2.5" />
      <g className="zzz" fill={LINE} fontFamily="Fredoka, sans-serif" fontWeight="700">
        <text x="108" y="44" fontSize="16">z</text>
        <text x="122" y="32" fontSize="12">z</text>
        <text x="132" y="22" fontSize="9">z</text>
      </g>
    </svg>
  )
}

export function Snowflake({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
      {[0, 60, 120].map(angle => (
        <g key={angle} transform={`rotate(${angle} 32 32)`}>
          <path d="M32 6 V58" />
          <path d="M32 15 l-7 -6 M32 15 l7 -6 M32 49 l-7 6 M32 49 l7 6" />
        </g>
      ))}
    </svg>
  )
}
