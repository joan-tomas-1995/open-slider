import type { CarouselController } from './carousel';

export interface AutoplayOptions {
  /** Milliseconds between slides. Default: 3000 */
  interval?: number;
  /** Pause autoplay while pointer is over the element. Default: true */
  pauseOnHover?: boolean;
  /** Pause on manual navigation (next/prev/goTo). Default: true */
  pauseOnInteraction?: boolean;
}

export interface AutoplayController {
  start(): void;
  stop(): void;
  pause(): void;
  resume(): void;
  isRunning(): boolean;
  /** Remove all event listeners and clear timers. */
  destroy(): void;
}

/**
 * Attaches autoplay behaviour to any CarouselController.
 *
 * @example
 * const carousel = createCarousel({ totalSlides: 4, loop: true });
 * const autoplay = createAutoplay(carousel, el, { interval: 4000 });
 * autoplay.start();
 * // later
 * autoplay.destroy();
 */
export function createAutoplay(
  controller: CarouselController,
  element: HTMLElement | null,
  options: AutoplayOptions = {}
): AutoplayController {
  const interval = options.interval ?? 3000;
  const pauseOnHover = options.pauseOnHover ?? true;
  const pauseOnInteraction = options.pauseOnInteraction ?? true;

  let timerId: ReturnType<typeof setInterval> | null = null;
  let running = false;
  let manuallyPaused = false;
  let isAutoTick = false;
  let unsubscribeInteraction: (() => void) | null = null;

  // Detect manual navigation via subscribe (no mutation of controller methods)
  if (pauseOnInteraction) {
    let prevIndex = controller.getState().index;
    unsubscribeInteraction = controller.subscribe((state) => {
      if (!isAutoTick && state.index !== prevIndex) {
        pause();
      }
      prevIndex = state.index;
    });
  }

  function tick() {
    isAutoTick = true;
    try { controller.next(); } finally { isAutoTick = false; }
  }

  function startTimer() {
    if (timerId !== null) clearInterval(timerId);
    timerId = setInterval(tick, interval);
  }

  function stopTimer() {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function pause() {
    if (!running) return;
    manuallyPaused = true;
    stopTimer();
  }

  function resume() {
    if (!running) return;
    manuallyPaused = false;
    startTimer();
  }

  // Hover listeners
  const onMouseEnter = () => { if (running && !manuallyPaused) stopTimer(); };
  const onMouseLeave = () => { if (running && !manuallyPaused) startTimer(); };

  if (pauseOnHover && element) {
    element.addEventListener('mouseenter', onMouseEnter);
    element.addEventListener('mouseleave', onMouseLeave);
  }

  return {
    start() {
      running = true;
      manuallyPaused = false;
      startTimer();
    },
    stop() {
      running = false;
      manuallyPaused = false;
      stopTimer();
    },
    pause,
    resume,
    isRunning() { return running && timerId !== null; },
    destroy() {
      stopTimer();
      running = false;
      unsubscribeInteraction?.();
      unsubscribeInteraction = null;
      if (element) {
        element.removeEventListener('mouseenter', onMouseEnter);
        element.removeEventListener('mouseleave', onMouseLeave);
      }
    }
  };
}
