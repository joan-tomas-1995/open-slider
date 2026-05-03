import type { CarouselListener, CarouselOptions, CarouselState } from './types';

export interface CarouselController {
  next(): CarouselState;
  prev(): CarouselState;
  goTo(index: number): CarouselState;
  getState(): CarouselState;
  /**
   * Subscribe to state changes. Returns an unsubscribe function.
   * @example
   * const unsub = carousel.subscribe(state => console.log(state));
   * // later:
   * unsub();
   */
  subscribe(listener: CarouselListener): () => void;
}

function computeState(
  index: number,
  totalSlides: number,
  loop: boolean,
  slidesPerView: number,
  spaceBetween: number
): CarouselState {
  const maxIndex = Math.max(0, totalSlides - slidesPerView);
  const progress = maxIndex > 0 ? index / maxIndex : 0;
  return {
    index,
    totalSlides,
    slidesPerView,
    spaceBetween,
    progress,
    canNext: loop || index < maxIndex,
    canPrev: loop || index > 0
  };
}

export function createCarousel(options: CarouselOptions): CarouselController {
  const totalSlides = Math.max(1, options.totalSlides);
  const loop = options.loop ?? false;
  const slidesPerView = Math.max(1, options.slidesPerView ?? 1);
  const spaceBetween = options.spaceBetween ?? 0;
  let index = Math.min(Math.max(options.initialIndex ?? 0, 0), totalSlides - 1);
  const listeners = new Set<CarouselListener>();

  function emit(state: CarouselState) {
    listeners.forEach((fn) => fn(state));
    return state;
  }

  return {
    next() {
      const maxIndex = Math.max(0, totalSlides - slidesPerView);
      if (index < maxIndex) {
        index += 1;
      } else if (loop) {
        index = 0;
      }
      return emit(computeState(index, totalSlides, loop, slidesPerView, spaceBetween));
    },
    prev() {
      const maxIndex = Math.max(0, totalSlides - slidesPerView);
      if (index > 0) {
        index -= 1;
      } else if (loop) {
        index = maxIndex;
      }
      return emit(computeState(index, totalSlides, loop, slidesPerView, spaceBetween));
    },
    goTo(nextIndex: number) {
      const maxIndex = Math.max(0, totalSlides - slidesPerView);
      if (loop) {
        const normalized = ((nextIndex % totalSlides) + totalSlides) % totalSlides;
        index = normalized;
      } else {
        index = Math.min(Math.max(nextIndex, 0), maxIndex);
      }
      return emit(computeState(index, totalSlides, loop, slidesPerView, spaceBetween));
    },
    getState() {
      return computeState(index, totalSlides, loop, slidesPerView, spaceBetween);
    },
    subscribe(listener: CarouselListener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}
