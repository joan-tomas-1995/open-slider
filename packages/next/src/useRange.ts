'use client';

import { useCallback, useRef, useState } from 'react';
import { createDualRange, createSingleRange } from '@open-slider/core';
import type { DualRangeState, RangeOptions, SingleRangeState } from '@open-slider/core';

export function useRange(options: RangeOptions = {}) {
  const controllerRef = useRef(createSingleRange(options));
  const [state, setState] = useState<SingleRangeState>(() =>
    controllerRef.current.getState()
  );
  const setValue = useCallback(
    (value: number) => setState(controllerRef.current.setValue(value)),
    []
  );
  return { state, setValue };
}

export function useDualRange(options: RangeOptions = {}) {
  const controllerRef = useRef(createDualRange(options));
  const [state, setState] = useState<DualRangeState>(() =>
    controllerRef.current.getState()
  );
  const setMinValue = useCallback(
    (v: number) => setState(controllerRef.current.setMinValue(v)),
    []
  );
  const setMaxValue = useCallback(
    (v: number) => setState(controllerRef.current.setMaxValue(v)),
    []
  );
  const setValues = useCallback(
    (min: number, max: number) => setState(controllerRef.current.setValues(min, max)),
    []
  );
  return { state, setMinValue, setMaxValue, setValues };
}
