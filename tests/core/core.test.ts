import { describe, expect, it } from 'vitest';
import { createCarousel, createDualRange, createSingleRange } from '../../packages/core/src/index';

describe('createCarousel', () => {
  it('avanza y retrocede correctamente sin loop', () => {
    const slider = createCarousel({ totalSlides: 3, loop: false });
    expect(slider.getState().index).toBe(0);

    slider.next();
    slider.next();
    slider.next();
    expect(slider.getState().index).toBe(2);

    slider.prev();
    expect(slider.getState().index).toBe(1);
  });

  it('hace wrap correctamente con loop', () => {
    const slider = createCarousel({ totalSlides: 3, loop: true, initialIndex: 2 });
    slider.next();
    expect(slider.getState().index).toBe(0);
    slider.prev();
    expect(slider.getState().index).toBe(2);
  });
});

describe('createSingleRange', () => {
  it('respeta límites y step', () => {
    const range = createSingleRange({ min: 0, max: 10, step: 2, initialValue: 1 });
    expect(range.getState().value).toBe(2);
    range.setValue(11);
    expect(range.getState().value).toBe(10);
  });
});

describe('createDualRange', () => {
  it('mantiene orden min/max al setear valores', () => {
    const range = createDualRange({ min: 0, max: 100, step: 5 });
    range.setValues(80, 20);
    const state = range.getState();
    expect(state.minValue).toBe(20);
    expect(state.maxValue).toBe(80);
  });
});
