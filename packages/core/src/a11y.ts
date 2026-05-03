import type { CarouselState } from './types';

export interface A11yOptions {
  /** Human-readable label for the carousel region. Default: 'Carousel' */
  label?: string;
}

/**
 * Applies ARIA attributes to a carousel root element and its slide children.
 *
 * Call once on mount, then call `updateA11y` on every state change.
 *
 * @example
 * const { updateA11y } = initA11y(rootEl, carousel.getState());
 * carousel.subscribe(state => updateA11y(state));
 */
export function initA11y(
  element: HTMLElement,
  initialState: CarouselState,
  options: A11yOptions = {}
): { updateA11y: (state: CarouselState) => void } {
  const label = options.label ?? 'Carousel';

  element.setAttribute('role', 'region');
  element.setAttribute('aria-label', label);
  element.setAttribute('aria-roledescription', 'carousel');

  if (!element.hasAttribute('tabindex')) {
    element.setAttribute('tabindex', '0');
  }

  const slides = element.querySelectorAll<HTMLElement>('[data-slide]');
  slides.forEach((slide, i) => {
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `Slide ${i + 1} of ${initialState.totalSlides}`);
  });

  function updateA11y(state: CarouselState) {
    const slides = element.querySelectorAll<HTMLElement>('[data-slide]');
    slides.forEach((slide, i) => {
      const visible = i >= state.index && i < state.index + state.slidesPerView;
      slide.setAttribute('aria-hidden', String(!visible));
      slide.setAttribute('aria-label', `Slide ${i + 1} of ${state.totalSlides}`);
      if (visible) {
        slide.removeAttribute('inert');
      } else {
        slide.setAttribute('inert', '');
      }
    });
  }

  updateA11y(initialState);
  return { updateA11y };
}
