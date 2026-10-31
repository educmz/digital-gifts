import { useId } from 'react'
import type { SVGProps } from 'react'

// Dibujos de viaje en SVG puro (sin imágenes ni vídeos): el avión visto desde arriba, una nubecita y la bandera de Perú.

// Avión de pasajeros visto de lado, con la nariz hacia la derecha (+x): fuselaje blanco, ventanillas, ala con motor y cola roja
// (los colores de Perú). Se voltea con scaleX(-1) para ir hacia el otro lado, o se orienta con rotate="auto" sobre un camino.
export function PlaneArt(props: SVGProps<SVGSVGElement>) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 300 90" aria-hidden="true" focusable="false" {...props}>
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".55" stopColor="#f2f7fc" />
          <stop offset="1" stopColor="#c5d6e8" />
        </linearGradient>
        <linearGradient id={`${id}-fin`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0556d" />
          <stop offset="1" stopColor="#d02a47" />
        </linearGradient>
      </defs>
      {/* ala del fondo y motor lejano, un poco más oscuros */}
      <path d="M150 52 L212 52 L186 70 L160 70Z" fill="#cfdeec" />
      {/* aleta de cola */}
      <path d="M20 36 L8 6 Q7 3 11 3 L40 3 Q44 3 46 6 L86 38Z" fill={`url(#${id}-fin)`} stroke="#b82340" strokeWidth="1.6" strokeLinejoin="round" />
      {/* estabilizador */}
      <path d="M26 44 L2 36 L22 33 L60 41Z" fill="#dfeaf5" stroke="#a9c2d8" strokeWidth="1.6" strokeLinejoin="round" />
      {/* fuselaje */}
      <path d="M6 30 C34 36 72 36 118 36 L234 36 C266 36 288 44 297 53 C287 62 264 67 234 67 L112 67 C68 67 30 56 6 38Z"
        fill={`url(#${id}-body)`} stroke="#a9c2d8" strokeWidth="1.8" strokeLinejoin="round" />
      {/* franja roja y ventanillas */}
      <path d="M44 58 L246 58" stroke="#e4344e" strokeWidth="3.4" strokeLinecap="round" />
      <g fill="#7ba6cc">
        {Array.from({ length: 13 }, (_, i) => <circle key={i} cx={78 + i * 12} cy="48" r="2.4" />)}
      </g>
      <path d="M252 45 L274 48 L264 53 L249 51Z" fill="#6fb8e6" stroke="#4f9bcc" strokeWidth="1.3" strokeLinejoin="round" />
      {/* ala cercana con motor */}
      <path d="M124 56 L214 56 L172 86 L138 86Z" fill="#f4f8fc" stroke="#a9c2d8" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M150 56 L156 70 M172 56 L172 70" stroke="#c9d9e8" strokeWidth="1.6" strokeLinecap="round" />
      <ellipse cx="170" cy="76" rx="25" ry="9.5" fill="#fbfdff" stroke="#a9c2d8" strokeWidth="1.8" />
      <ellipse cx="193" cy="76" rx="4" ry="7.2" fill="#6a8cae" />
      {/* luz intermitente de la panza */}
      <circle className="plane-light plane-light--red" cx="112" cy="67" r="3" fill="#ff5a6e" />
    </svg>
  )
}
// Globo aerostático de colores, para decorar el cielo.
export function BalloonArt({ color, accent, ...props }: SVGProps<SVGSVGElement> & { color: string; accent: string }) {
  return (
    <svg viewBox="0 0 60 82" aria-hidden="true" focusable="false" {...props}>
      <path d="M30 2 C8 2 2 22 10 40 C14 49 22 54 24 58 L36 58 C38 54 46 49 50 40 C58 22 52 2 30 2Z" fill={color} />
      <path d="M30 2 C19 14 19 46 26 58 L34 58 C41 46 41 14 30 2Z" fill={accent} />
      <path d="M12 30 Q30 36 48 30" stroke="#ffffffaa" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M24 58 L26 66 M36 58 L34 66" stroke="#8a6a55" strokeWidth="1.6" />
      <rect x="24" y="66" width="12" height="9" rx="2.2" fill="#c98a5a" />
    </svg>
  )
}
// Bandera de Perú: usa la imagen (public/images/personaje/peru-flag.png) y, si no carga, un dibujo propio
// (el emoji 🇵🇪 no se ve como bandera en Windows: sale "PE").
export function PeruFlag({ className }: { className?: string }) {
  return (
    <span className={`peru-flag ${className ?? ''}`} role="img" aria-label="Bandera de Perú">
      <svg viewBox="0 0 30 20" aria-hidden="true" focusable="false">
        <rect width="30" height="20" fill="#fff" />
        <rect width="10" height="20" fill="#d91023" />
        <rect x="20" width="10" height="20" fill="#d91023" />
      </svg>
      <img src={import.meta.env.BASE_URL + 'images/personaje/peru-flag.png'} alt="" onError={event => { event.currentTarget.style.display = 'none' }} />
    </span>
  )
}