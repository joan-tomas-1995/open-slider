import { readonly, ref } from 'vue';
import { createCarousel } from '@open-slider/core';
import type { CarouselOptions, CarouselState } from '@open-slider/core';

export function useCarousel(options: CarouselOptions) {
  const controller = createCarousel(options);
  const state = ref<CarouselState>(controller.getState());

  return {
    state: readonly(state),
    next() { state.value = controller.next(); },
    prev() { state.value = controller.prev(); },
    goTo(index: number) { state.value = controller.goTo(index); },
  };
}
