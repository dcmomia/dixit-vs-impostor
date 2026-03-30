# Changelog - Dixit vs Impostor

## [1.3.2] - 2026-03-29
### Added
- **Backup de Assets**: Creación de `_source_assets_backup` para mover archivos fuente de gran tamaño (.kra y PNGs >9MB) fuera del flujo de compilación nativo.

### Changed
- **UI/UX Pánico (Debate)**: Restauración de la cuenta atrás visual (5-1) como recurso dramático, pero con control de navegación 100% manual para el narrador (fin del avance automático).
- **Maquetación Pánico**: Elevación dinámica de la "Palabra Secreta" mediante `position: absolute` y ajuste del orbe al **57%** de altura para centrado perfecto en el tótem circular.
- **Banda de Legibilidad**: Añadido degradado oscuro inferior en la pantalla de pánico para garantizar contraste en instrucciones de final de debate.
- **Footer Marcadores**: Redimensionamiento del botón "NUEVA RONDA" (+20%, máximo 480px) y anclaje al borde inferior absoluto para ergonomía móvil.

### Fixed
- **Gradle Space Error**: Solucionado el error de instalación interna agotada en Android Studio mediante la purga de 300MB de assets redundantes en la carpeta `src`.

## [1.3.1] - 2026-03-26
### Changed
- **Footer UI/UX**: Rediseño de profundidad en los marcadores. El botón "Nueva Ronda" es ahora mucho más grande e interactúa físicamente como un "totem mecánico" asomando desde detrás de la barra de acciones.
- **Transparencia Reparada**: Eliminación del filtro `opacity: 0.6` en los controles de puntuación para que mantengan colores vívidos en reposo, implementando un efecto de pulsación (`scale`) al seleccionarlos.
- **Base Responsive**: Ajustes en márgenes negativos para evitar recortes del asset visual (`barra_marcadores.png`) en dispositivos móviles/tabletas, y cambio a ubicaciones porcentuales paramétricas.

## [1.3.0] - 2026-03-24
### Added
- **Arquitectura SPA Modular**: Migración completa a módulos ES6 (`src/screens/`, `src/core/`).
- **Soporte Android Nativo**: Integración de **Capacitor**, configuración de `package.json` y plataforma Android.
- **Auditoría de Assets**: Script de validación masiva (`validate-assets.js`) y parcheo de rutas CSS.

### Fixed
- **Bug Crítico de Slugs**: Corregida la regex `/s+/g` que eliminaba la letra 's' en nombres de jugadores (Santi -> Anti).
- **Restauración de Fondos**: Recuperados los fondos de marcadores, temporizador y categorías tras el refactor.
- **Gradle Sync**: Solucionado el error de `capacitor.settings.gradle` mediante la pre-generación de la carpeta `www`.

## [1.2.2] - 2026-03-22
### Changed
- Ajustes en pantalla de pánico: aumento del 15% del icono de tiempo (`btn_hora.png`), elevación de su posición y descenso de la ubicación de la palabra secreta.
- Ajustes en pantalla de marcadores: aumento del tamaño de los avatares a **70px**, elevación de la lista y sustitución de todos los números por medallas gráficas (`btn_pos_X.png` y `btn_pos_cualquiera.png`).
- Ajustes en pantalla de categorías: aumento del 15% en el tamaño de las tarjetas de categoría (110%) y ajuste del espacio del grid.
- Ajustes en pantalla de aciertos: marcos circulares con estilo Steampunk (gradiente broncíneo y sombras profundas) para los avatares.

## [1.2.1] - 2026-03-22
### Changed
- Reducido el tamaño del botón de inicio (`btn-start-game`) en un 15% (391x127.5px).
- Compactación de la interfaz de Setup: reducción de fuente en "O INVOCA UNO NUEVO", tamaño de botón `add-player` (50px) y márgenes de input para elevar la lista de jugadores.

## [1.2.0] - 2026-03-21
### Added
- Nuevo sistema de **Ranking Global** persistente con estadísticas de victorias y puntos.
- Títulos de jugador personalizados debajo del nombre en el ranking.
- Animación de flotabilidad (`floating-book`) al botón de Nueva Partida.
- Capa de opacidad blanca al fondo del menú principal para mayor legibilidad.
- Iconos de corona y daga en los marcadores de final de partida.

### Changed
- Rediseño completo de la UI del Ranking: estilo pétreo, marcos beige roca y nombres en color beis piedra.
- Mejorada la jerarquía de botones en la pantalla de marcadores (escalonamiento vertical).
- Eliminado el resplandor (glow) del logotipo para un estilo más limpio.
- Aumentado el tamaño de los iconos de estadísticas en el ranking global.
- Actualizadas las reglas del juego en el modal informativo.

### Fixed
- Corregido error de recorte (clipping) en las coronas de los líderes en la pantalla de marcadores.
- Ajustado el centrado del icono de la hora en la pantalla de pánico.
- Optimizado el scroll y la legibilidad en modales con mucho texto.
- Eliminados bordes residuales en las tarjetas de revelación.
