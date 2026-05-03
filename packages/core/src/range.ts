import type { DualRangeState, RangeListener, RangeOptions, RangeState, SingleRangeState } from './types';
import { clamp, snapToStep } from './utils';

export interface SingleRangeController {
  setValue(value: number): SingleRangeState;
  getState(): SingleRangeState;
  /** Subscribe to state changes. Returns an unsubscribe function. */
  subscribe(listener: RangeListener<SingleRangeState>): () => void;
}

export interface DualRangeController {
  setMinValue(value: number): DualRangeState;
  setMaxValue(value: number): DualRangeState;
  setValues(minValue: number, maxValue: number): DualRangeState;
  getState(): DualRangeState;
  /** Subscribe to state changes. Returns an unsubscribe function. */
  subscribe(listener: RangeListener<DualRangeState>): () => void;
}

export function createSingleRange(options: RangeOptions = {}): SingleRangeController {
  const min = options.min ?? 0;
  const max = options.max ?? 100;
  const step = Math.max(0.0001, options.step ?? 1);
  const onChange = options.onChange;
  let value = clamp(options.initialValue ?? min, min, max);
  value = clamp(snapToStep(value, step, min), min, max);
  const listeners = new Set<RangeListener<SingleRangeState>>();

  function emit(state: SingleRangeState) {
    onChange?.(state);
    listeners.forEach((fn) => fn(state));
    return state;
  }

  return {
    setValue(nextValue: number) {
      value = clamp(snapToStep(nextValue, step, min), min, max);
      return emit({ mode: 'single', min, max, step, value });
    },
    getState() {
      return { mode: 'single', min, max, step, value };
    },
    subscribe(listener: RangeListener<SingleRangeState>) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}

export function createDualRange(options: RangeOptions = {}): DualRangeController {
  const min = options.min ?? 0;
  const max = options.max ?? 100;
  const step = Math.max(0.0001, options.step ?? 1);
  const onChange = options.onChange;

  let minValue = clamp(options.initialMinValue ?? min, min, max);
  let maxValue = clamp(options.initialMaxValue ?? max, min, max);

  minValue = clamp(snapToStep(minValue, step, min), min, max);
  maxValue = clamp(snapToStep(maxValue, step, min), min, max);

  if (minValue > maxValue) {
    [minValue, maxValue] = [maxValue, minValue];
  }

  const listeners = new Set<RangeListener<DualRangeState>>();

  const buildState = (): DualRangeState => ({
    mode: 'dual',
    min,
    max,
    step,
    minValue,
    maxValue
  });

  function emit(state: DualRangeState) {
    onChange?.(state);
    listeners.forEach((fn) => fn(state));
    return state;
  }

  return {
    setMinValue(value: number) {
      minValue = clamp(snapToStep(value, step, min), min, maxValue);
      return emit(buildState());
    },
    setMaxValue(value: number) {
      maxValue = clamp(snapToStep(value, step, min), minValue, max);
      return emit(buildState());
    },
    setValues(nextMinValue: number, nextMaxValue: number) {
      const nMin = clamp(snapToStep(nextMinValue, step, min), min, max);
      const nMax = clamp(snapToStep(nextMaxValue, step, min), min, max);
      minValue = Math.min(nMin, nMax);
      maxValue = Math.max(nMin, nMax);
      return emit(buildState());
    },
    getState() {
      return buildState();
    },
    subscribe(listener: RangeListener<DualRangeState>) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}

export type { RangeState };
