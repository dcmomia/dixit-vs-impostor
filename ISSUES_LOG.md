# Registro de Problemas (Issues Log)

## [2026-03-25] Pantalla de Personajes se ve negra en Android

- **Problema**: Al navegar a la sección de personajes, la pantalla se queda en negro (vacía).
- **Causa**: 
    1. La pantalla no estaba registrada en `STATIC_SCREENS` dentro de `router.js`, por lo que el sistema no aplicaba la clase `.active`.
    2. La clase `.hidden` en el HTML tenía un `display: none !important` que sobreescribía al `.active` debido a su posición posterior en el CSS.
- **Solución**:
    1. Registro de `#screen-characters` en `src/core/router.js`.
    2. Eliminación de la clase `.hidden` en `index.html`, dejando que `.screen` y `.active` gestionen la visibilidad.
- **Prevención**: No usar clases de utilidad `.hidden` en elementos que son gestionados directamente por el sistema de rutas dinámico (`.screen.active`).
