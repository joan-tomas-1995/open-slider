import { createSignal } from 'solid-js';
import {
  createDualRange as coreDual,
  createSingleRange as coreSingle,
} from '@open-slider/core';
import type { DualRangeState, RangeOptions, SingleRangeState } from '@open-slider/core';

export function createRange(options: RangeOptions = {}) {
  const controller = coreSingle(options);
  const [state, setState] = createSignal<SingleRangeState>(controller.getState());

  return {
    state,
    setValue(value: number) { setState(controller.setValue(value)); },
  };
}

export function createDualRange(options: RangeOptions = {}) {
  const controller = coreDual(options);
  const [state, setState] = createSignal<DualRangeState>(controller.getState());

  return {
    state,
    setMinValue(v: number) { setState(controller.setMinValue(v)); },
    setMaxValue(v: number) { setState(controller.setMaxValue(v)); },
    setValues(min: number, max: number) { setState(controller.setValues(min, max)); },
  };
}
