import { createSignal } from 'solid-js';
import { createCarousel as coreCreate } from '@open-slider/core';
import type { CarouselOptions, CarouselState } from '@open-slider/core';

export function createCarousel(options: CarouselOptions) {
  const controller = coreCreate(options);
  const [state, setState] = createSignal<CarouselState>(controller.getState());

  return {
    state,
    next() { setState(controller.next()); },
    prev() { setState(controller.prev()); },
    goTo(index: number) { setState(controller.goTo(index)); },
  };
}
