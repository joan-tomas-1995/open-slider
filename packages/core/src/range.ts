import type { DualRangeState, RangeOptions, RangeState, SingleRangeState } from './types';
import { clamp, snapToStep } from './utils';

export interface SingleRangeController {
  setValue(value: number): SingleRangeState;
  getState(): SingleRangeState;
}

export interface DualRangeController {
  setMinValue(value: number): DualRangeState;
  setMaxValue(value: number): DualRangeState;
  setValues(minValue: number, maxValue: number): DualRangeState;
  getState(): DualRangeState;
}

export function createSingleRange(options: RangeOptions = {}): SingleRangeController {
  const min = options.min ?? 0;
  const max = options.max ?? 100;
  const step = Math.max(0.0001, options.step ?? 1);
  let value = clamp(options.initialValue ?? min, min, max);
  value = clamp(snapToStep(value, step, min), min, max);

  return {
    setValue(nextValue: number) {
      value = clamp(snapToStep(nextValue, step, min), min, max);
      return { mode: 'single', min, max, step, value };
    },
    getState() {
      return { mode: 'single', min, max, step, value };
    }
  };
}

export function createDualRange(options: RangeOptions = {}): DualRangeController {
  const min = options.min ?? 0;
  const max = options.max ?? 100;
  const step = Math.max(0.0001, options.step ?? 1);

  let minValue = clamp(options.initialMinValue ?? min, min, max);
  let maxValue = clamp(options.initialMaxValue ?? max, min, max);

  minValue = clamp(snapToStep(minValue, step, min), min, max);
  maxValue = clamp(snapToStep(maxValue, step, min), min, max);

  if (minValue > maxValue) {
    [minValue, maxValue] = [maxValue, minValue];
  }

  const buildState = (): DualRangeState => ({
    mode: 'dual',
    min,
    max,
    step,
    minValue,
    maxValue
  });

  return {
    setMinValue(value: number) {
      minValue = clamp(snapToStep(value, step, min), min, maxValue);
      return buildState();
    },
    setMaxValue(value: number) {
      maxValue = clamp(snapToStep(value, step, min), minValue, max);
      return buildState();
    },
    setValues(nextMinValue: number, nextMaxValue: number) {
      const nMin = clamp(snapToStep(nextMinValue, step, min), min, max);
      const nMax = clamp(snapToStep(nextMaxValue, step, min), min, max);
      minValue = Math.min(nMin, nMax);
      maxValue = Math.max(nMin, nMax);
      return buildState();
    },
    getState() {
      return buildState();
    }
  };
}

export type { RangeState };
