'use client';

import { useCallback, useRef, useState } from 'react';
import { createCarousel } from '@open-slider/core';
import type { CarouselOptions, CarouselState } from '@open-slider/core';

/**
 * Next.js client-only carousel hook.
 * Add 'use client' at the top of the consuming component.
 */
export function useCarousel(options: CarouselOptions) {
  const controllerRef = useRef(createCarousel(options));
  const [state, setState] = useState<CarouselState>(() =>
    controllerRef.current.getState()
  );

  const next = useCallback(() => setState(controllerRef.current.next()), []);
  const prev = useCallback(() => setState(controllerRef.current.prev()), []);
  const goTo = useCallback(
    (index: number) => setState(controllerRef.current.goTo(index)),
    []
  );

  return { state, next, prev, goTo };
}
