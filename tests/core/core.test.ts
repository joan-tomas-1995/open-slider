import { describe, expect, it, vi } from 'vitest';
import {
  createAutoplay,
  createCarousel,
  createDualRange,
  createKeyboardHandler,
  createPagination,
  createSingleRange,
  createTouchHandler,
} from '../../packages/core/src/index';

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
  // ── subscribe ────────────────────────────────────────────────────────────────
  describe('carousel.subscribe', () => {
    it('notifica al listener en next/prev/goTo', () => {
      const slider = createCarousel({ totalSlides: 3, loop: false });
      const calls: number[] = [];
      const unsub = slider.subscribe((state) => calls.push(state.index));

      slider.next();
      slider.goTo(2);
      slider.prev();
      unsub();
      slider.next(); // no debería llamar al listener

      expect(calls).toEqual([1, 2, 1]);
    });

    it('unsubscribe detiene las notificaciones', () => {
      const slider = createCarousel({ totalSlides: 3 });
      const fn = vi.fn();
      const unsub = slider.subscribe(fn);
      unsub();
      slider.next();
      expect(fn).not.toHaveBeenCalled();
    });
  });

  // ── slidesPerView + progress ──────────────────────────────────────────────────
  describe('carousel slidesPerView / progress', () => {
    it('progress va de 0 a 1', () => {
      const slider = createCarousel({ totalSlides: 4, slidesPerView: 1 });
      expect(slider.getState().progress).toBe(0);
      slider.goTo(3);
      expect(slider.getState().progress).toBe(1);
      slider.goTo(1);
      expect(Math.round(slider.getState().progress * 3)).toBe(1);
    });

    it('slidesPerView limita el canNext correcto', () => {
      // Con 4 slides y slidesPerView=2, solo se puede avanzar hasta index 2
      const slider = createCarousel({ totalSlides: 4, slidesPerView: 2 });
      slider.goTo(2);
      expect(slider.getState().canNext).toBe(false);
      expect(slider.getState().canPrev).toBe(true);
    });

    it('spaceBetween se almacena en el estado', () => {
      const slider = createCarousel({ totalSlides: 3, spaceBetween: 16 });
      expect(slider.getState().spaceBetween).toBe(16);
    });
  });

  // ── autoplay ────────────────────────────────────────────────────────────────
  describe('createAutoplay', () => {
    it('avanza el carousel automáticamente', async () => {
      vi.useFakeTimers();
      const slider = createCarousel({ totalSlides: 3, loop: true });
      const autoplay = createAutoplay(slider, null, { interval: 500 });
      autoplay.start();

      vi.advanceTimersByTime(1000);
      expect(slider.getState().index).toBe(2);

      autoplay.destroy();
      vi.useRealTimers();
    });

    it('isRunning refleja el estado correcto', () => {
      vi.useFakeTimers();
      const slider = createCarousel({ totalSlides: 2, loop: true });
      const autoplay = createAutoplay(slider, null, { interval: 100 });

      expect(autoplay.isRunning()).toBe(false);
      autoplay.start();
      expect(autoplay.isRunning()).toBe(true);
      autoplay.stop();
      expect(autoplay.isRunning()).toBe(false);

      autoplay.destroy();
      vi.useRealTimers();
    });
  });

  // ── onChange range ────────────────────────────────────────────────────────────
  describe('range onChange callback', () => {
    it('single range llama onChange al setValue', () => {
      const fn = vi.fn();
      const range = createSingleRange({ min: 0, max: 10, onChange: fn });
      range.setValue(5);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn.mock.calls[0][0]).toMatchObject({ value: 5 });
    });

    it('dual range llama onChange en setMinValue / setMaxValue / setValues', () => {
      const fn = vi.fn();
      const range = createDualRange({ min: 0, max: 100, onChange: fn });
      range.setMinValue(20);
      range.setMaxValue(80);
      range.setValues(10, 90);
      expect(fn).toHaveBeenCalledTimes(3);
    });
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

// ── range.subscribe ───────────────────────────────────────────────────────────
describe('range.subscribe', () => {
  it('single range notifica al listener en setValue', () => {
    const range = createSingleRange({ min: 0, max: 10 });
    const calls: number[] = [];
    const unsub = range.subscribe((s) => calls.push(s.value));

    range.setValue(3);
    range.setValue(7);
    unsub();
    range.setValue(9); // no debe notificar

    expect(calls).toEqual([3, 7]);
  });

  it('dual range notifica al listener en setMinValue/setMaxValue/setValues', () => {
    const range = createDualRange({ min: 0, max: 100 });
    const fn = vi.fn();
    const unsub = range.subscribe(fn);

    range.setMinValue(10);
    range.setMaxValue(90);
    range.setValues(20, 80);
    unsub();
    range.setMinValue(30); // no debe notificar

    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('subscribe y onChange coexisten sin interferir', () => {
    const onChangeFn = vi.fn();
    const subscribeFn = vi.fn();
    const range = createSingleRange({ min: 0, max: 10, onChange: onChangeFn });
    range.subscribe(subscribeFn);
    range.setValue(5);
    expect(onChangeFn).toHaveBeenCalledTimes(1);
    expect(subscribeFn).toHaveBeenCalledTimes(1);
  });
});

// ── carousel.reset ────────────────────────────────────────────────────────────
describe('carousel.reset', () => {
  it('vuelve a index 0 si no hay initialIndex', () => {
    const slider = createCarousel({ totalSlides: 4 });
    slider.goTo(3);
    slider.reset();
    expect(slider.getState().index).toBe(0);
  });

  it('vuelve a initialIndex si estaba definido', () => {
    const slider = createCarousel({ totalSlides: 4, initialIndex: 2 });
    slider.goTo(0);
    slider.reset();
    expect(slider.getState().index).toBe(2);
  });

  it('reset notifica a los subscribers', () => {
    const slider = createCarousel({ totalSlides: 3 });
    slider.goTo(2);
    const fn = vi.fn();
    slider.subscribe(fn);
    slider.reset();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn.mock.calls[0][0].index).toBe(0);
  });
});

// ── direction ─────────────────────────────────────────────────────────────────
describe('carousel direction', () => {
  it('horizontal por defecto', () => {
    const slider = createCarousel({ totalSlides: 3 });
    expect(slider.getState().direction).toBe('horizontal');
  });

  it('vertical se almacena en el estado', () => {
    const slider = createCarousel({ totalSlides: 3, direction: 'vertical' });
    expect(slider.getState().direction).toBe('vertical');
  });
});

