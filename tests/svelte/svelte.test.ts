import { describe, expect, it, vi } from 'vitest';
import { createCarouselStore } from '../../packages/svelte/src/carouselStore';
import {
  createDualRangeStore,
  createRangeStore,
} from '../../packages/svelte/src/rangeStore';

describe('createCarouselStore', () => {
  it('emite estado inicial al suscribirse', () => {
    const store = createCarouselStore({ totalSlides: 3, loop: false });
    const received: { index: number }[] = [];
    const unsub = store.subscribe((s) => received.push(s));
    expect(received[0].index).toBe(0);
    unsub();
  });

  it('notifica a suscriptores al avanzar/retroceder', () => {
    const store = createCarouselStore({ totalSlides: 3, loop: true });
    const indices: number[] = [];
    const unsub = store.subscribe((s) => indices.push(s.index));

    store.next();
    store.next();
    store.prev();

    expect(indices).toEqual([0, 1, 2, 1]);
    unsub();
  });

  it('desuscribirse detiene las notificaciones', () => {
    const store = createCarouselStore({ totalSlides: 3, loop: false });
    const cb = vi.fn();
    const unsub = store.subscribe(cb);
    unsub();
    store.next();
    expect(cb).toHaveBeenCalledTimes(1); // solo el emit inicial
  });
});

describe('createRangeStore', () => {
  it('aplica setValue y notifica', () => {
    const store = createRangeStore({ min: 0, max: 100, step: 10 });
    let last = { value: 0 };
    const unsub = store.subscribe((s) => { last = s; });
    store.setValue(45);
    expect(last.value).toBe(50); // snap to step=10
    unsub();
  });
});

describe('createDualRangeStore', () => {
  it('ajusta minValue sin sobrepasar maxValue', () => {
    const store = createDualRangeStore({ min: 0, max: 100, step: 1, initialMaxValue: 60 });
    let last = { minValue: 0, maxValue: 60 };
    const unsub = store.subscribe((s) => { last = s; });
    store.setMinValue(70); // no puede superar maxValue=60
    expect(last.minValue).toBe(60);
    unsub();
  });
});
