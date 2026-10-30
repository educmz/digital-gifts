import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FRIENDS, REASONS, RECIPIENT, THEMES, VOUCHERS } from '../content'
import { celebrate } from '../heartEffects'
import { MascotFace } from './Mascot'
import FloatingDecor from './FloatingDecor'
import BouncyText from './BouncyText'

type Props = { onBack: () => void }

gsap.registerPlugin(ScrollTrigger)

const toggleItem = (list: number[], item: number) =>
  list.includes(item) ? list.filter(value => value !== item) : [...list, item]

function ExtraSections({ onBack }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [flipped, setFlipped] = useState<number[]>([])
  const [redeemed, setRedeemed] = useState<number[]>([])

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const context = gsap.context(() => {
      root.querySelectorAll<HTMLElement>('.extra-head').forEach(head => {
        gsap.from(Array.from(head.children), {
          opacity: 0, y: 36, duration: 0.8, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: head, start: 'top 85%' }
        })
      })
      root.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach(group => {
        gsap.from(Array.from(group.children), {
          opacity: 0, y: 70, scale: 0.9, duration: 0.85, stagger: 0.16, ease: 'back.out(1.5)',
          scrollTrigger: { trigger: group, start: 'top 88%' }
        })
      })
      const closing = root.querySelector<HTMLElement>('.closing')
      if (closing) {
        ScrollTrigger.create({ trigger: closing, start: 'top 70%', once: true, onEnter: celebrate })
      }
    }, root)
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 200)
    void document.fonts.ready.then(() => ScrollTrigger.refresh())
    return () => { window.clearTimeout(refresh); context.revert() }
  }, [])

  return (
    <div className="extras" ref={rootRef}>
      <div className="extras-band">
        <FloatingDecor variant="section" />

        <section className="extra-section" aria-labelledby="friends-title">
          <div className="extra-head">
            <p className="extra-kicker">De parte de tus tres amigos</p>
            <h2 className="extra-title" id="friends-title"><BouncyText text="Tres corazones para ti" pop={false} /></h2>
            <p className="extra-lead">Cada uno quiso dejarte unas palabras propias.</p>
          </div>
          <ul className="friends-grid" data-reveal-group>
            {FRIENDS.map(friend => (
              <li key={friend.name}>
                <article className="friend-card">
                  <div className="friend-avatar" aria-hidden="true">
                    <MascotFace theme={THEMES[friend.id]} />
                  </div>
                  <h3 className="friend-name">{friend.name}</h3>
                  <p className="friend-message">{friend.message}</p>
                </article>
              </li>
            ))}
          </ul>
        </section>

        <section className="extra-section" aria-labelledby="reasons-title">
          <div className="extra-head">
            <p className="extra-kicker">♡ ✦ ♡</p>
            <h2 className="extra-title" id="reasons-title"><BouncyText text="Por qué eres tan especial" pop={false} /></h2>
            <p className="extra-lead">Toca cada tarjeta para descubrirlo.</p>
          </div>
          <ul className="reasons-grid" data-reveal-group>
            {REASONS.map((reason, index) => (
              <li key={reason.title}>
                <button type="button" className="reason-card" aria-pressed={flipped.includes(index)}
                  onClick={() => setFlipped(current => toggleItem(current, index))}>
                  <span className="reason-inner">
                    <span className="reason-face reason-front">
                      <span className="reason-symbol" aria-hidden="true">{reason.symbol}</span>
                      <span className="reason-title">{reason.title}</span>
                      <span className="reason-hint">Toca para descubrir</span>
                    </span>
                    <span className="reason-face reason-back">
                      <span className="reason-text">{reason.text}</span>
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="extra-section" aria-labelledby="vouchers-title">
          <div className="extra-head">
            <p className="extra-kicker">Un regalo extra</p>
            <h2 className="extra-title" id="vouchers-title"><BouncyText text="Vales para canjear" pop={false} /></h2>
            <p className="extra-lead">Son tuyos, úsalos cuando quieras.</p>
          </div>
          <ul className="vouchers-list" data-reveal-group>
            {VOUCHERS.map((voucher, index) => {
              const used = redeemed.includes(index)
              return (
                <li key={voucher.title} className={`voucher ${used ? 'is-redeemed' : ''}`}>
                  <div className="voucher-ticket">
                    <div className="voucher-main">
                      <span className="voucher-label">VALE POR</span>
                      <p className="voucher-title">{voucher.title}</p>
                      <span className="voucher-from">de parte de {voucher.from}</span>
                    </div>
                    <div className="voucher-stub">
                      <button type="button" className="voucher-button" aria-pressed={used}
                        onClick={() => setRedeemed(current => toggleItem(current, index))}>
                        {used ? '✓ Canjeado' : 'Canjear'}
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="extra-section closing" aria-label="Despedida">
          <div data-reveal-group>
            <div><span className="closing-heart" aria-hidden="true">♥</span></div>
            <p className="closing-sign"><BouncyText text={`Feliz cumpleaños, ${RECIPIENT}`} pop={false} /></p>
            <p className="closing-names">Con muchísimo cariño,<br />{FRIENDS.map(friend => friend.name).join(' · ')}</p>
            <div><button type="button" className="closing-button" onClick={onBack}>Volver a las cartas ✉</button></div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ExtraSections
