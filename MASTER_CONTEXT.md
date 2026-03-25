# Dixit vs Impostor: MASTER CONTEXT

> [!IMPORTANT]
> ARCHIVO DE VERDAD ÚNICA. Guía para cualquier agente trabajando en este proyecto.

## 1. Identidad y Misión
**Nombre**: Dixit vs Impostor (Game Master App)
**Objetivo**: App SPA premium para gestionar partidas físicas de Dixit vs Impostor.
**Estado Actual**: ✅ COMPLETADO (V1.0 - Full Features) - 📱 SOPORTE ANDROID INICIALIZADO.

## 2. Hitos Alcanzados (Checklist)
*   [x] Infraestructura Base (HTML/JS Modular)
*   [x] Soporte Android (Capacitor Integration)
*   [x] Diseño Premium Glassmorphism
*   [x] Lógica de Roles y Revelación (Hold mechanics corregidas)
*   [x] Sistema de Votación Individualizada
*   [x] Matriz de Puntuación Equilibrada (Reglas Usuario)
*   [x] Base de Datos >2500 palabras (>500 por cat)
*   [x] Modals de confirmación personalizados (UX mejorada)

## 3. Sistema de Puntuación (Reglas Finales)
Implementación balanceada y sin números decimales (x2) para cubrir toda posibilidad de aciertos y penalizar o premiar de manera granular.

*   **Fase de Salvación Eliminada**: El Impostor ya no adivina la palabra al ser descubierto.

| Situación | Impostor | Acertantes | Resto |
|---|---|---|---|
| Nadie acierta | 6 | - | 0 |
| Solo 1 acierta | 4 | 6 | 0 |
| Minoría acierta | 2 | 4 | 0 |
| Empate (50%) | 1 | 3 | 0 |
| Mayoría acierta | 0 | 2 | 0 |
| Todos aciertan | -1 | 2 | - |

## 4. Decisiones Técnicas y de Diseño (Evolución)
Documentación de cambios clave realizados durante el desarrollo:

*   **UI Dinámica (SPA)**: Se utiliza una arquitectura SPA simplificada inyectando HTML en `main-content`. Los listeners se re-asignan en cada cambio de pantalla para asegurar interactividad.
*   **Optimizaciones de Experiencia**:
    *   **Auditoría (2026-03-08)**: Se corrigió la UX del Reveal para distinguir claramente la acción de "mantener pulsado" o "Hold" (para ver palabra) de la acción de hacer "click" (para avanzar al siguiente jugador).
    *   **Anti-Repetición e Imparcialidad (2026-03-08)**: Se migró de `Math.random` a `window.crypto.getRandomValues` para fortalecer el RNG. Se mitigó la racha de impostor idéntico validando contra `lastImpostor`.
*   **Base de Datos**: Enfocada en **Cultura Pop** y términos accesibles. Se eliminaron números y términos oscuros según instrucción directa ("más sencillo", "cualquiera pueda jugar").
    *   Implementado sistema de "Pool Exhaustivo" (`usedWords` array) donde las palabras NUNCA se repiten en una sesión a menos que se agote la categoría (en cuyo caso se resetea internamente y se notifica).
*   **Edición Manual**: Se añadió la posibilidad de editar puntuaciones directamente en la pantalla de marcadores para correcciones rápidas.
*   **Seguridad**: Prevención de XSS en la inyección de nombres de jugador mediante `escapeHTML()` y creación fuerte de nodos del DOM (en lugar de innerHTML directo para inputs de usuario).
*   **Plantilla de Jugadores (2026-03-09)**: Implementación de una sección de acceso rápido (`PRESET_PLAYERS`) en la pantalla de setup.
*   **Sistema de Avatares Dinámicos (2026-03-09)**: Se ha implementado un sistema que busca automáticamente imágenes en `assets/players/`. Utiliza una función `getAvatarHTML` con un listener `onerror` en el DOM para realizar un fallback automático a emojis o a un icono genérico 👤 si la imagen no existe o falla la carga, garantizando una UI robusta y personalizada.
*   **Tema Visual Dark Blue Mystic (2026-03-09)**: Evolución estética completa reemplazando fondos blancos por pizarras oscuras, desenfoques (`backdrop-filter`) y gradientes premium.
*   **Estándar de Botones (2026-03-09)**: Todos los botones de la app ahora comparten una arquitectura 3D mística basada en gradientes y sombras de cristal.
*   **Marcadores Globales y Sistema de Puntos (2026-03-21)**: Implementación de un ranking persistente (`localStorage`) que premia el podio:
    *   **Podio Final**: 1º: 5 pts, 2º: 3 pts, 3º: 1 pt.
    *   **Seguimiento**: Partidas jugadas, puntos totales y victorias.
    *   **UI Premium**: Estilo pétrico "Mystic Steampunk" con iconos de podio, cartas y orbe.

*   **Guía de Implementación**: El documento `GUIDE_MAESTRA.md` consolida toda la información técnica de pantallas, activos visuales y lógica de navegación. Es la fuente de verdad única para el desarrollo y diseño.

## 5. Equipo Agéntico (Smart Skills)
Para el desarrollo continuo, se han activado habilidades especializadas:
*   `js-game-architect`: Refactorización modular y lógica de estado.
*   `motion-mancy-ui`: Animaciones, UX inmersiva y estética visual.
*   `game-content-shaman`: Gestión de palabras, balanceo y prompts creativos.
*   `equipo_activo_rule`: Regla de auto-activación según intención.

