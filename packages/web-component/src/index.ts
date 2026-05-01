import { OpenSliderCarouselElement } from './carousel-element';

export function defineOpenSliderElements(): void {
  if (!customElements.get('open-slider-carousel')) {
    customElements.define('open-slider-carousel', OpenSliderCarouselElement);
  }
}

export { OpenSliderCarouselElement };
