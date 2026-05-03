
export type SliderDirection = 'horizontal' | 'vertical';

/** Listener called whenever carousel state changes */
export type CarouselListener = (state: CarouselState) => void;
/** Listener called whenever a range state changes */
export type RangeListener<S extends RangeState = RangeState> = (state: S) => void;
export interface CarouselOptions {
  totalSlides: number;
  initialIndex?: number;
  loop?: boolean;
  /** How many slides are visible at once (default: 1) */
  slidesPerView?: number;
  /** Gap between slides in px (informational — apply via CSS) */
  spaceBetween?: number;
  /** Slide axis. Default: 'horizontal' */
  direction?: SliderAxis;
}

export interface CarouselState {
  index: number;
  totalSlides: number;
  canNext: boolean;
  canPrev: boolean;
  slidesPerView: number;
  spaceBetween: number;
  /** Slide axis */
  direction: SliderAxis;
  /** 0..1 progress through the slide list */
  progress: number;
}

export interface RangeOptions {
  min?: number;
  max?: number;
  step?: number;
  initialValue?: number;
  initialMinValue?: number;
  initialMaxValue?: number;
  /** Called whenever the value changes */
  onChange?: (state: SingleRangeState | DualRangeState) => void;
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

/** Options for direction support in carousel + touch */
export type SliderAxis = 'horizontal' | 'vertical';
