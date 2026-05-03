import { useCallback, useEffect, useRef, useState } from 'react';
import { createCarousel } from '@open-slider/core';
import type { CarouselController, CarouselOptions, CarouselState } from '@open-slider/core';

export function useCarousel(options: CarouselOptions) {
  // Stable controller ref — options only applied on mount
  const controllerRef = useRef<CarouselController | null>(null);
  if (!controllerRef.current) {
    controllerRef.current = createCarousel(options);
  }

  const [state, setState] = useState<CarouselState>(() =>
    controllerRef.current!.getState()
  );

  // Subscribe so any external mutation (autoplay, touch, keyboard) triggers a re-render
  useEffect(() => {
    return controllerRef.current!.subscribe(setState);
  }, []);

  const next = useCallback(() => {
    setState(controllerRef.current!.next());
  }, []);

  const prev = useCallback(() => {
    setState(controllerRef.current!.prev());
  }, []);

  const goTo = useCallback((index: number) => {
    setState(controllerRef.current!.goTo(index));
  }, []);

  return { state, next, prev, goTo, controller: controllerRef.current };
}
