import { readonly, ref } from 'vue';
import { createDualRange, createSingleRange } from '@open-slider/core';
import type { DualRangeState, RangeOptions, SingleRangeState } from '@open-slider/core';

export function useRange(options: RangeOptions = {}) {
  const controller = createSingleRange(options);
  const state = ref<SingleRangeState>(controller.getState());
  return {
    state: readonly(state),
    setValue(value: number) { state.value = controller.setValue(value); },
  };
}

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
