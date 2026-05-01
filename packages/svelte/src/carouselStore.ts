import { createCarousel } from '@open-slider/core';
import type { CarouselOptions } from '@open-slider/core';
import { writable } from './store';

export function createCarouselStore(options: CarouselOptions) {
  const controller = createCarousel(options);
  const store = writable(controller.getState());

  return {
    subscribe: store.subscribe,
    next() { store.set(controller.next()); },
    prev() { store.set(controller.prev()); },
    goTo(index: number) { store.set(controller.goTo(index)); },
  };
}
