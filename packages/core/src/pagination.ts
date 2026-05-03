import type { CarouselController } from './carousel';
import type { CarouselState } from './types';

export interface PaginationOptions {
  /**
   * CSS class applied to the active dot/bullet.
   * Default: 'active'
   */
  activeClass?: string;
  /**
   * Render mode:
   * - 'bullets'  — one dot per navigable position (default)
   * - 'fraction' — "current / total" text (e.g. "2 / 4")
   * - 'progressbar' — a <div> whose width reflects progress 0..1
   */
  type?: 'bullets' | 'fraction' | 'progressbar';
}

export interface PaginationController {
  /** Manually re-render pagination from current carousel state. */
  update(): void;
  /** Remove all DOM + listeners created by pagination. */
  destroy(): void;
}

/**
 * Attaches a pagination UI to a container element, driven by a CarouselController.
 *
 * @example
 * // Bullets (dots)
 * const pagination = createPagination(carousel, document.getElementById('dots'));
 *
 * // Fraction
 * const pagination = createPagination(carousel, el, { type: 'fraction' });
 *
 * // Progress bar — style the inner div via CSS
 * const pagination = createPagination(carousel, el, { type: 'progressbar' });
 */
export function createPagination(
  controller: CarouselController,
  container: HTMLElement,
  options: PaginationOptions = {}
): PaginationController {
  const activeClass = options.activeClass ?? 'active';
  const type = options.type ?? 'bullets';

  let progressFill: HTMLElement | null = null;

  function buildDOM(state: CarouselState) {
    container.innerHTML = '';

    if (type === 'bullets') {
      const count = Math.max(1, state.totalSlides - state.slidesPerView + 1);
      for (let i = 0; i < count; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.dataset.index = String(i);
        if (i === state.index) dot.classList.add(activeClass);
        dot.addEventListener('click', () => controller.goTo(i));
        container.appendChild(dot);
      }
    } else if (type === 'fraction') {
      const count = Math.max(1, state.totalSlides - state.slidesPerView + 1);
      container.textContent = `${state.index + 1} / ${count}`;
    } else if (type === 'progressbar') {
      const fill = document.createElement('div');
      fill.style.width = `${state.progress * 100}%`;
      fill.style.height = '100%';
      container.appendChild(fill);
      progressFill = fill;
    }
  }

  function updateDOM(state: CarouselState) {
    if (type === 'bullets') {
      container.querySelectorAll<HTMLElement>('[data-index]').forEach((dot) => {
        const isActive = Number(dot.dataset.index) === state.index;
        dot.classList.toggle(activeClass, isActive);
      });
    } else if (type === 'fraction') {
      const count = Math.max(1, state.totalSlides - state.slidesPerView + 1);
      container.textContent = `${state.index + 1} / ${count}`;
    } else if (type === 'progressbar' && progressFill) {
      progressFill.style.width = `${state.progress * 100}%`;
    }
  }

  // Initial render
  buildDOM(controller.getState());

  // Subscribe to future changes
  const unsubscribe = controller.subscribe(updateDOM);

  return {
    update() {
      updateDOM(controller.getState());
    },
    destroy() {
      unsubscribe();
      container.innerHTML = '';
      progressFill = null;
    }
  };
}
