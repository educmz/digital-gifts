// Estado compartido entre la escena del deseo y el cielo nocturno. Lo anima GSAP desde CakeScene
// y lo lee el lienzo de estrellas en cada cuadro.
export const warp = {
  speed: 0.25,        // velocidad del viaje: 0.25 estrellas en calma, más de 3 = estrellas alargadas
  constellation: 0,   // 0 a 1: cuánto del corazón de estrellas ya está dibujado
  orbX: 0,            // posición en pantalla de la estrella del deseo (la actualiza CakeScene en cada cuadro)
  orbY: 0,
  emit: 0,            // 0 a 1: cuántas chispas deja la estrella al pasar
  burst: 0,           // cada vez que aumenta, sale una explosión de chispas desde la estrella
}

// Centro del corazón de estrellas, como fracción de la altura de la pantalla. La estrella del deseo llega aquí.
export const HEART_CENTER_Y = 0.4

// Tamaño y posición del corazón de estrellas (la misma fórmula la usan el lienzo que lo dibuja y el mensaje que va debajo).
export function heartMetrics(width: number, height: number) {
  const unit = Math.min((height * 0.42) / 29, (width * 0.86) / 32)
  const cx = width / 2
  const tipY = height * HEART_CENTER_Y + 14.5 * unit   // punta de abajo
  return { unit, cx, tipY }
}