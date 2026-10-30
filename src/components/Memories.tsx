import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import BouncyText from './BouncyText'
import ExtraSections from './ExtraSections'

type Props = { onBack: () => void }

// Galería de recuerdos y secciones finales.
function Memories({ onBack }: Props) {
  const galleryRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const gallery = galleryRef.current
    if (!gallery || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const context = gsap.context(() => {
      gsap.from(gallery, { opacity: 0, y: 40, scale: 0.96, duration: 0.9, ease: 'power3.out' })
    })
    return () => context.revert()
  }, [])

  return (
    <>
      <div className="memories-reveal-track">
        <section className="memory-gallery cinematic-gallery" ref={galleryRef} aria-label="Galería de recuerdos de Hetto">
          <h1 className="gallery-heading"><BouncyText text="Gracias por llenar tantos momentos de alegría ♡" pop={false} /></h1>
          <div className="memories-grid">
            <p className="memory-caption memory-caption-left">Atesoro cada momento compartido contigo. Las risas, las conversaciones y hasta los días más sencillos se vuelven recuerdos bonitos.</p>
            {Array.from({ length: 6 }, (_, index) => (
              <div className={`memory-frame frame-${index + 1}`} key={index}>
                <img
                  src={import.meta.env.BASE_URL + `images/memories/recuerdo-${index + 1}.jpeg`}
                  alt={`Recuerdo ${index + 1} de Hetto`}
                  onError={event => { event.currentTarget.style.display = 'none' }}
                />
                <span className="memory-placeholder">♡<small>Foto {index + 1}</small></span>
              </div>
            ))}
            <p className="memory-caption memory-caption-middle">Otro año, otra razón para agradecer que estés aquí. ♡</p>
            <p className="memory-caption memory-caption-right">Por todas las sonrisas que ya compartimos y por las historias nuevas que todavía nos esperan.</p>
          </div>
          <p className="gallery-footer">Que cada día te regale motivos para sonreír. ¡Por muchos recuerdos más, Hetto! ♥</p>
        </section>
      </div>
      <ExtraSections onBack={onBack} />
    </>
  )
}

export default Memories
