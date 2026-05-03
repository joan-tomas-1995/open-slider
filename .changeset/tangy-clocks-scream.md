---
"@open-slider/core": minor
"@open-slider/react": minor
---

feat(core): range.subscribe, carousel.reset, direction:vertical, createPagination

- `subscribe(listener)` en SingleRange y DualRange
- `carousel.reset()` vuelve al índice inicial
- `direction: 'vertical'` en CarouselOptions/State
- `createPagination()` — bullets / fraction / progressbar
- Fix autoplay monkey-patch (usa subscribe interno)
- Fix touch-action automático según eje
- Fix a11y inert y aria-label refresh
- Fix useCarousel doble render
- useRange / useDualRange migrados a subscribe, exponen controller
