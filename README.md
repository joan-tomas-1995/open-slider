# Open Slider

Monorepo de `@open-slider/*` para construir un slider/carrusel open source, gratis y compatible con múltiples frameworks.

## Demo y docs en GitHub Pages

- Workflow: `.github/workflows/pages.yml`
- Rama de despliegue: `master`
- URL esperada: `https://<tu-usuario>.github.io/<tu-repo>/`

La página incluye:

- Demo funcional de `carousel`
- Demo funcional de `range` simple y dual
- Guía básica de instalación

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
- `@open-slider/{react,vue,svelte,solid,angular,astro,next,nuxt}`: wrappers reales listos para uso.

## Ejemplo rápido (core)

```ts
import { createCarousel } from '@open-slider/core';

const slider = createCarousel({ totalSlides: 5, loop: true });
slider.next();
console.log(slider.getState().index);
```

## Novedades del core (documentadas en la demo web)

Además del `carousel` base, `@open-slider/core` incluye:

- `subscribe(listener)`: patrón reactivo para escuchar cambios de estado.
- `slidesPerView` y `spaceBetween`: control de slides visibles y separación.
- `state.progress` (`0..1`): progreso normalizado del carrusel.
- `createAutoplay(...)`: autoplay con `interval`, `pauseOnHover` y `pauseOnInteraction`.
- `createTouchHandler(...)`: swipe/drag con Pointer Events.
- `createKeyboardHandler(...)`: navegación por teclado (`←`, `→`, `Home`, `End`).
- `initA11y(...)`: roles/atributos ARIA para accesibilidad.
- `range.onChange`: callback directo en cambios de `single` y `dual range`.

Ejemplo corto:

```ts
import {
	createCarousel,
	createAutoplay,
	createTouchHandler,
	createKeyboardHandler,
} from '@open-slider/core';

const root = document.getElementById('carousel')!;
const carousel = createCarousel({
	totalSlides: 6,
	loop: true,
	slidesPerView: 2,
	spaceBetween: 12,
});

carousel.subscribe((state) => {
	// state.progress -> 0..1
	console.log(state.index, state.progress);
});

createAutoplay(carousel, root, { interval: 3500, pauseOnHover: true }).start();
createTouchHandler(root, carousel);
createKeyboardHandler(root, carousel);
```

## Publicación

- Versionado: Changesets (`.changeset/config.json`).
- Workflow de release: `.github/workflows/release.yml`.
- Requiere `NPM_TOKEN` en secrets de GitHub.

## Estado

- ✅ Bootstrap inicial del monorepo
- ✅ Core inicial (`carousel` + `range`)
- ✅ Web Component base
- ✅ Wrappers React, Vue, Svelte, Solid, Angular, Astro, Next y Nuxt

## Publicar GitHub Pages (1 vez)

1. En GitHub, entra en **Settings → Pages**.
2. En **Build and deployment**, selecciona **Source: GitHub Actions**.
3. Haz push a `master` y espera al workflow **Pages**.
4. Abre la URL publicada en la sección de Pages.

## Scripts

- `npm run build`
- `npm run typecheck`
- `npm run test`
- `npm run changeset`
- `npm run version-packages`
- `npm run release`
