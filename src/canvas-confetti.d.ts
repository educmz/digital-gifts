declare module 'canvas-confetti' {
  type Shape = object
  type ConfettiOptions = {
    particleCount?: number; spread?: number; startVelocity?: number; gravity?: number;
    scalar?: number; ticks?: number; colors?: string[]; shapes?: Shape[];
    origin?: { x?: number; y?: number }; disableForReducedMotion?: boolean;
    drift?: number; decay?: number;
  }
  interface Confetti {
    (options?: ConfettiOptions): Promise<void> | null
    shapeFromPath(options: { path: string }): Shape
  }
  const confetti: Confetti
  export default confetti
}
