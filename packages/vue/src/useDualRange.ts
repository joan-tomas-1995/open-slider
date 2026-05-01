import { readonly, ref } from 'vue';
import { createDualRange } from '@open-slider/core';
import type { DualRangeState, RangeOptions } from '@open-slider/core';

export function useDualRange(options: RangeOptions = {}) {
  const controller = createDualRange(options);
  const state = ref<DualRangeState>(controller.getState());

  return {
    state: readonly(state),
    setMinValue(v: number) { state.value = controller.setMinValue(v); },
    setMaxValue(v: number) { state.value = controller.setMaxValue(v); },
    setValues(min: number, max: number) {
      state.value = controller.setValues(min, max);
    },
  };
}
