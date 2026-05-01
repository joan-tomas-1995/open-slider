# Open Slider

Monorepo de `@open-slider/*` para construir un slider/carrusel open source, gratis y compatible con múltiples frameworks.

## Instalación local

1. Instalar dependencias en la raíz.
2. Ejecutar validaciones.

Comandos disponibles:

- `npm install`
- `npm run typecheck`
- `npm run test`
- `npm run build`

## Paquetes actuales

- `@open-slider/core`: núcleo agnóstico (`carousel` + `range`).
- `@open-slider/web-component`: custom element base `open-slider-carousel`.
- `@open-slider/styles`: tema CSS por defecto + vía unstyled.
- `@open-slider/{react,vue,svelte,solid,angular,astro,next,nuxt}`: wrappers iniciales (scaffold).

## Ejemplo rápido (core)

```ts
import { createCarousel } from '@open-slider/core';

const slider = createCarousel({ totalSlides: 5, loop: true });
slider.next();
console.log(slider.getState().index);
```

## Publicación

- Versionado: Changesets (`.changeset/config.json`).
- Workflow de release: `.github/workflows/release.yml`.
- Requiere `NPM_TOKEN` en secrets de GitHub.

## Estado

- ✅ Bootstrap inicial del monorepo
- ✅ Core inicial (`carousel` + `range`)
- ✅ Web Component base
- ✅ Paquetes wrapper base para frameworks

## Scripts

- `npm run build`
- `npm run typecheck`
- `npm run test`
- `npm run changeset`
- `npm run version-packages`
- `npm run release`
