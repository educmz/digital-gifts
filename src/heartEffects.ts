import confetti from 'canvas-confetti'

const heart = confetti.shapeFromPath({ path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' })
const colors = ['#ff6699', '#ff9fc4', '#f24585', '#ffd0e0', '#e94d90']

// Lluvia de corazones desde los dos lados de la pantalla.
export function celebrate() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const burst = (x: number, angle: number) => confetti({
    particleCount: 40, angle, spread: 65, startVelocity: 48, gravity: 0.9, scalar: 1.4, ticks: 220,
    colors, shapes: [heart], origin: { x, y: 0.75 }, disableForReducedMotion: true
  })
  burst(0, 60)
  burst(1, 120)
}

export function installHeartEffects() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  let lastMove = 0
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const emit = (x: number, y: number, count: number) => {
    confetti({
      particleCount: count, spread: count > 10 ? 78 : 25,
      startVelocity: count > 10 ? 24 : 9,
      gravity: 0.8, scalar: count > 10 ? 1.3 : 0.85,
      ticks: count > 10 ? 110 : 65,
      colors, shapes: [heart],
      origin: { x: x / window.innerWidth, y: y / window.innerHeight },
      disableForReducedMotion: true
    })
  }
  const onMove = (event: PointerEvent) => {
    if (coarse || event.pointerType !== 'mouse') return
    const now = performance.now()
    if (now - lastMove < 85) return
    lastMove = now
    emit(event.clientX, event.clientY, 2)
  }
  const onClick = (event: MouseEvent) => {
    const target = event.target
    if (!(target instanceof Element)) return
    const button = target.closest('button')
    if (!button || button.disabled || button.dataset.noHearts !== undefined) return
    emit(event.clientX, event.clientY, 35)
  }
  document.addEventListener('pointermove', onMove, { passive: true })
  document.addEventListener('click', onClick)
  return () => {
    document.removeEventListener('pointermove', onMove)
    document.removeEventListener('click', onClick)
  }
}
