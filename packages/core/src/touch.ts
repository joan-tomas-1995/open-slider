import type { CarouselController } from './carousel';

export interface TouchOptions {
  /** Minimum px to travel before triggering a slide change. Default: 50 */
  threshold?: number;
  /** Gesture axis. Default: 'horizontal' */
  axis?: 'horizontal' | 'vertical';
}

export interface TouchHandler {
  /** Remove all event listeners. */
  destroy(): void;
}

/**
 * Adds swipe / drag gesture support to an HTML element.
 *
 * @example
 * const touch = createTouchHandler(trackEl, carousel);
 * // later
 * touch.destroy();
 */
export function createTouchHandler(
  element: HTMLElement,
  controller: CarouselController,
  options: TouchOptions = {}
): TouchHandler {
  const threshold = options.threshold ?? 50;
  const axis = options.axis ?? 'horizontal';

  let startX = 0;
  let startY = 0;
  let isDragging = false;

  function onPointerDown(e: PointerEvent) {
    // Ignore multi-touch
    if (e.pointerType === 'touch' && e.isPrimary === false) return;
    startX = e.clientX;
    startY = e.clientY;
    isDragging = true;
    element.setPointerCapture(e.pointerId);
  }

  function onPointerUp(e: PointerEvent) {
    if (!isDragging) return;
    isDragging = false;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const delta = axis === 'horizontal' ? dx : dy;
    const crossDelta = axis === 'horizontal' ? Math.abs(dy) : Math.abs(dx);

    // Ignore mostly-perpendicular swipes
    if (crossDelta > Math.abs(delta)) return;

    if (delta < -threshold) {
      controller.next();
    } else if (delta > threshold) {
      controller.prev();
    }
  }

  function onPointerCancel() {
    isDragging = false;
  }

  element.addEventListener('pointerdown', onPointerDown);
  element.addEventListener('pointerup', onPointerUp);
  element.addEventListener('pointercancel', onPointerCancel);

  return {
    destroy() {
      element.removeEventListener('pointerdown', onPointerDown);
      element.removeEventListener('pointerup', onPointerUp);
      element.removeEventListener('pointercancel', onPointerCancel);
    }
  };
}
