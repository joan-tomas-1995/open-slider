import { readonly, ref } from 'vue';
import { createCarousel } from '@open-slider/core';
import type { CarouselOptions, CarouselState } from '@open-slider/core';

/**
 * Nuxt 3 composable — usable in setup() or <script setup>.
 * Reactive via Vue 3 refs; safe for SSR (no window access in composable itself).
 */
export function useCarousel(options: CarouselOptions) {
  // createCarousel is pure JS — safe to call on server too
  const controller = createCarousel(options);
  const state = ref<CarouselState>(controller.getState());

  return {
    state: readonly(state),
    next() { state.value = controller.next(); },
    prev() { state.value = controller.prev(); },
    goTo(index: number) { state.value = controller.goTo(index); },
  };
}
