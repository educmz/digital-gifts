import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { heartMetrics, warp } from '../nightWarp'

// Posiciones pseudoaleatorias pero fijas, para que el render sea puro y estable.
const rand = (index: number, salt: number) => {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453
  return value - Math.floor(value)
}

const STARS = Array.from({ length: 34 }, (_, index) => ({
  style: {
    left: `${rand(index, 1) * 100}%`,
    top: `${rand(index, 2) * 62}%`,
    width: `${6 + rand(index, 3) * 12}px`,
    animationDelay: `${-rand(index, 4) * 6}s`,
    animationDuration: `${2.4 + rand(index, 5) * 3}s`,
  } as CSSProperties,
}))

// [alto en %, ancho en px, duración en s, desfase en s]
const CLOUDS = [
  [8, 210, 95, -20], [20, 150, 70, -52], [34, 260, 120, -80], [14, 180, 105, -4], [44, 130, 80, -35],
]

const BALLOON_COLORS = ['#ffb3d1', '#cdb8ff', '#a9ecd0', '#ffe08a', '#ffffff', '#ff9fc4']
const BALLOONS = Array.from({ length: 7 }, (_, index) => ({
  style: {
    left: `${6 + rand(index, 11) * 86}%`,
    width: `${34 + rand(index, 12) * 30}px`,
    animationDuration: `${26 + rand(index, 13) * 22}s`,
    animationDelay: `${-rand(index, 14) * 40}s`,
    '--sway': `${3.6 + rand(index, 15) * 3}s`,
  } as CSSProperties,
  color: BALLOON_COLORS[index % BALLOON_COLORS.length],
}))

// Brillos dorados y rosados sobre las nubes de abajo
const SPARKLES = Array.from({ length: 14 }, (_, index) => ({
  left: `${rand(index, 21) * 100}%`,
  bottom: `calc(var(--bank-h) * ${(0.12 + rand(index, 22) * 0.75).toFixed(2)})`,
  width: `${7 + rand(index, 23) * 9}px`,
  background: index % 2 ? '#ffd27a' : '#ff9fc4',
  animationDelay: `${-rand(index, 24) * 5}s`,
  animationDuration: `${2 + rand(index, 25) * 2.5}s`,
} as CSSProperties))

// Contorno de un corazón (16 puntos) en unidades arbitrarias; la punta de abajo es el punto (0, -17).
const HEART = Array.from({ length: 16 }, (_, index) => {
  const t = (index / 16) * Math.PI * 2
  return [
    16 * Math.sin(t) ** 3,
    13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t),
  ]
})

const STAR_COLORS = ['#ffffff', '#fff3c4', '#ffd9ec', '#d9ddff']
const TWO_PI = Math.PI * 2

type NightStar = { x: number; y: number; z: number; phase: number; color: string }
type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; color: string; cross: boolean }

const SPARK_COLORS = ['#ffffff', '#fff3c4', '#ffd27a', '#ffb3d6', '#cfc2ff']

