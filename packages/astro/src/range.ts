import { createDualRange, createSingleRange } from '@open-slider/core';
import type { RangeOptions } from '@open-slider/core';

export function initRange(
  root: HTMLElement,
  options: RangeOptions = {}
): ReturnType<typeof createSingleRange> {
  const controller = createSingleRange(options);
  const track = root.querySelector<HTMLElement>('[data-track]');
  const fill = root.querySelector<HTMLElement>('[data-fill]');
  const thumb = root.querySelector<HTMLElement>('[data-thumb]');
  const output = root.querySelector<HTMLElement>('[data-value]');

  function render(): void {
    const { value, min, max } = controller.getState();
    const pct = ((value - min) / (max - min)) * 100;
    if (fill) fill.style.width = `${pct}%`;
    if (thumb) thumb.style.left = `${pct}%`;
    if (output) output.textContent = String(value);
  }

  root.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    const move = (ev: PointerEvent) => {
      const rect = (track ?? root).getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (ev.clientX - rect.left) / rect.width));
      const { min, max } = controller.getState();
      controller.setValue(min + ratio * (max - min));
      render();
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    move(e as PointerEvent);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  });

  render();
  return controller;
}

export function initDualRange(
  root: HTMLElement,
  options: RangeOptions = {}
): ReturnType<typeof createDualRange> {
  const controller = createDualRange(options);
  const track = root.querySelector<HTMLElement>('[data-track]');
  const fill = root.querySelector<HTMLElement>('[data-fill]');
  const thumbMin = root.querySelector<HTMLElement>('[data-thumb-min]');
  const thumbMax = root.querySelector<HTMLElement>('[data-thumb-max]');
  const outputMin = root.querySelector<HTMLElement>('[data-value-min]');
  const outputMax = root.querySelector<HTMLElement>('[data-value-max]');

  function render(): void {
    const { minValue, maxValue, min, max } = controller.getState();
    const pMin = ((minValue - min) / (max - min)) * 100;
    const pMax = ((maxValue - min) / (max - min)) * 100;
    if (thumbMin) thumbMin.style.left = `${pMin}%`;
    if (thumbMax) thumbMax.style.left = `${pMax}%`;
    if (fill) { fill.style.left = `${pMin}%`; fill.style.width = `${pMax - pMin}%`; }
    if (outputMin) outputMin.textContent = String(minValue);
    if (outputMax) outputMax.textContent = String(maxValue);
  }

  function attachThumb(el: HTMLElement, onMove: (v: number) => void): void {
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      el.setPointerCapture((e as PointerEvent).pointerId);
      const move = (ev: PointerEvent) => {
        const rect = (track ?? root).getBoundingClientRect();
        const ratio = Math.min(1, Math.max(0, (ev.clientX - rect.left) / rect.width));
        const { min, max } = controller.getState();
        onMove(min + ratio * (max - min));
        render();
      };
      const up = () => {
        el.removeEventListener('pointermove', move as EventListener);
        el.removeEventListener('pointerup', up);
      };
      el.addEventListener('pointermove', move as EventListener);
      el.addEventListener('pointerup', up);
    });
  }

  if (thumbMin) attachThumb(thumbMin, (v) => controller.setMinValue(v));
  if (thumbMax) attachThumb(thumbMax, (v) => controller.setMaxValue(v));

  render();
  return controller;
}
