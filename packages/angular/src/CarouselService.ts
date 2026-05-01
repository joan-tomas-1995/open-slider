import { Injectable, signal } from '@angular/core';
import { createCarousel } from '@open-slider/core';
import type { CarouselOptions, CarouselState } from '@open-slider/core';

/**
 * Inject this service inside a component or provide it at the component level
 * with `providers: [CarouselService]` to get an isolated instance per slider.
 */
@Injectable()
export class CarouselService {
  private controller!: ReturnType<typeof createCarousel>;

  readonly state = signal<CarouselState | null>(null);

  init(options: CarouselOptions): void {
    this.controller = createCarousel(options);
    this.state.set(this.controller.getState());
  }

  next(): void { this.state.set(this.controller.next()); }
  prev(): void { this.state.set(this.controller.prev()); }
  goTo(index: number): void { this.state.set(this.controller.goTo(index)); }
}