---

## Historial de Cambios Destacados

*   2026-03-10: [Rediseño UX] - Pantalla `screen-reveal` renovada con estética de carta Dixit y flip 3D.
*   2026-03-15: [Ajustes de UX] - Centrado absoluto del cronómetro y optimización de escala del avatar protagonista.
*   2026-03-21: [Ranking Global] - Implementación de persistencia de puntos y UI premium de podio.
*   2026-03-21: [Menú Principal] - Efecto de levitación en botones y overlay onírico sobre el fondo.
*   2026-03-22: [UI] - Ajuste de equilibrio en el pie de marcadores: descenso del botón `btn-next-round` (marginalmente por encima de los otros) para mejorar la alineación visual.
*   2026-03-22: [UI] - Unificación visual de marcadores: sustitución de números por medallas gráficas, manteniendo el número visible sobre `btn_pos_cualquiera.png` para puestos fuera del podio.
*   2026-03-22: [UI] - Ajustes en pantalla de aciertos: marcos circulares estilo Steampunk con gradientes y sombras en avatares.
*   2026-03-22: [UI] - Ajustes en pantalla de categorías: aumento del 15% en el tamaño de las tarjetas de categoría (110%) y expansión del gap del grid.
*   2026-03-22: [UI] - Ajustes en pantalla de marcadores: aumento del tamaño de los avatares a **70px** y elevación de la lista de puntuaciones.
*   2026-03-22: [UI] - Ajustes en pantalla de pánico: aumento del 15% del icono de tiempo (`btn_hora.png`) y reubicación de elementos.
*   2026-03-23: [UI] - Ajustes en pantalla de marcadores: reorganización horizontal de controles de puntuación, coloreado por rango y eliminación de espacio superior.
*   2026-03-23: [UI] - Ajustes en pantalla de marcadores: compactaciÃ³n horizontal de avatares, paddings y controles para evitar truncamiento en los nombres. Fondo oscurecido para delta positivo.
*   2026-03-23: [UI] - Ajustes en pantalla de marcadores: sustituciÃ³n del asset `btn_pos_2.png` por `btn_pos_2.svg` (plata mecÃ¡nica de engranajes) para profundizar en la estÃ©tica steampunk del podio.
*   2026-03-23: [UI] - Ajustes en pantalla de marcadores: sustituciÃ³n del asset `btn_pos_1.png` por `btn_pos_1.svg` (filigrana imperial dorada) para elevar la calidad visual del podio.
*   2026-03-23: [UI] - Ajustes en pantalla de marcadores: sustituciÃ³n del asset `btn_pos_cualquiera.png` por `btn_pos_cualquiera.svg` (diseÃ±o de lente ahumada steampunk) y ajuste de centrado del nÃºmero para una mayor nitidez y cohesiÃ³n estÃ©tica.
*   2026-03-23: [Assets] - ReducciÃ³n del 15% en el tamaÃ±o de `btn_corona.png` para evitar recortes visuales en el avatar.
*   2026-03-24: [Modularización & Android] - Refactorización a SPA modular (ES6) e integración de Capacitor para soporte nativo de Android. Corrección masiva de rutas de assets y bug de slugs.
*   2026-03-25: [Animación & UX] - Sincronización del fondo en `screen-reveal`: El cambio a fondo de tensión del impostor se retrasa 600ms coincidiendo con el giro de la carta.
*   2026-03-25: [Mantenimiento & Backup] - Creada copia aislada y funcional de `screen-score` en `scree_score_aislada/` con todos sus activos y mocks core para facilitar pruebas independientes.
*   2026-03-25: [Rediseño UI] - Menú Principal: Nuevo fondo `fondo_menu_principal.png` y adición de capa `menu-vortex` con espiral rotatoria para mayor profundidad mística.
*   2026-03-25: [Rediseño UI] - Menú Principal: Implementación de banner superior compuesto con Bufón, Libro y Logo reducido, optimizando el espacio y la estética del encabezado.

---
*   2026-03-25: [Rediseño UI] - Menú Principal: Sustitución de `logo_dixit.png` por un pack segmentado (`dixit_logo` sobre `vs_impostor_logo`) con posicionamiento asimétrico y animación de levitación unificada.
*   2026-03-25: [Alineación & Escala UI] - Menú Principal: Nivelación vertical de activos laterales con el "VS" central y reducción de escala del Libro (110px) para máxima simetría.
*   2026-03-25: [Ajuste de Fondo Android] - Implementación de `object-fit: cover` con etiqueta `<img>` y metatag `viewport-fit=cover` para garantizar cobertura total de pantalla en WebViews nativas (Android/iOS).
*   2026-03-25: [Consistencia Visual] - Unificación de márgenes (`margin: 0`) en todos los botones del menú principal para evitar inconsistencias de espaciado y resaltados no deseados en el inspector de elementos.
*   2026-03-25: [Nueva Pantalla] - Pantalla de Personajes: Implementación de carrusel interactivo con efecto flip 3D, selector dinámico de roles (Inocente, Impostor, Turno, Victoria) y catálogo de 11 aventureros. Sincronización completa con Capacitor/Android.
*   2026-03-25: [UI/UX] - Pantalla de Personajes: Elevación de la "Bandeja de Roles" (25px) con diseño flotante y personalización cromática de etiquetas (Blanco para Inocentes, Rojo Intenso para Impostor). Integración de fondo personalizado `fondo_personajes.png` con 100% de nitidez.
*   Fin de Registro - 2026-03-25*
