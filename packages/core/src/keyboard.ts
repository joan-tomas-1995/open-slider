import type { CarouselController } from './carousel';

export interface KeyboardOptions {
  /** Only trigger if the element (or a descendant) is focused. Default: true */
  requireFocus?: boolean;
}

export interface KeyboardHandler {
  destroy(): void;
}

/**
 * Adds arrow-key navigation to an HTML element.
 * The element needs `tabindex="0"` (or be naturally focusable) to receive key events.
 *
 * @example
 * carouselEl.setAttribute('tabindex', '0');
 * const kb = createKeyboardHandler(carouselEl, carousel);
 * // later
 * kb.destroy();
 */
export function createKeyboardHandler(
  element: HTMLElement,
  controller: CarouselController,
  options: KeyboardOptions = {}
): KeyboardHandler {
  const requireFocus = options.requireFocus ?? true;

  function onKeyDown(e: KeyboardEvent) {
    if (requireFocus && !element.contains(document.activeElement)) return;

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        controller.prev();
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        controller.next();
        break;
      case 'Home':
        e.preventDefault();
        controller.goTo(0);
        break;
      case 'End':
        e.preventDefault();
        controller.goTo(controller.getState().totalSlides - 1);
        break;
    }
  }

  const target = requireFocus ? element : document;
  target.addEventListener('keydown', onKeyDown as EventListener);

  return {
    destroy() {
      target.removeEventListener('keydown', onKeyDown as EventListener);
    }
  };
}
