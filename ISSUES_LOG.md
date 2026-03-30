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
## [2026-03-26] Recorte inferior de imagen en Footer Responsive

- **Problema**: La imagen de la base del marcador (`barra_marcadores.png`) presentaba recortes bruscos en su borde inferior (ocultando el reloj de arena y faro) y el botón `btn-next-round` no era visible.
- **Causa**: 
    1. Se empleó un margen negativo (`margin-bottom: -25px`) sobre un elemento alineado al fondo del viewport (`bottom: 0`) colapsando el rendering y provocando recorte (clipping).
    2. El botón de Nueva Ronda dependía de un `bottom: 25px` fijo sobre un background masivo o se quedaba asfixiado con `z-index` inferior.
- **Solución**: 
    1. Ajustar el bottom-margin a `0` o `-5px` respetando el bounding box.
    2. Posicionar dinámicamente el botón asomando mediante porcentajes del padre (`bottom: 45%`) ignorando la deformación de px absolutos por cambios de viewport.
- **Prevención**: No encajar con márgenes negativos pronunciados los assets situados en el contenedor más bajo del DOM. Emplear ubicaciones relativas porcentuales (`%` o `vw/vh`) en webviews nativas para evitar ahogos en diferentes relaciones de aspecto.

## [2026-03-27] Falso Positivo de Ajuste en Container Tipográfico (getBoundingClientRect vs scrollWidth)
- **Problema**: El auto-ajuste de tamaño de fuente (`adjustSecretWordFontSize`) cesaba antes de tiempo si la frase de la "palabra secreta" se envolvía o cortaba, provocando desbordamiento (overflow) o truncamiento abrupto no detectado.
- **Causa**: `getBoundingClientRect().width` medía el límite estricto de la caja HTML del elemento `<h2>`, la cual estaba restringida a `width: 100%`, arrojando una falsa sensación matemática de "encajar" aunque el texto visible desbordara el recuadro.
- **Solución**: Migración del control de medición a `wordEl.scrollWidth`, el cual rastrea el tamaño orgánico puro del contenido del texto invisiblemente oculto o transparentado por los límites espaciales, forzando a la función JS a encoger el tamaño hasta que verdaderamente el ancho orgánico se ajuste al marco del contenedor. Combinado con una regla CSS férrea de `word-break: keep-all;`.
- **Prevención**: Nunca intentar deducir si una cadena de texto desborda leyendo `width` normal ni rects cuando el elemento posee reglas de contención flex o max-width relacional 100%. Emplear de base `scrollWidth/scrollHeight`.

## [2026-03-29] Error de Construcción APK: Archivos Masivos y Bloqueo de Acceso
- **Problema**: `AccessDeniedException` y `Requested internal only, but not enough space` al generar la APK o ejecutar en el emulador.
- **Causa**: 
    1. Archivos fuente (`.kra`) e imágenes masivas (9MB+) en `assets/IMG/temp/MARCADORES/` bloqueando la compresión de Gradle.
    2. La carpeta `src` alcanzó los **297 MB** debido a assets de alta resolución no optimizados, subiendo el peso de `www` a **465 MB**.
- **Solución**: 
    1. Creación de `_source_assets_backup` para mover archivos fuente e imágenes no referenciadas.
    2. Sincronización de Capacitor tras limpieza de carpetas de construcción.
- **Prevención**: No incluir archivos de diseño (`.kra`) o assets >1MB dentro de `src` o `assets` sin optimización previa.

## [2026-03-30] Colisión de Animaciones en Menú Principal (Santi vs Reloj)

- **Problema**: Al añadir el `reloj_arena.png` con un patrón de movimiento similar al de `santi_astronauta.png`, ambos objetos terminaban solapándose visualmente ("clipping" o uno encima del otro) al compartir el mismo espacio central del vórtice.
- **Causa**: Ambos empleaban keyframes (`santiChaosX`, `santiChaosY`) que abarcaban todo el ancho y alto del contenedor central de forma aleatoria, sin restricciones de "zona de exclusión" mutua.
- **Solución**: Implementación de un sistema de **Anillos Orbitales Concéntricos**. Se redefinieron los rangos de traslación en el eje X para que Santi orbitara en la periferia externa (`range: -50vw to 15vw`) y el Reloj se confinara al núcleo interno (`range: 35vw to 65vw`). Al no intersectar sus dominios espaciales de traslación, pueden girar en sentidos opuestos sin colisionar nunca.
- **Prevención**: Para múltiples elementos flotantes animados dinámicamente con transformaciones infinitas, definir "canales" o "bandas" de movimiento exclusivas en el espacio 2D para evitar solapamientos fortuitos.
