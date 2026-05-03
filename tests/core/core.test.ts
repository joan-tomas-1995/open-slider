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

  it('canNext y canPrev son true en los extremos cuando loop=true', () => {
    const slider = createCarousel({ totalSlides: 3, loop: true, initialIndex: 0 });
    expect(slider.getState().canPrev).toBe(true);
    slider.goTo(2);
    expect(slider.getState().canNext).toBe(true);
  });

  it('canNext y canPrev son false en los extremos cuando loop=false', () => {
    const slider = createCarousel({ totalSlides: 3, loop: false });
    expect(slider.getState().canPrev).toBe(false);
    slider.goTo(2);
    expect(slider.getState().canNext).toBe(false);
  });

  it('goTo con loop normaliza índices negativos y fuera de rango', () => {
    const slider = createCarousel({ totalSlides: 3, loop: true });
    slider.goTo(-1);
    expect(slider.getState().index).toBe(2);
    slider.goTo(4);
    expect(slider.getState().index).toBe(1);
  });
});

describe('createSingleRange', () => {
  it('respeta límites y step', () => {
    const range = createSingleRange({ min: 0, max: 10, step: 2, initialValue: 1 });
    expect(range.getState().value).toBe(2);
    range.setValue(11);
    expect(range.getState().value).toBe(10);
  });

  it('snapToStep sin drift de precisión con step decimal', () => {
    const range = createSingleRange({ min: 0, max: 1, step: 0.1 });
    range.setValue(0.3);
    expect(range.getState().value).toBe(0.3);
    range.setValue(0.7);
    expect(range.getState().value).toBe(0.7);
  });

  it('step=0.01 no produce valores como 0.30000000000000004', () => {
    const range = createSingleRange({ min: 0, max: 1, step: 0.01 });
    range.setValue(0.57);
    expect(range.getState().value).toBe(0.57);
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

  it('setMinValue no puede superar maxValue', () => {
    const range = createDualRange({ min: 0, max: 100, step: 1, initialMaxValue: 60 });
    range.setMinValue(80);
    expect(range.getState().minValue).toBe(60);
  });

  it('setMaxValue no puede bajar de minValue', () => {
    const range = createDualRange({ min: 0, max: 100, step: 1, initialMinValue: 40 });
    range.setMaxValue(20);
    expect(range.getState().maxValue).toBe(40);
  });
});

