import { useCallback, useRef, useState } from 'react';
import { createSingleRange } from '@open-slider/core';
import type { RangeOptions, SingleRangeState } from '@open-slider/core';

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
