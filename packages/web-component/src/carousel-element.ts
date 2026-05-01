import { createCarousel } from '@open-slider/core';

export class OpenSliderCarouselElement extends HTMLElement {
  private controller = createCarousel({ totalSlides: 1 });

  connectedCallback(): void {
    const slides = this.querySelectorAll('[data-slide]').length || 1;
    const loop = this.hasAttribute('loop');
    this.controller = createCarousel({ totalSlides: slides, loop });
    this.render();
  }

  public next(): void {
    this.controller.next();
    this.render();
  }

  public prev(): void {
    this.controller.prev();
    this.render();
  }

  private render(): void {
    const state = this.controller.getState();
    const track = this.querySelector<HTMLElement>('[data-track]');
    if (!track) return;
    track.style.transform = `translate3d(${-state.index * 100}%, 0, 0)`;
  }
}
