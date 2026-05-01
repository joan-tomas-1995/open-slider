import { useCallback, useRef, useState } from 'react';
import { createDualRange } from '@open-slider/core';
import type { DualRangeState, RangeOptions } from '@open-slider/core';

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
    (min: number, max: number) =>
      setState(controllerRef.current.setValues(min, max)),
    []
  );

  return { state, setMinValue, setMaxValue, setValues };
}