// Estrellas de la noche. Caen hacia abajo (la cámara sube) más rápido cuanto mayor es warp.speed,
// y al final se dibuja la constelación en forma de corazón con la punta en el lugar donde llega el deseo.
function NightCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const activeRef = useRef(active)
  const offAtRef = useRef(0)
  const startRef = useRef<() => void>(() => {})

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let frame = 0
    let last = 0
    let running = false
    let stars: NightStar[] = []

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      const count = Math.min(260, Math.max(120, Math.round((width * height) / 8000)))
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width, y: Math.random() * height, z: 0.15 + Math.random() * 0.85,
        phase: Math.random() * TWO_PI, color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      }))
    }

    // Corazón de estrellas grande, centrado donde llega la estrella del deseo. Se dibuja desde la punta de abajo hacia
    // arriba por los dos lados a la vez, y cada estrellita aparece con un "pop"; al terminar, titilan.
    const drawHeart = (time: number) => {
      const { unit, cx, tipY } = heartMetrics(width, height)
      const at = (index: number): [number, number] => [cx + HEART[index][0] * unit, tipY - (HEART[index][1] + 17) * unit]
      const progress = warp.constellation * 8
      const right = (k: number) => at(8 - k)
      const left = (k: number) => at((8 + k) % 16)
      context.save()
      context.shadowColor = '#ffe9a8'
      context.shadowBlur = 10
      context.strokeStyle = '#ffe9a8'
      context.lineWidth = Math.max(1.6, unit * 0.16)
      context.lineCap = 'round'
      context.setLineDash([unit * 0.5, unit * 0.45])
      context.globalAlpha = 0.85
      for (const side of [right, left]) {
        context.beginPath()
        const [sx, sy] = side(0)
        context.moveTo(sx, sy)
        const whole = Math.floor(progress)
        for (let k = 1; k <= whole; k++) { const [x, y] = side(k); context.lineTo(x, y) }
        if (whole < 8) {
          const [fx, fy] = side(whole)
          const [nx, ny] = side(whole + 1)
          const part = progress - whole
          context.lineTo(fx + (nx - fx) * part, fy + (ny - fy) * part)
        }
        context.stroke()
      }
      context.setLineDash([])
      context.shadowBlur = 14
      context.fillStyle = '#fff'
      for (let k = 0; k <= 8; k++) {
        const born = progress - k
        if (born <= 0) break
        const pop = Math.min(1, born * 1.6)
        const twinkle = progress >= 8 && !reduce ? 1 + 0.35 * Math.sin(time * 0.004 + k * 1.7) : 1
        const r = unit * 0.24 * (pop < 1 ? 0.4 + 1.5 * pop * (1 - pop * 0.3) : twinkle)
        for (const [x, y] of k === 0 ? [right(0)] : [right(k), left(k)]) {
          context.beginPath()
          context.arc(x, y, Math.max(1.5, r), 0, TWO_PI)
          context.fill()
        }
      }
      context.restore()
    }

    // Chispas: una estela detrás de la estrella mientras viaja y una explosión cuando llega
    let sparks: Spark[] = []
    let spawnDebt = 0
    let seenBurst = warp.burst
    const addSpark = (x: number, y: number, vx: number, vy: number, max: number, size: number) => {
      if (sparks.length > 420) return
      sparks.push({ x, y, vx, vy, life: max, max, size, color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)], cross: Math.random() < 0.35 })
    }
    const drawSparks = (dt: number) => {
      if (reduce) { sparks = []; return }
      if (warp.emit > 0.01 && warp.orbY > 0) {
        spawnDebt += warp.emit * 110 * dt
        while (spawnDebt >= 1) {
          spawnDebt -= 1
          const angle = Math.random() * TWO_PI
          addSpark(warp.orbX + Math.cos(angle) * 14, warp.orbY + Math.sin(angle) * 14, (Math.random() - 0.5) * 70, 40 + Math.random() * 150 + warp.speed * 40, 0.8 + Math.random() * 1.2, 1.5 + Math.random() * 3.5)
        }
      }
      if (warp.burst !== seenBurst) {
        seenBurst = warp.burst
        for (let i = 0; i < 90; i++) {
          const angle = Math.random() * TWO_PI
          const speed = 90 + Math.random() * 380
          addSpark(warp.orbX, warp.orbY, Math.cos(angle) * speed, Math.sin(angle) * speed, 0.9 + Math.random() * 1.3, 2 + Math.random() * 4)
        }
      }
      context.save()
      context.globalCompositeOperation = 'lighter'
      sparks = sparks.filter(spark => {
        spark.life -= dt
        if (spark.life <= 0) return false
        spark.x += spark.vx * dt
        spark.y += spark.vy * dt
        spark.vx *= 0.985
        spark.vy *= 0.985
        const fade = spark.life / spark.max
        context.globalAlpha = Math.min(1, fade * 1.4)
        context.fillStyle = spark.color
        context.strokeStyle = spark.color
        const size = spark.size * (0.4 + fade)
        if (spark.cross) {
          context.lineWidth = Math.max(1, size * 0.45)
          context.beginPath()
          context.moveTo(spark.x - size * 1.8, spark.y); context.lineTo(spark.x + size * 1.8, spark.y)
          context.moveTo(spark.x, spark.y - size * 1.8); context.lineTo(spark.x, spark.y + size * 1.8)
          context.stroke()
        } else {
          context.beginPath()
          context.arc(spark.x, spark.y, size, 0, TWO_PI)
          context.fill()
        }
        return true
      })
      context.restore()
    }
    const draw = (time: number, dt: number) => {
      context.clearRect(0, 0, width, height)
      const speed = reduce ? 0 : warp.speed
      for (const star of stars) {
        star.y += (26 + 240 * speed) * star.z * dt
        if (star.y > height + 12) { star.y = -12; star.x = Math.random() * width }
        const twinkle = reduce ? 1 : 0.65 + 0.35 * Math.sin(time * 0.002 * (0.5 + star.z) + star.phase)
        const radius = 0.5 + star.z * 1.7
        context.globalAlpha = (0.35 + 0.65 * star.z) * twinkle
        context.fillStyle = star.color
        const streak = speed > 1.2 ? (speed - 1) * star.z * 22 : 0
        if (streak > 2) {
          // Estela que se desvanece hacia arriba, como una estrella que pasa rápido.
          const trail = context.createLinearGradient(0, star.y - streak, 0, star.y)
          trail.addColorStop(0, `${star.color}00`)
          trail.addColorStop(1, star.color)
          context.strokeStyle = trail
          context.lineWidth = radius * 1.1
          context.lineCap = 'round'
          context.beginPath()
          context.moveTo(star.x, star.y - streak)
          context.lineTo(star.x, star.y)
          context.stroke()
        }
        context.beginPath()
        context.arc(star.x, star.y, radius, 0, TWO_PI)
        context.fill()
      }
      context.globalAlpha = 1
      if (warp.constellation > 0.01) drawHeart(time)
      drawSparks(dt)
    }

    const tick = (time: number) => {
      const dt = Math.min(0.05, (time - last) / 1000 || 0.016)
      last = time
      // Al amanecer se sigue dibujando mientras el cielo se desvanece y luego se detiene.
      if (!activeRef.current && time > offAtRef.current) {
        context.clearRect(0, 0, width, height)
        running = false
        return
      }
      draw(time, dt)
      frame = requestAnimationFrame(tick)
    }

    const start = () => {
      if (running) return
      running = true
      last = performance.now()
      frame = requestAnimationFrame(tick)
    }
    startRef.current = start

    resize()
    window.addEventListener('resize', resize)
    if (activeRef.current) start()
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(frame)
      running = false
    }
  }, [])

  useEffect(() => {
    activeRef.current = active
    if (active) startRef.current()
    else offAtRef.current = performance.now() + 2800
  }, [active])

  return <canvas ref={canvasRef} className="sky-canvas" />
}

