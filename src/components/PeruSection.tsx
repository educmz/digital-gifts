import { useEffect, useLayoutEffect, useRef } from 'react'
import type { CSSProperties, ReactNode, SyntheticEvent } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FRIENDS, PERU_PLANS, PERU_TRIP, RECIPIENT } from '../content'
import type { PlanIcon } from '../content'
import PeruScene, { Bunting } from './PeruScene'
import { PeruFlag, PlaneArt } from './TravelArt'
import useCountdown from './useCountdown'
import useReducedMotion from './useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

type Props = { onBack: () => void }

// Los muñequitos BT21 que acompañan la sección (public/images/personaje/).
const image = (file: string) => import.meta.env.BASE_URL + 'images/personaje/' + file
const hide = (event: SyntheticEvent<HTMLImageElement>) => { event.currentTarget.style.display = 'none' }

const ROUTE = 'M12 70 C 80 -12, 220 -12, 288 70'
const ROUTE_SECONDS = '6s'
const RING = 2 * Math.PI * 44

// Iconos de línea para los planes (se colorean con currentColor).
const ICONS: Record<PlanIcon, ReactNode> = {
  food: <><path d="M4 12h16a8 8 0 0 1-16 0z" /><path d="M8 8c0-2 2-2 2-4M13 8c0-2 2-2 2-4" /></>,
  mountain: <><path d="M2 20l7-12 4 6 3-4 6 10z" /><path d="M7 11l2 2 2-2" /></>,
  camera: <><rect x="3" y="7" width="18" height="13" rx="3" /><circle cx="12" cy="13.5" r="3.5" /><path d="M8 7l1.5-3h5L16 7" /></>,
  heart: <path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z" />,
}

// Un reloj de anillo: el número al centro y el arco que se va llenando según cuánto de la vuelta ha pasado.
function Dial({ value, fraction, label, tone }: { value: number; fraction: number; label: string; tone: string }) {
  const text = String(value).padStart(2, '0')
  return (
    <div className="dial" style={{ '--tone': tone } as CSSProperties}>
      <div className="dial-face">
        <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
          <circle className="dial-track" cx="50" cy="50" r="44" />
          <circle className="dial-arc" cx="50" cy="50" r="44" strokeDasharray={RING} strokeDashoffset={RING * (1 - Math.min(1, Math.max(0, fraction)))} transform="rotate(-90 50 50)" />
        </svg>
        <span className="dial-num" key={text}>{text}</span>
      </div>
      <span className="dial-label">{label}</span>
    </div>
  )
}

function Countdown() {
  const left = useCountdown(PERU_TRIP.arrival)

  if (left.done) {
    return (
      <div className="cd-arrived" role="status">
        <strong>{PERU_TRIP.arrivedTitle}</strong>
        <p>{PERU_TRIP.arrivedMessage}</p>
      </div>
    )
  }
  const summary = `Faltan ${left.days} días, ${left.hours} horas, ${left.minutes} minutos y ${left.seconds} segundos`
  return (
    <div className="dials" role="timer" aria-label={summary}>
      <Dial value={left.days} fraction={left.days / 365} label="días" tone="#ef5b66" />
      <Dial value={left.hours} fraction={left.hours / 24} label="horas" tone="#ffb547" />
      <Dial value={left.minutes} fraction={left.minutes / 60} label="minutos" tone="#35c27f" />
      <Dial value={left.seconds} fraction={(left.seconds + 1) / 60} label="segundos" tone="#4a90d9" />
    </div>
  )
}

// El avión recorre la ruta curva entre el origen y Perú; con movimiento reducido se queda quieto a mitad de camino.
function Route({ reduce }: { reduce: boolean }) {
  return (
    <svg className="route" viewBox="0 0 300 90" aria-hidden="true" focusable="false">
      <path className="route-line" d={ROUTE} fill="none" />
      <path className="route-trail" d={ROUTE} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={reduce ? 0.5 : 1}>
        {!reduce && <animate attributeName="stroke-dashoffset" values="1;0;0" keyTimes="0;0.9;1" dur={ROUTE_SECONDS} repeatCount="indefinite" />}
      </path>
      <circle className="route-origin" cx="12" cy="70" r="7" />
      <circle className="route-pulse" cx="288" cy="70" r="7" />
      <circle className="route-dest" cx="288" cy="70" r="7" />
      {reduce ? (
        <g transform="translate(150 10)"><PlaneArt className="route-plane" x={-34} y={-10.2} width={68} height={20.4} /></g>
      ) : (
        <g>
          <animateMotion dur={ROUTE_SECONDS} repeatCount="indefinite" rotate="auto" path={ROUTE} keyPoints="0;1;1" keyTimes="0;0.9;1" calcMode="linear" />
          <PlaneArt className="route-plane" x={-34} y={-10.2} width={68} height={20.4} />
        </g>
      )}
    </svg>
  )
}

