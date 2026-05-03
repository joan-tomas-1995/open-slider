import { useCallback, useEffect, useRef, useState } from 'react';
import { createDualRange } from '@open-slider/core';
import type { DualRangeState, RangeOptions } from '@open-slider/core';

export function useDualRange(options: RangeOptions = {}) {
  const controllerRef = useRef(createDualRange(options));
  const [state, setState] = useState<DualRangeState>(() =>
    controllerRef.current.getState()
  );

  useEffect(() => {
    return controllerRef.current.subscribe(setState);
  }, []);

  const setMinValue = useCallback((v: number) => {
    controllerRef.current.setMinValue(v);
  }, []);
  const setMaxValue = useCallback((v: number) => {
    controllerRef.current.setMaxValue(v);
  }, []);
  const setValues = useCallback((min: number, max: number) => {
    controllerRef.current.setValues(min, max);
  }, []);

  return { state, setMinValue, setMaxValue, setValues, controller: controllerRef.current };
}
