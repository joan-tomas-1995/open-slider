/**
 * @open-slider/astro
 *
 * Astro ships components as islands; the core logic is framework-agnostic.
 * This module provides a lightweight client-side carousel script that can be
 * inlined via `<script>` in any .astro component, or imported as a side-effecting
 * module in an island with `client:load`.
 *
 * Usage in an .astro file:
 *
 *   import { initCarousel } from '@open-slider/astro';
 *   // in <script> tag (client only):
 *   initCarousel(document.querySelector('.my-carousel'), { loop: true });
 */

import { createCarousel } from '@open-slider/core';
import type { CarouselOptions } from '@open-slider/core';

export interface CarouselElements {
  track: HTMLElement;
  prevBtn?: HTMLElement | null;
  nextBtn?: HTMLElement | null;
}

export function initCarousel(
  root: HTMLElement,
  options: Omit<CarouselOptions, 'totalSlides'> = {}
): ReturnType<typeof createCarousel> {
  const slides = root.querySelectorAll('[data-slide]');
  const track = root.querySelector<HTMLElement>('[data-track]');
  const controller = createCarousel({ ...options, totalSlides: slides.length });

  function render(): void {
    const { index } = controller.getState();
    if (track) {
      track.style.transform = `translate3d(${-index * 100}%, 0, 0)`;
    }
    // update aria-hidden on slides
    slides.forEach((slide, i) => {
      (slide as HTMLElement).setAttribute('aria-hidden', String(i !== index));
    });
    // update indicator dots if present
    root.querySelectorAll('[data-dot]').forEach((dot, i) => {
      dot.setAttribute('aria-current', String(i === index));
      dot.classList.toggle('is-active', i === index);
    });
  }

  root.querySelector('[data-prev]')?.addEventListener('click', () => {
    controller.prev(); render();
  });
  root.querySelector('[data-next]')?.addEventListener('click', () => {
    controller.next(); render();
  });
  root.querySelectorAll('[data-dot]').forEach((dot, i) => {
    dot.addEventListener('click', () => { controller.goTo(i); render(); });
  });

  render();
  return controller;
}
