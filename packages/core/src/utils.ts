export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function snapToStep(value: number, step: number, base = 0): number {
  const steps = Math.round((value - base) / step);
  return base + steps * step;
}
