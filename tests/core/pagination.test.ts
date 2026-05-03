// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { createCarousel, createPagination } from '../../packages/core/src/index';

describe('createPagination', () => {
  function makeContainer() {
    return document.createElement('div');
  }

  it('bullets: crea un botón por posición navegable', () => {
    const slider = createCarousel({ totalSlides: 4, slidesPerView: 1 });
    const container = makeContainer();
    createPagination(slider, container);
    expect(container.querySelectorAll('button').length).toBe(4);
  });

  it('bullets: marca el botón activo con clase "active"', () => {
    const slider = createCarousel({ totalSlides: 3 });
    const container = makeContainer();
    createPagination(slider, container);
    expect(container.querySelectorAll('button.active').length).toBe(1);
    expect((container.querySelector('button.active') as HTMLElement)?.dataset.index).toBe('0');
  });

  it('bullets: actualiza el activo al navegar', () => {
    const slider = createCarousel({ totalSlides: 3 });
    const container = makeContainer();
    createPagination(slider, container);
    slider.goTo(2);
    expect((container.querySelector('button.active') as HTMLElement)?.dataset.index).toBe('2');
  });

  it('fraction: muestra "1 / N" y actualiza al navegar', () => {
    const slider = createCarousel({ totalSlides: 4 });
    const container = makeContainer();
    createPagination(slider, container, { type: 'fraction' });
    expect(container.textContent).toBe('1 / 4');
    slider.next();
    expect(container.textContent).toBe('2 / 4');
  });

  it('progressbar: fill width refleja el progreso', () => {
    const slider = createCarousel({ totalSlides: 3 });
    const container = makeContainer();
    createPagination(slider, container, { type: 'progressbar' });
    slider.goTo(2);
    const fill = container.querySelector<HTMLElement>('div');
    expect(fill?.style.width).toBe('100%');
  });

  it('destroy limpia el DOM y deja de actualizarse', () => {
    const slider = createCarousel({ totalSlides: 3 });
    const container = makeContainer();
    const pagination = createPagination(slider, container);
    pagination.destroy();
    expect(container.innerHTML).toBe('');
    slider.next();
    expect(container.innerHTML).toBe('');
  });

  it('slidesPerView=2 reduce el número de bullets', () => {
    const slider = createCarousel({ totalSlides: 4, slidesPerView: 2 });
    const container = makeContainer();
    createPagination(slider, container);
    // totalSlides - slidesPerView + 1 = 3
    expect(container.querySelectorAll('button').length).toBe(3);
  });

  it('activeClass personalizada se aplica correctamente', () => {
    const slider = createCarousel({ totalSlides: 3 });
    const container = makeContainer();
    createPagination(slider, container, { activeClass: 'is-current' });
    expect(container.querySelectorAll('button.is-current').length).toBe(1);
    slider.next();
    expect((container.querySelector('button.is-current') as HTMLElement)?.dataset.index).toBe('1');
  });
});
