export type SliderDirection = 'horizontal' | 'vertical';

export interface CarouselOptions {
  totalSlides: number;
  initialIndex?: number;
  loop?: boolean;
}

export interface CarouselState {
  index: number;
  totalSlides: number;
  canNext: boolean;
  canPrev: boolean;
}

export interface RangeOptions {
  min?: number;
  max?: number;
  step?: number;
  initialValue?: number;
  initialMinValue?: number;
  initialMaxValue?: number;
}

export interface SingleRangeState {
  mode: 'single';
  min: number;
  max: number;
  step: number;
  value: number;
}

export interface DualRangeState {
  mode: 'dual';
  min: number;
  max: number;
  step: number;
  minValue: number;
  maxValue: number;
}

export type RangeState = SingleRangeState | DualRangeState;
