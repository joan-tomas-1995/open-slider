import { useCallback, useEffect, useRef, useState } from 'react';
import { createSingleRange } from '@open-slider/core';
import type { RangeOptions, SingleRangeState } from '@open-slider/core';

export function useRange(options: RangeOptions = {}) {
  const controllerRef = useRef(createSingleRange(options));
  const [state, setState] = useState<SingleRangeState>(() =>
    controllerRef.current.getState()
  );

  useEffect(() => {
    return controllerRef.current.subscribe(setState);
  }, []);

  const setValue = useCallback((value: number) => {
    controllerRef.current.setValue(value);
  }, []);

  return { state, setValue, controller: controllerRef.current };
}
