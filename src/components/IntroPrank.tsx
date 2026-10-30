import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { celebrate } from '../heartEffects'

// Línea de tiempo de la broma, en segundos desde que carga la página.
const T_LOADING = 2.7   // "Cargando…" parece normal
const T_BREACH = 4.1    // error falso: conexión interceptada
const T_ALERT = 9.9     // sale la alerta grande y la cuenta regresiva
const T_END = 13.9      // se revela que era broma
const TYPE_SPEED = 40   // letras por segundo al "escribir" comandos

// La diablita que se ríe en la pantalla de "era broma" (versión liviana de images/personaje/evil.png).
const EVIL = import.meta.env.BASE_URL + 'images/personaje/evil.webp'

const COMMANDS = [
  '$ ./rastrear --objetivo hetto',
  '> conectando al servidor ..... OK',
  '> evadiendo cortafuegos ...... OK',
  '> accediendo al dispositivo .. OK',
]
const COMMAND_START = [0.2, 0.95, 1.7, 2.45]
const PROGRESS_START = 3.2
const ROWS_START = 3.6

// Texto de relleno para el fondo: hexadecimal que corre, como un volcado de memoria.
const HEX = Array.from({ length: 56 }, (_, line) =>
  Array.from({ length: 26 }, (_, group) => {
    const value = Math.sin((line * 26 + group + 1) * 12.9898) * 43758.5453
    return Math.floor((value - Math.floor(value)) * 0xffffffff).toString(16).padStart(8, '0')
  }).join(' '))

// Posiciones fijas (sin azar en el render) para la lluvia de "67" y los stickers de memes de la pantalla de "era broma".
const hash = (index: number, salt: number) => {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453
  return value - Math.floor(value)
}
const RAIN_COLORS = ['#ffffff', '#ff6f9c', '#c0457a', '#ffe14a']
const RAIN: CSSProperties[] = Array.from({ length: 18 }, (_, index) => ({
  left: `${(index / 18) * 100 + hash(index, 1) * 4}%`,
  fontSize: `${22 + hash(index, 2) * 30}px`,
  color: RAIN_COLORS[index % RAIN_COLORS.length],
  opacity: 0.28 + hash(index, 3) * 0.3,
  animationDuration: `${6 + hash(index, 4) * 6}s`,
  animationDelay: `${-hash(index, 5) * 12}s`,
}))

// Memes y bromas de internet que flotan alrededor. Van en los costados para no tapar el título ni el botón.
const meme = (text: string, x: number, y: number, size: number, rotate: number, delay: number): { text: string; style: CSSProperties } => ({
  text,
  style: { left: `${x}%`, top: `${y}%`, '--s': size, '--r': `${rotate}deg`, '--d': `${delay}s` } as CSSProperties,
})
const MEMES = [
  meme('67', 4, 20, 84, -14, 0.9), meme('67', 80, 50, 104, 12, 1.2), meme('SUS', 6, 58, 40, -10, 1.5),
  meme('XD', 82, 16, 48, 14, 1.1), meme('💀', 22, 12, 44, -8, 1.8), meme('GG', 66, 70, 40, -12, 2.0),
  meme('BRUH', 3, 38, 34, 8, 2.2), meme('🗿', 88, 34, 54, 10, 1.6), meme('aura +67', 60, 8, 28, -6, 2.4),
  meme('😭', 12, 72, 44, 12, 2.6), meme('🤨', 88, 64, 42, -14, 2.1), meme('L', 34, 80, 46, -9, 2.8),
]

type Device = { os: string; browser: string; screen: string; language: string; timezone: string; time: string }

// Datos que ya conoce el propio navegador. Se leen aquí, se muestran en pantalla y no se envían a ningún lado.
function readDevice(): Device {
  const ua = navigator.userAgent
  const os = /Windows/.test(ua) ? 'Windows' : /Android/.test(ua) ? 'Android' : /iPhone|iPad/.test(ua) ? 'iOS'
    : /Mac OS X/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : 'Desconocido'
  const browser = /Edg\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /Firefox\//.test(ua) ? 'Firefox'
    : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'Navegador'
  return {
    os, browser,
    screen: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language || 'es',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'desconocida',
    time: new Date().toLocaleTimeString('es-PE'),
  }
}

type Props = {
  onDone: () => void
  // La pantalla siguiente ya está debajo: la broma se desvanece para dejarla ver.
  leaving?: boolean
}

