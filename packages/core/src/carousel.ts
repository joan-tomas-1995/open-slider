import type { CarouselOptions, CarouselState } from './types';

export interface CarouselController {
  next(): CarouselState;
  prev(): CarouselState;
  goTo(index: number): CarouselState;
  getState(): CarouselState;
}

function computeState(index: number, totalSlides: number, loop: boolean): CarouselState {
  return {
    index,
    totalSlides,
    canNext: loop || index < totalSlides - 1,
    canPrev: loop || index > 0
  };
}

export function createCarousel(options: CarouselOptions): CarouselController {
  const totalSlides = Math.max(1, options.totalSlides);
  const loop = options.loop ?? false;
  let index = Math.min(Math.max(options.initialIndex ?? 0, 0), totalSlides - 1);

  return {
    next() {
      if (index < totalSlides - 1) {
        index += 1;
      } else if (loop) {
        index = 0;
      }
      return computeState(index, totalSlides, loop);
    },
    prev() {
      if (index > 0) {
        index -= 1;
      } else if (loop) {
        index = totalSlides - 1;
      }
      return computeState(index, totalSlides, loop);
    },
    goTo(nextIndex: number) {
      if (loop) {
        const normalized = ((nextIndex % totalSlides) + totalSlides) % totalSlides;
        index = normalized;
      } else {
        index = Math.min(Math.max(nextIndex, 0), totalSlides - 1);
      }
      return computeState(index, totalSlides, loop);
    },
    getState() {
      return computeState(index, totalSlides, loop);
    }
  };
}
