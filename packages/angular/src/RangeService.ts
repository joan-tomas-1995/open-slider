import { Injectable, signal } from '@angular/core';
import { createDualRange, createSingleRange } from '@open-slider/core';
import type {
  DualRangeState,
  RangeOptions,
  SingleRangeState,
} from '@open-slider/core';

@Injectable()
export class RangeService {
  private singleCtrl!: ReturnType<typeof createSingleRange>;
  private dualCtrl!: ReturnType<typeof createDualRange>;

  readonly singleState = signal<SingleRangeState | null>(null);
  readonly dualState = signal<DualRangeState | null>(null);

  initSingle(options: RangeOptions = {}): void {
    this.singleCtrl = createSingleRange(options);
    this.singleState.set(this.singleCtrl.getState());
  }

  initDual(options: RangeOptions = {}): void {
    this.dualCtrl = createDualRange(options);
    this.dualState.set(this.dualCtrl.getState());
  }

  setValue(value: number): void {
    this.singleState.set(this.singleCtrl.setValue(value));
  }

  setMinValue(v: number): void { this.dualState.set(this.dualCtrl.setMinValue(v)); }
  setMaxValue(v: number): void { this.dualState.set(this.dualCtrl.setMaxValue(v)); }
  setValues(min: number, max: number): void {
    this.dualState.set(this.dualCtrl.setValues(min, max));
  }
}
