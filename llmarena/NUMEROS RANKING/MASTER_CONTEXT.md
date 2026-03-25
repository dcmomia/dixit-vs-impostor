# Contexto de NUMEROS RANKING

## Estado Actual
Se ha escrito un script `src/export.tsx` que utiliza `react-dom/server` para extraer los 12 componentes SVG (marcadores/assets generados en `App.tsx`) y convertirlos en archivos `.html` individuales y estáticos.

## Archivos Vitales
- `src/App.tsx`: Contiene las variaciones de `MarkerArt`.
- `src/export.tsx`: Script que extrae los assets.
- `html_exports/`: Carpeta con todos los assets individuales estáticos generados (`.html`), usando Tailwind CSS Play CDN para el renderizado básico.

## Decisiones / Bloqueos
- **Dependencias**: Se instaló `tsx` en el entorno de desarrollo local para poder transpilar al vuelo los archivos React TypeScript (`npx tsx src/export.tsx`).
- Se modificó `App.tsx` para exponer `MarkerArt` y `markers` como exportaciones con nombre.
