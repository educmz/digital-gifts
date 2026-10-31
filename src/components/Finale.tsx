import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FRIENDS, RECIPIENT } from '../content'
import { celebrate } from '../heartEffects'
import BouncyText from './BouncyText'
import { PlaneArt } from './TravelArt'
import useReducedMotion from './useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

type Props = { onBack: () => void; onTravel: () => void }

const image = (path: string) => import.meta.env.BASE_URL + 'images/' + path
// Los muñequitos que se sientan al pie de la tarjeta, en fila (todos están en public/images/)
const CREW = ['room/hello-kitty.webp', 'room/pompompurin.webp', 'personaje/mymelody.webp', 'room/cinnamoroll.webp', 'personaje/List-kuromi.webp']

// Despedida: una tarjeta grande con el grupito BT21 encima y la fila de muñequitos abajo, y los dos botones del final.
function Finale({ onBack, onTravel }: Props) {
  const reduce = useReducedMotion()
  const rootRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || reduce) return
    const context = gsap.context(() => {
      gsap.from('.finale-card > *, .finale-crew', {
        opacity: 0, y: 40, duration: 0.8, stagger: 0.1, ease: 'power3.out', clearProps: 'opacity,transform',
        scrollTrigger: { trigger: root, start: 'top 80%' },
      })
      ScrollTrigger.create({ trigger: root, start: 'top 60%', once: true, onEnter: celebrate })
    }, root)
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 300)
    return () => { window.clearTimeout(refresh); context.revert() }
  }, [reduce])

  return (
    <section className="finale closing" ref={rootRef} aria-label="Despedida">
      <div className="finale-wrap">
        <img className="finale-top" src={image('personaje/bt21.png')} alt="" loading="lazy" onError={event => { event.currentTarget.style.display = 'none' }} />
        <div className="finale-card">
          <span className="finale-heart" aria-hidden="true">
            <span className="closing-heart">♥</span>
            <i className="album-orbit album-orbit--a">✦</i><i className="album-orbit album-orbit--b">♥</i><i className="album-orbit album-orbit--c">✧</i>
          </span>
          <p className="finale-kicker">Con todo el cariño del mundo</p>
          <p className="closing-sign"><BouncyText text={`Feliz cumpleaños, ${RECIPIENT}`} pop={false} /></p>
          <p className="closing-names">{FRIENDS.map(friend => friend.name).join(' · ')}</p>
          <div className="closing-actions">
            <button type="button" className="closing-button closing-button--trip" onClick={onTravel}>
              <PlaneArt className="closing-plane" /> ¿Cuánto falta para vernos?
            </button>
            <button type="button" className="closing-button" onClick={onBack}>Volver a las cartas ✉</button>
          </div>
        </div>
        <div className="finale-crew" aria-hidden="true">
          {CREW.map((file, index) => (
            <img key={file} src={image(file)} alt="" loading="lazy" style={{ animationDelay: `${-index * 0.7}s` }} onError={event => { event.currentTarget.style.display = 'none' }} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Finale
