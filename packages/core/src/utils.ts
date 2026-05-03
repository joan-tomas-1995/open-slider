export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function snapToStep(value: number, step: number, base = 0): number {
  const steps = Math.round((value - base) / step);
  const raw = base + steps * step;
  // Fix floating-point drift (e.g. 0.1 steps producing 0.30000000000000004)
  const decimals = Math.max(
    decimalPlaces(step),
    decimalPlaces(base)
  );
  return decimals > 0 ? parseFloat(raw.toFixed(decimals)) : raw;
}

function decimalPlaces(n: number): number {
  const s = String(n);
  const dot = s.indexOf('.');
  return dot === -1 ? 0 : s.length - dot - 1;
}
