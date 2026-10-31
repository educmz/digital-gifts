import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { gsap } from 'gsap'
import { LETTERS, THEMES } from '../content'
import { celebrate } from '../heartEffects'
import { HEART_CENTER_Y, heartMetrics, warp } from '../nightWarp'
import BouncyText from './BouncyText'
import CakeArt from './CakeArt'
import { MascotFace } from './Mascot'
import RoomBackground from './RoomBackground'
import { useBlowDetection } from './useBlowDetection'

type Phase = 'blow' | 'wish' | 'sent'
type Mic = 'off' | 'listening' | 'unavailable'

type Props = {
  onDone: () => void
  // Avisa cuando se hace de noche (al enviar el deseo), para oscurecer el cielo.
  onNight: (night: boolean) => void
  // Avisa cuando se apagan o se prenden las luces de la sala, para esconder la decoración de fiesta.
  onDark: (dark: boolean) => void
}

const BLOW_HINTS = ['¡Toca rápido para soplar!', '¡Sigue así!', '¡Más fuerte!', '¡Ya casi!']

// Sale el pastel con la sala iluminada; se apagan las luces y solo la llama alumbra. Al soplar la vela todo queda
// a oscuras un momento y entonces se prenden las luces. Después se escribe un deseo que viaja entre las estrellas.
// El deseo solo vive en esta pantalla: no se guarda ni se envía a ningún lado.
function CakeScene({ onDone, onNight, onDark }: Props) {
  const [phase, setPhase] = useState<Phase>('blow')
  const [lit, setLit] = useState(true)
  const [lightsOn, setLightsOn] = useState(false)
  const [roomLit, setRoomLit] = useState(false)   // luces de la casa (focos, resplandor)
  const [roomShown, setRoomShown] = useState(false)   // la casa no se ve hasta que se prenden las luces: es la sorpresa
  const [wish, setWish] = useState('')
  const [mic, setMic] = useState<Mic>('off')
  const [arrived, setArrived] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [dipping, setDipping] = useState(false)   // fundido a negro entre la casa y la noche
  const flyerRef = useRef<HTMLDivElement>(null)
  const lanternRef = useRef<HTMLDivElement>(null)
  const orbRef = useRef<HTMLDivElement>(null)
  const darkRef = useRef<HTMLDivElement>(null)
  const flameRef = useRef<SVGCircleElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const poses = useRef({ blowY: 0, wishY: 0, wishScale: 1, blowScale: 1, rugY: 0, rugScale: 1 })
  const onRug = useRef(false)   // true cuando la torta ya pasó a la alfombra (se cambia en la oscuridad total)
  const phaseRef = useRef<Phase>('blow')
  const light = useRef({ r: 0, alpha: 0 })   // radio de la luz de la vela y qué tan oscura está la sala (lo anima GSAP)
  const canBlow = useRef(false)
  const power = useRef(0)   // fuerza del soplido (0 a 1): sube con cada toque y la llama la va bajando sola
  const flare = useRef(0)   // la llama se reaviva de golpe cada tanto (0 a 1)
  const blowRef = useRef<() => void>(() => {})
  const [level, setLevel] = useState(0)   // frase de ánimo según qué tan cerca está de apagarse
  const doneRef = useRef(onDone)
  const nightRef = useRef(onNight)
  const darkNotifyRef = useRef(onDark)

  useEffect(() => {
    doneRef.current = onDone
    nightRef.current = onNight
    darkNotifyRef.current = onDark
  })

  // El pastel aparece solo en la oscuridad, alumbrado por la llama; la casa todavía no se ve.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // La luz de la vela debe alcanzar para alumbrar todo el pastel, sea cual sea su tamaño (offsetHeight ignora la animación de entrada).
    const cake = wrapRef.current?.offsetHeight ?? 0
    gsap.set(light.current, { r: Math.max(Math.min(window.innerWidth, window.innerHeight) * 0.62, cake) * 1.2, alpha: 0 })
    darkNotifyRef.current(true)
    const timeline = gsap.timeline()
      .to(light.current, { alpha: 0.94, duration: reduce ? 0 : 0.8, ease: 'power2.out' }, 0)
      .add(() => { canBlow.current = true }, reduce ? 0 : 1.8)
    return () => { timeline.kill(); darkNotifyRef.current(false) }
  }, [])

  // La torta vive en una capa fija y solo se mueve con transformaciones (mover y escalar), que son fluidas;
  // cambiar su tamaño en el layout es lo que producía saltos. Hay dos poses: asentada sobre la alfombra (soplar)
  // y pequeña arriba (deseo). Se miden aquí y se recalculan si cambia la pantalla.
  useLayoutEffect(() => {
    const scene = sceneRef.current
    const stage = stageRef.current
    if (!scene || !stage) return
    const measure = () => {
      if (!stage.isConnected) return   // en la fase del viaje la torta ya no existe
      const width = window.innerWidth
      const height = window.innerHeight
      const narrow = width <= 700
      const cakeW = stage.offsetWidth
      const cakeH = stage.offsetHeight
      const actionsH = scene.querySelector<HTMLElement>('.cake-actions')?.offsetHeight ?? 150
      const floor = height * (narrow ? 0.21 : 0.24)
      const rugCenter = height * 0.97 - floor * 0.3
      // Los amiguitos sentados delante se salen un poco por debajo del plato: los botones empiezan después de ellos.
      const overhang = 1.08
      const gap = 16
      const bottomMargin = 64   // margen de seguridad por si la ventana del navegador se pasa de la pantalla
      // Si todo junto (torta + botones) no cabe, la torta se achica para que los botones nunca la pisen ni se salgan.
      const blowScale = Math.min(1, (height - bottomMargin - 20 - gap - actionsH) / (cakeH * overhang))
      const blowY = Math.max(20, Math.min(
        rugCenter - 6 - cakeH * blowScale * (252 / 270),
        height - bottomMargin - actionsH - gap - cakeH * blowScale * overhang,
      ))
      // Pose de "luces prendidas": la torta se asienta sobre el centro de la alfombra (ya no hay botones que dejar sitio)
      const rugScale = Math.min(narrow ? 0.88 : 1, (rugCenter - 26) / (cakeH * (252 / 270)))
      const rugY = Math.max(20, rugCenter - 6 - cakeH * rugScale * (252 / 270))
      const wishScale = Math.min(width * 0.4, 190, height * 0.22) / cakeW
      const wishY = narrow ? 148 : 162
      poses.current = { blowY, wishY, wishScale, blowScale, rugY, rugScale }
      scene.style.setProperty('--actions-top', `${blowY + cakeH * blowScale * overhang + gap}px`)
      scene.style.setProperty('--form-top', `${wishY + cakeH * wishScale * 1.06 + 10}px`)
      const pose = phaseRef.current !== 'blow' ? { y: wishY, scale: wishScale }
        : onRug.current ? { y: rugY, scale: rugScale } : { y: blowY, scale: blowScale }
      gsap.set(stage, { xPercent: -50, transformOrigin: '50% 0', ...pose })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // Al pasar al deseo la torta sube y se encoge de forma continua (una sola animación, sin cortes)
  useEffect(() => {
    phaseRef.current = phase
    const stage = stageRef.current
    if (!stage || phase !== 'wish') return
    const { wishY, wishScale } = poses.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    gsap.to(stage, { y: wishY, scale: wishScale, duration: reduce ? 0 : 1.2, ease: 'power3.inOut', overwrite: true })
  }, [phase])

  // Dibuja la oscuridad con un círculo de luz centrado en la llama, que parpadea como una vela de verdad.
  useEffect(() => {
    if (lightsOn) return
    const dark = darkRef.current
    if (!dark) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    const tick = (time: number) => {
      const flame = flameRef.current
      if (flame && lit) {
        const rect = flame.getBoundingClientRect()
        dark.style.setProperty('--fx', `${rect.left + rect.width / 2}px`)
        dark.style.setProperty('--fy', `${rect.top + rect.height / 2}px`)
      }
      // Mientras más fuerte se sopla, más tiembla la luz (casi sin encogerse, para que no se vea raro); cuando la llama se reaviva, se agranda un poco.
      const p = power.current
      const flicker = reduce ? 1 : 1 + (0.05 + p * 0.07) * Math.sin(time * (0.009 + p * 0.02)) + 0.03 * Math.sin(time * 0.023)
      const size = (1 - p * 0.14) * (1 + flare.current * 0.12)
      dark.style.setProperty('--r', `${Math.max(1, light.current.r * flicker * size)}px`)
      dark.style.setProperty('--a', String(light.current.alpha))
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [lightsOn, lit])

  const blowOut = () => {
    if (!lit || !canBlow.current) return
    setLit(false)
    setMic('off')
    power.current = 0
    sceneRef.current?.style.setProperty('--power', '0')
  }
  useEffect(() => { blowRef.current = blowOut })
  useBlowDetection(mic === 'listening' && lit, blowOut, () => setMic('unavailable'))

  // EL JUEGO: cada toque manda una ráfaga que dobla la llama. Si dejas de tocar, la llama se recupera, y de vez en cuando
  // se reaviva sola, así que hay que soplar rápido y seguido. Al llenar el medidor la vela se apaga.
  const tap = () => {
    if (!lit || !canBlow.current) return
    power.current = Math.min(1, power.current + 0.12)
    if (power.current >= 1) { blowRef.current(); return }   // el toque que llena el medidor apaga la vela
    const stage = stageRef.current
    if (!stage) return
    const puff = document.createElement('i')
    puff.className = 'blow-puff'
    puff.style.setProperty('--y', `${10 + Math.random() * 12}%`)
    puff.style.setProperty('--s', `${7 + Math.random() * 6}%`)
    stage.appendChild(puff)
    puff.addEventListener('animationend', () => puff.remove(), { once: true })
    gsap.fromTo(stage.querySelectorAll('.cake-friend'), { y: 0 }, { y: -16, duration: 0.1, yoyo: true, repeat: 1, stagger: 0.04, ease: 'power1.out', overwrite: 'auto' })
  }
  useEffect(() => {
    if (phase !== 'blow' || !lit) return
    const scene = sceneRef.current
    if (!scene) return
    let frame = 0
    let last = performance.now()
    let nextFlare = last + 2600
    let shown = -1
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (canBlow.current) {
        power.current = Math.max(0, power.current - 0.24 * dt)
        if (now > nextFlare) {
          nextFlare = now + 2000 + Math.random() * 1800
          if (power.current > 0.1) { power.current = Math.max(0, power.current - 0.15); flare.current = 1 }
        }
      }
      flare.current = Math.max(0, flare.current - dt * 2.4)
      scene.style.setProperty('--power', power.current.toFixed(3))
      scene.style.setProperty('--flare', flare.current.toFixed(3))
      const next = power.current > 0.82 ? 3 : power.current > 0.5 ? 2 : power.current > 0.12 ? 1 : 0
      if (next !== shown) { shown = next; setLevel(next) }
      if (power.current >= 0.985 && canBlow.current) { blowRef.current(); return }
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [phase, lit])

  // Vela apagada: la luz se encoge hasta quedar todo a oscuras. Luego la luz se expande desde la vela hasta llenar
  // la sala (como un regulador), se encienden las luces de hadas y salta el confeti. Sin destellos bruscos.
  useEffect(() => {
    if (lit) return
    const bloom = Math.hypot(window.innerWidth, window.innerHeight) * 2.4
    const timeline = gsap.timeline()
      .to(light.current, { r: 1, duration: 0.45, ease: 'power2.in' }, 0.15)
      .to(light.current, { alpha: 0.985, duration: 0.45 }, 0.15)
      // La casa aparece al instante: la luz que se expande es lo que la revela, sin fundido que la lave.
      // En la oscuridad total la torta no se ve: ahí se cambia de lugar, de los botones a la alfombra, sin que se note.
      .add(() => {
        const { rugY, rugScale } = poses.current
        onRug.current = true
        if (stageRef.current) gsap.set(stageRef.current, { y: rugY, scale: rugScale, overwrite: true })
        setRoomShown(true); setRoomLit(true)
      }, 1.7)
      // Banderitas y adornos vuelven recién cuando la luz ya llenó la sala.
      .add(() => darkNotifyRef.current(false), 2.9)
      .to(light.current, { r: bloom, duration: 1.3, ease: 'power2.inOut' }, 1.7)
      .to(light.current, { alpha: 0, duration: 0.8, ease: 'power1.inOut' }, 2.3)
      .add(() => celebrate(), 2.6)
      .add(() => celebrate(), 2.9)
      .add(() => setLightsOn(true), 3.2)
      .add(() => setPhase('wish'), 3.6)
    return () => { timeline.kill() }
  }, [lit])

  // De la casa a la noche: primero un fundido a negro (tapa la casa, el formulario y el cielo de día), y recién
  // entonces cae la noche; el negro se retira despacio y deja ver las estrellas. Así no se mezclan los dos fondos.
  const sendWish = () => {
    if (dipping) return
    setDipping(true)
    darkNotifyRef.current(true)   // las banderitas y adornos también se van con el fundido
    window.setTimeout(() => setPhase('sent'), 650)
  }
  useEffect(() => {
    nightRef.current(phase === 'sent')
    if (phase !== 'sent') return
    const lift = window.setTimeout(() => setDipping(false), 150)
    return () => window.clearTimeout(lift)
  }, [phase])

  // Viaje del deseo: un farolito grande con el texto sube meciéndose; se transforma en una estrella enorme con
  // cola de cometa y una onda de luz; las estrellas aceleran, la estrella deja chispas, llega al centro de un corazón
  // de estrellas que se dibuja a su alrededor y estalla en chispas, con rayos, anillos y estrellitas que la rodean.
  useEffect(() => {
    if (phase !== 'sent') return
    const flyer = flyerRef.current
    const lantern = lanternRef.current
    const orb = orbRef.current
    const height = window.innerHeight
    const centerY = (HEART_CENTER_Y - 0.5) * height   // desplazamiento desde el centro de la pantalla hasta el corazón
    if (!flyer || !lantern || !orb || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(warp, { speed: 0.25, constellation: 1, emit: 0 })
      if (flyer && lantern && orb) {
        gsap.set(lantern, { opacity: 0 })
        gsap.set(orb, { opacity: 1, scale: 1.3 })
        gsap.set(flyer, { opacity: 1, y: centerY })
      }
      const next = window.setTimeout(() => setArrived(true), 700)
      return () => window.clearTimeout(next)
    }
    const shock = flyer.querySelectorAll<HTMLElement>('.wish-shock')
    // La posición de la estrella en pantalla se lee en cada cuadro, para que las chispas salgan exactamente de ella
    const follow = () => {
      const rect = orb.getBoundingClientRect()
      warp.orbX = rect.left + rect.width / 2
      warp.orbY = rect.top + rect.height / 2
    }
    gsap.ticker.add(follow)
    const context = gsap.context(() => {
      gsap.set(warp, { speed: 0.25, constellation: 0, emit: 0, orbY: 0 })
      gsap.set(orb, { opacity: 0, scale: 0.2 })
      gsap.set(shock, { opacity: 0, scale: 0.2 })
      const sway = gsap.to(flyer, { x: 46, rotate: 3, duration: 1.15, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      gsap.timeline()
        .fromTo(flyer, { opacity: 0, y: height * 0.42, scale: 0.5 }, { opacity: 1, y: height * 0.3, scale: 1, duration: 1.2, ease: 'back.out(1.5)' }, 0.5)
        .to(warp, { speed: 1, duration: 1.4, ease: 'power1.in' }, 1.7)
        .to(flyer, { y: height * 0.14, duration: 2.1, ease: 'power1.in' }, 2.2)
        // Transformación: el farolito se deshace y nace la estrella, con una onda de luz y una explosión de chispas
        .to(lantern, { opacity: 0, scale: 0.2, rotate: 20, duration: 0.7, ease: 'power2.in' }, 3.6)
        .to(orb, { opacity: 1, scale: 1.1, duration: 0.8, ease: 'back.out(2.2)' }, 3.7)
        .add(() => { warp.burst += 1 }, 3.8)
        .fromTo(shock, { opacity: 0.95, scale: 0.2 }, { opacity: 0, scale: 7, duration: 1.5, ease: 'power2.out', stagger: 0.18 }, 3.8)
        .to(warp, { emit: 1, duration: 0.5 }, 3.9)
        .to(warp, { speed: 4.2, duration: 1.4, ease: 'power2.in' }, 4.1)
        // Viaje veloz hasta el centro del corazón; deja de mecerse y se endereza
        .add(() => { sway.kill() }, 4.5)
        .to(flyer, { x: 0, rotate: 0, duration: 0.9, ease: 'power2.inOut' }, 4.5)
        .to(flyer, { y: centerY, duration: 2.6, ease: 'power2.inOut' }, 4.5)
        .to(orb, { scale: 1.05, duration: 1.2, ease: 'sine.inOut' }, 4.6)
        .to(warp, { speed: 0.2, duration: 1.8, ease: 'power2.out' }, 5.9)
        .to(warp, { constellation: 1, duration: 2.6, ease: 'power1.inOut' }, 6.3)
        .to(warp, { emit: 0, duration: 0.6 }, 6.8)
        // Llegada: la estrella late, estalla en chispas y brilla con rayos, anillos y estrellitas orbitando
        .to(orb, { scale: 1.3, duration: 0.7, ease: 'back.out(2.4)' }, 7.2)
        .add(() => { warp.burst += 1; setArrived(true) }, 7.3)
        .fromTo(shock, { opacity: 0.8, scale: 0.4 }, { opacity: 0, scale: 9, duration: 1.8, ease: 'power2.out', stagger: 0.22 }, 7.3)
    })
    return () => { gsap.ticker.remove(follow); context.revert(); gsap.set(warp, { emit: 0, orbY: 0 }) }
  }, [phase])
  const secret = wish.trim() === ''

  // Al continuar, la escena se desvanece mientras el cielo vuelve a amanecer.
  const leave = () => {
    if (leaving) return
    setLeaving(true)
    darkNotifyRef.current(false)
    gsap.to(warp, { constellation: 0, duration: 0.8 })
    doneRef.current()
  }

  return (
    <div className={`cake-scene cake-scene--${phase} ${leaving ? 'cake-scene--leaving' : ''}`} ref={sceneRef}>
      <RoomBackground lit={roomLit} hidden={phase === 'sent' || !roomShown} />
      <div className={`cake-void ${roomShown ? 'is-off' : ''}`} aria-hidden="true" />
      <div className={`cake-dip ${dipping ? 'is-on' : ''}`} aria-hidden="true" />
      <div className={`cake-dark ${lightsOn ? 'is-on' : ''}`} ref={darkRef} aria-hidden="true" />

      {phase === 'wish' ? (
        <h1 className="cake-title"><BouncyText text="Pide un deseo" /></h1>
      ) : (
        <h1 className="sr-only">{phase === 'blow' ? '¡Feliz cumpleaños, Hetto!' : 'Tu deseo viaja a las estrellas'}</h1>
      )}

      {phase !== 'sent' && (
      <div className="cake-stage" ref={stageRef}>
        <div className="cake-wrap" ref={wrapRef}>
          <CakeArt lit={lit} onCandle={blowOut} flameRef={flameRef} />
          <div className="cake-friends" aria-hidden="true">
            {LETTERS.map((letter, index) => (
              <span key={letter.id} className="cake-friend" style={{ animationDelay: `${index * 0.35}s` }}>
                <MascotFace theme={THEMES[letter.id]} />
              </span>
            ))}
          </div>
          {['a', 'b', 'c', 'd', 'e', 'f'].map(spark => <i key={spark} className={`cake-spark cake-spark--${spark}`} />)}
        </div>
      </div>
      )}

      {phase === 'blow' && (
        <div className={`cake-actions ${lit ? '' : 'is-gone'}`}>
          <div className="cake-actions-row">
            <button type="button" className="cake-blow" data-no-hearts onPointerDown={event => { if (event.pointerType !== 'mouse' || event.button === 0) tap() }}
              onClick={event => { if (event.detail === 0) tap() }}>¡Soplar!</button>
            <button type="button" className="cake-mic cake-mic--icon" onClick={() => setMic('listening')} disabled={mic === 'listening'}
              aria-label="Soplar de verdad con el micrófono" title="Soplar de verdad con el micrófono">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Z" fill="currentColor" />
                <path d="M6 11a6 6 0 0 0 12 0M12 17v4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className="blow-meter" aria-hidden="true">
            <i className="blow-fill" />
            <svg className="blow-wind" viewBox="0 0 32 20"><path d="M2 6h16a4 4 0 1 0-4-4M2 11h24a4 4 0 1 1-4 4M2 16h10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
          </div>
          <p className="blow-hint" aria-live="polite">{BLOW_HINTS[level]}</p>
          {mic === 'listening' && <p className="cake-note">Te escucho… sopla fuerte</p>}
          {mic === 'unavailable' && <p className="cake-note">Sin micrófono: toca «Soplar»</p>}
        </div>
      )}

      {phase === 'wish' && (
        <form className="wish-form" onSubmit={event => { event.preventDefault(); sendWish() }}>
          <textarea className="wish-input" rows={3} maxLength={140} value={wish} aria-label="Tu deseo"
            onChange={event => setWish(event.target.value)} placeholder="Mi deseo es…" />
          <p className="wish-note">Nadie más lo ve</p>
          <div className="wish-buttons">
            <button type="submit" className="cake-blow">{secret ? 'En secreto ✨' : 'Enviar ✨'}</button>
          </div>
        </form>
      )}

      {phase === 'sent' && (
        <>
          <div className="wish-sky" aria-hidden="true">
            <div className={`wish-flyer ${arrived ? 'is-landed' : ''}`} ref={flyerRef}>
              <div className="wish-rays" />
              <i className="wish-shock" />
              <i className="wish-shock" />
              <div className="wish-lantern" ref={lanternRef}>
                <span className="wish-star">★</span>
                <p>{wish.trim() || '✨'}</p>
              </div>
              <div className="wish-orbiters">
                {[0, 1, 2, 3, 4, 5].map(index => <i key={index} style={{ '--i': index } as CSSProperties} />)}
              </div>
              <i className="wish-ring" />
              <i className="wish-ring wish-ring--late" />
              <div className={`wish-orb ${arrived ? 'is-landed' : ''}`} ref={orbRef} />
            </div>
          </div>
          {arrived && (
            <div className="wish-arrival" style={{ top: `${heartMetrics(window.innerWidth, window.innerHeight).tipY + 30}px` }}>
              <p>Tu deseo ya es una estrella</p>
              <button type="button" className="cake-blow" onClick={leave}>Continuar ♡</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default CakeScene
