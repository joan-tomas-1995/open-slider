import { createDualRange, createSingleRange } from '@open-slider/core';
import type { RangeOptions } from '@open-slider/core';
import { writable } from './store';

export function createRangeStore(options: RangeOptions = {}) {
  const controller = createSingleRange(options);
  const store = writable(controller.getState());

  return {
    subscribe: store.subscribe,
    setValue(value: number) { store.set(controller.setValue(value)); },
  };
}

export function createDualRangeStore(options: RangeOptions = {}) {
  const controller = createDualRange(options);
  const store = writable(controller.getState());

  return {
    subscribe: store.subscribe,
    setMinValue(v: number) { store.set(controller.setMinValue(v)); },
    setMaxValue(v: number) { store.set(controller.setMaxValue(v)); },
    setValues(min: number, max: number) {
      store.set(controller.setValues(min, max));
    },
  };
}