// Pantalla del viaje a Perú: cuenta regresiva con anillos, pasaporte con la ilustración de Hetto, planes, y una carta de correo aéreo.
function PeruSection({ onBack }: Props) {
  const reduce = useReducedMotion()
  const rootRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  const arrival = new Date(PERU_TRIP.arrival)
  const valid = !Number.isNaN(arrival.getTime())
  const arrivalText = valid ? new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Lima' }).format(arrival) : ''
  const arrivalShort = valid ? new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'America/Lima' }).format(arrival) : 'Por confirmar'

  useEffect(() => { titleRef.current?.focus({ preventScroll: true }) }, [])

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || reduce) return
    const context = gsap.context(() => {
      // El primer bloque entra mientras la cortina del avión termina de retirarse; el resto, al llegar con el scroll.
      gsap.from('.peru-hero > *', { opacity: 0, y: 36, duration: 0.8, stagger: 0.11, delay: 0.5, ease: 'power3.out', clearProps: 'opacity,transform' })
      root.querySelectorAll<HTMLElement>('[data-peru-reveal]').forEach(block => {
        gsap.from(block.hasAttribute('data-peru-group') ? Array.from(block.children) : block, {
          opacity: 0, y: 48, duration: 0.8, stagger: 0.12, ease: 'power3.out', clearProps: 'opacity,transform',
          scrollTrigger: { trigger: block, start: 'top 88%' },
        })
      })
    }, root)
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 250)
    void document.fonts.ready.then(() => ScrollTrigger.refresh())
    return () => { window.clearTimeout(refresh); context.revert() }
  }, [reduce])

  return (
    <section className="peru" ref={rootRef} aria-labelledby="peru-title">
      <PeruScene />
      <Bunting />

      <div className="peru-inner">
        <header className="peru-hero">
          <p className="peru-kicker">✦ Un viaje que ya está en camino ✦</p>
          <h1 className="peru-title" id="peru-title" ref={titleRef} tabIndex={-1}>
            Próxima parada: Perú <PeruFlag />
          </h1>
          <p className="peru-sub">La cuenta regresiva para tenerte por aquí</p>
          <Countdown />
          {PERU_TRIP.isEstimated && arrivalText && <p className="cd-note">Fecha estimada de llegada · {arrivalText}</p>}
          <span className="peru-scroll" aria-hidden="true">desliza <i>↓</i></span>
        </header>

        <div className="sticker-wrap" data-peru-reveal>
        <article className="pass" aria-label={`Viaje de ${PERU_TRIP.origin} a ${PERU_TRIP.destination}`}>
          <div className="pass-top">
            <span><PlaneArt className="pass-top-plane" /> Pasaporte al reencuentro</span>
            <span>Clase: Amistad ♡</span>
          </div>
          <div className="pass-body">
            <figure className="pass-photo">
              <span className="pass-tape" aria-hidden="true" />
              <img src={import.meta.env.BASE_URL + PERU_TRIP.photo} alt={`Ilustración de ${RECIPIENT} con la bandera de Perú`}
                onError={event => { event.currentTarget.style.display = 'none' }} />
              <figcaption>{RECIPIENT}</figcaption>
            </figure>
            <div className="pass-info">
              <div className="pass-route">
                <div className="pass-place"><span className="pass-label">Desde</span><strong>{PERU_TRIP.origin}</strong></div>
                <Route reduce={reduce} />
                <div className="pass-place pass-place--to"><span className="pass-label">Hasta</span><strong>{PERU_TRIP.destination} <PeruFlag className="peru-flag--small" /></strong></div>
              </div>
              <dl className="pass-fields">
                <div><dt>Pasajera</dt><dd>{RECIPIENT}</dd></div>
                <div><dt>Llegada</dt><dd>{arrivalShort}{PERU_TRIP.isEstimated && valid ? ' (est.)' : ''}</dd></div>
                <div><dt>Equipaje</dt><dd>Muchos abrazos</dd></div>
                <div><dt>Puerta</dt><dd>♡ 24</dd></div>
              </dl>
            </div>
          </div>
          <div className="pass-foot" aria-hidden="true">
            <i className="pass-barcode" />
            <span>HET ✈ PER</span>
          </div>
        </article>
          <img className="buddy buddy--rj" src={image('rj.png')} alt="" onError={hide} />
        </div>

        <section className="plans" aria-labelledby="plans-title">
          <div data-peru-reveal>
            <h2 className="peru-h2" id="plans-title">Lo que nos espera</h2>
            <p className="peru-lead">Cuando por fin nos veamos...</p>
          </div>
          <ul className="plans-grid" data-peru-reveal data-peru-group>
            {PERU_PLANS.map(plan => (
              <li className="plan" key={plan.title}>
                <span className="plan-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{ICONS[plan.icon]}</svg>
                </span>
                <h3>{plan.title}</h3>
                <p>{plan.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className="sticker-wrap" data-peru-reveal>
        <div className="peru-message">
          <div className="peru-stamp" aria-hidden="true">
            <PeruFlag />
            <span>PERÚ</span>
          </div>
          {PERU_TRIP.message.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          <p className="peru-sign">{FRIENDS.map(friend => friend.name).join(' · ')}</p>
        </div>
          <img className="buddy buddy--van" src={image('army.png')} alt="" onError={hide} />
        </div>

        <button type="button" className="peru-back" onClick={onBack} data-peru-reveal>
          <PlaneArt className="peru-back-plane" /> Volver al cumpleaños
        </button>
      </div>
    </section>
  )
}

export default PeruSection