// Broma de inicio: parece una carga normal, luego un "hackeo" falso con terminal, reporte y cuenta regresiva,
// y al final se revela que era un chiste. Lo único real son los datos de su propio navegador; IP, ubicación,
// contraseñas y archivos son inventados o tachados.
function IntroPrank({ onDone, leaving = false }: Props) {
  const [elapsed, setElapsed] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [device] = useState(readDevice)

  // Se descarga desde el principio, durante la carga falsa, para que esté lista cuando se revele la broma.
  useEffect(() => {
    const preload = new Image()
    preload.src = EVIL
  }, [])

  useEffect(() => {
    if (revealed) celebrate()
  }, [revealed])

  useEffect(() => {
    if (revealed) return
    const start = performance.now()
    const tick = window.setInterval(() => {
      const seconds = (performance.now() - start) / 1000
      if (seconds >= T_END) setRevealed(true)
      else setElapsed(seconds)
    }, 80)
    return () => window.clearInterval(tick)
  }, [revealed])

  if (revealed) {
    return (
      <div className={`intro intro--reveal ${leaving ? 'is-leaving' : ''}`} role="status" aria-live="polite">
        <div className="reveal-rays" aria-hidden="true" />
        <div className="reveal-rain" aria-hidden="true">
          {RAIN.map((drop, index) => <span key={index} style={drop}>67</span>)}
        </div>
        <div className="reveal-memes" aria-hidden="true">
          {MEMES.map((meme, index) => <span key={index} className="reveal-meme" style={meme.style}>{meme.text}</span>)}
        </div>
        <h1 className="sr-only">¡Era una broma!</h1>
        <div className="reveal-evil" aria-hidden="true">
          <img className="reveal-evil-img" src={EVIL} alt="" />
          <svg className="reveal-glasses" viewBox="0 0 48 16" shapeRendering="crispEdges">
            <path d="M0 2h20v8h-2v2h-4v-2h-12z M28 2h20v8h-2v2h-4v-2h-12z M20 3h8v3h-8z" fill="#0b0b10" />
            <path d="M2 4h4v2h-4z M30 4h4v2h-4z M7 4h2v1h-2z M35 4h2v1h-2z" fill="#fff" opacity=".85" />
          </svg>
        </div>
        <button type="button" className="intro-button intro-button--corner" onClick={onDone}>Continuar →</button>
      </div>
    )
  }

  if (elapsed < T_LOADING) {
    const percent = Math.min(99, Math.round((elapsed / T_LOADING) * 99))
    return (
      <div className="intro intro--loading" role="status" aria-live="polite">
        <div className="intro-box">
          <p className="intro-label">Cargando…</p>
          <div className="intro-bar" aria-hidden="true"><i style={{ width: `${percent}%` }} /></div>
          <p className="intro-percent">{percent}%</p>
        </div>
      </div>
    )
  }

  if (elapsed < T_BREACH) {
    return (
      <div className="intro intro--breach" role="alert">
        <div className="intro-noise" aria-hidden="true" />
        <div className="intro-box">
          <p className="intro-breach-title">⚠ ERROR 0x7F3A</p>
          <p className="intro-breach-text">conexión interceptada</p>
          <div className="intro-bar intro-bar--red" aria-hidden="true"><i style={{ width: '99%' }} /></div>
        </div>
      </div>
    )
  }

  // Terminal + reporte, y encima la alerta final
  const t = elapsed - T_BREACH
  const typed = COMMANDS.map((text, index) => text.slice(0, Math.max(0, Math.floor((t - COMMAND_START[index]) * TYPE_SPEED))))
  const activeLine = typed.findIndex((text, index) => text.length < COMMANDS[index].length)
  const progress = Math.min(100, Math.max(0, Math.round(((t - PROGRESS_START) / 1.4) * 100)))
  const rows: [string, string][] = [
    ['OBJETIVO', 'HETTO'],
    ['DISPOSITIVO', `${device.os} · ${device.browser}`],
    ['PANTALLA', device.screen],
    ['IDIOMA', device.language],
    ['ZONA HORARIA', device.timezone],
    ['HORA LOCAL', device.time],
    ['IP', '███.███.██.███'],
    ['UBICACIÓN', '████████, ██████'],
    ['CONTRASEÑAS', '14 encontradas'],
    ['FOTOS', '6 archivos'],
  ]
  const rowsShown = Math.max(0, Math.min(rows.length, Math.floor((t - ROWS_START) / 0.2) + 1))
  const alert = elapsed >= T_ALERT
  const remaining = Math.max(0, Math.ceil(T_END - elapsed))
  const upload = Math.min(100, Math.round(((elapsed - T_ALERT) / (T_END - T_ALERT)) * 100))

  return (
    <div className={`intro intro--terminal ${alert ? 'is-alert' : ''}`}>
      <div className="intro-hex" aria-hidden="true">
        {/* Dos copias seguidas: al subir la mitad, el bucle no se nota */}
        <div>{[0, 1].map(copy => HEX.map((line, index) => <p key={`${copy}-${index}`}>{line}</p>))}</div>
      </div>
      <div className="term" aria-hidden={alert}>
        <div className="term-bar" aria-hidden="true"><i /><i /><i /><span>root@servidor: ~/objetivos/hetto</span></div>
        <div className="term-body">
          {typed.map((text, index) => text && (
            <p key={index} className="term-line">{text}{index === activeLine && <b className="term-caret" />}</p>
          ))}
          {t >= PROGRESS_START && (
            <div className="term-progress">
              <span>extrayendo datos</span>
              <div className="term-meter"><i style={{ width: `${progress}%` }} /></div>
              <span>{progress}%</span>
            </div>
          )}
          {rowsShown > 0 && (
            <dl className="term-report">
              {rows.slice(0, rowsShown).map(([label, value]) => (
                <div key={label}><dt>{label}</dt><dd className={value.includes('█') ? 'is-redacted' : ''}>{value}</dd></div>
              ))}
            </dl>
          )}
        </div>
      </div>

      {alert && (
        <div className="intro-alertbox" role="alert">
          <div className="intro-box">
            <p className="intro-skull" aria-hidden="true">☠</p>
            <h1 className="intro-alert" data-text="¡HAS SIDO DOXEADA!">¡HAS SIDO DOXEADA!</h1>
            <p className="intro-countdown">Publicando tus datos en <strong>00:0{remaining}</strong></p>
            <div className="intro-bar intro-bar--red" aria-hidden="true"><i style={{ width: `${upload}%` }} /></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default IntroPrank