type Props = { night?: boolean }

// Cielo animado: degradado de atardecer, estrellas que titilan, nubes que se desplazan y banco de nubes abajo.
// Con night se hace de noche: aparecen la luna y las estrellas del viaje, y el banco de nubes se hunde.
function SkyBackground({ night = false }: Props) {
  return (
    <div className={`sky ${night ? 'sky--night' : ''}`} aria-hidden="true">
      <div className="sky-glow" />
      {STARS.map((star, index) => <i key={index} className="sky-star" style={star.style} />)}
      <i className="sky-shooting" />
      {CLOUDS.map(([top, width, duration, delay], index) => (
        <div key={index} className="sky-cloud"
          style={{
            top: `${top}%`, '--w': `${width}px`,
            animationDuration: `${duration}s, ${5 + index}s`, animationDelay: `${delay}s, ${-index * 1.3}s`,
          } as CSSProperties} />
      ))}
      <div className="sky-balloons">
        {BALLOONS.map((balloon, index) => (
          <div key={index} className="sky-balloon" style={balloon.style}>
            <svg viewBox="0 0 40 78">
              <path d="M20 2 C34 2 38 16 36 26 C34 38 24 46 20 48 C16 46 6 38 4 26 C2 16 6 2 20 2 Z" fill={balloon.color} />
              <ellipse cx="13" cy="15" rx="4" ry="7" fill="#fff" opacity=".5" transform="rotate(20 13 15)" />
              <path d="M17 48 L23 48 L20 53 Z" fill={balloon.color} />
              <path d="M20 53 q-4 7 0 14 q4 7 0 14" fill="none" stroke="#fff" strokeWidth="1.3" opacity=".7" />
            </svg>
          </div>
        ))}
      </div>
      <div className="sky-night" />
      <NightCanvas active={night} />
      <div className="sky-moon"><i className="sky-moon-disc" /><i className="sky-moon-twinkle sky-moon-twinkle--a" /><i className="sky-moon-twinkle sky-moon-twinkle--b" /></div>
      <div className="sky-bank sky-bank--back" />
      <div className="sky-bank sky-bank--front" />
      <div className="sky-sparkles">
        {SPARKLES.map((sparkle, index) => <i key={index} className="sky-sparkle" style={sparkle} />)}
      </div>
    </div>
  )
}

export default SkyBackground
