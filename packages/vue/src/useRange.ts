import { readonly, ref } from 'vue';
import { createSingleRange } from '@open-slider/core';
import type { RangeOptions, SingleRangeState } from '@open-slider/core';

export function useRange(options: RangeOptions = {}) {
  const controller = createSingleRange(options);
  const state = ref<SingleRangeState>(controller.getState());

  return {
    state: readonly(state),
    setValue(value: number) { state.value = controller.setValue(value); },
  };
}
