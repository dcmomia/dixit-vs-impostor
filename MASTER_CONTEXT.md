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
*   2026-03-26: [UI/UX] - Unificación de Footer: Integración de `barra_marcadores.png` como fondo absoluto en `astral-footer-actions`. Rediseño de botones laterales a texto puro sobre la barra para evitar ruidos visuales y desbordamientos en móvil.
*   2026-03-26: [UI/UX] - Revelación Cinematográfica: Implementación de banner de impostor independiente en `screen-reveal` y ajuste de cartas a formato 9:16 (270x480px) para mayor estilismo.
*   2026-03-26: [UI/UX] - Corrección de Footer de Marcadores: Restauración de los botones de imagen (`btn_finalizar.png` y `btn_reset.png`) ocultando el texto `span`. Se corrigió el anclaje de `barra_marcadores.png` al borde inferior exacto eliminando el `bottom: 25px` renegado.
*   2026-03-26: [Fix Mobile] - Reajuste dinámico de `astral-footer-actions`. Uso de `position: relative` en la barra para otorgar altura estructural al contenedor flexbox. Implementación de unidades proporcionales (`vw`) en los botones de "Finalizar" y "Resetear" limitándolos a formas circulares exactas (`max-width: 80px`, `border-radius: 50%`) que encajan en los engranajes sin desbordar ocultando la cuadrícula.
*   2026-03-26: [Android Build] - Corrección de rutas relativas CSS. Eliminados los prefijos `./` en las referencias de fondo (`background-image`) de los nuevos botones para cumplir los estándares estructurales de Capacitor, previniendo errores de carga 404 en el WebView de Android.
*   2026-03-26: [UI/UX] - El botón de "Nueva Ronda" pasó de ser texto transparente CSS a utilizar su asset gráfico final (`btn_nueva_ronda.png`), proporcionándole un estilo de placa metálica Steampunk.
*   2026-03-26: [UI/UX] - Profundidad en Marcadores: Se reestructuró el DOM reubicando el botón "Nueva Ronda" previo a la barra de footer para simular la inmersión del asset. Se incrementó la escala del botón (60vw / 290px max-width). Adicionalmente se ajustó el anclaje inferior de fondo devolviendo su escala originaria (`margin-bottom: -5px`) para salvar el arte del faro/relojes de arena del recorte de viewport, y se estableció la altura de salto de "Nueva Ronda" mediante porcentajes (`bottom: 45%`) para hacerlo "responsive" subiendo de la barra en todas las resoluciones.
*   2026-03-26: [UI/UX] - Se eliminó la `opacity: 0.6` de `.astral-score-controls` en la pantalla de marcadores que provocaba un efecto visual grisáceo/apagado en el texto de los puntos y botones matemáticos en reposo, reemplazándolo por un ligero `scale` interactivo en hover.
*   Fin de Registro - 2026-03-27*
*   2026-03-27: [UI/UX] - Sincronismo Pantalla Revelación: Reemplazo tipográfico de nombre de jugador a `Macondo` con ligero incremento `2.5rem` para maximizar monumentalidad pétrea coincidente con fondo místico.
*   2026-03-27: [UI/UX] - Marcadores Footer: Añadido overlay `.footer-action-plates` con el asset `placas_accion.png` como capa visual Steampunk.
*   2026-03-27: [UI/UX] - Optimización Setup: Reducción del 15% del tamaño del botón `btn-start-game` para mejorar el balance visual.
*   2026-03-27: [UI/UX] - Diseño Global: Implementación de sombra "intricada" multi-capa en `btn-menu-settings` usando filtros encadenados (`drop-shadow`) para un efecto místico Steampunk.
*   2026-03-27: [UI/UX] - Animación: Añadido resplandor palpitante (`throb_glow`) al botón de sorteo de categorías (`btn-random-category`) para mejorar la interactividad visual.
*   2026-03-27: [UI/UX] - Optimización Setup: Corregido desbordamiento de `card-name-band` en `.player-card`, unificando `border-radius: 16px` y ajustando la imagen del jugador con `object-position: center 10%` para mejor encuadre facial.
*   2026-03-27: [UI/UX] - Puntuación Profunda: Inserción de box-shadow (`inset`) multinivel y fondo transparente negro tras `.astral-total-pts` simulando una pantalla incrustada cóncava, alineando el `.astral-delta-pts` con exactitud sobre ésta levantando restricciones flexbox de altura estricta sobre su contenedor.
*   2026-03-27: [Estabilidad UX] - Medición Dinámica (Pantalla Pánico): Corrección crítico del desbordamiento en generación tipográfica en `secret-word-box` forzando el reemplazo a un motor basado puramente en `scrollWidth`/`scrollHeight` en `panic.js` complementado con blindaje `keep-all` para salvaguardar palabras completas forzando re-escalado diminutivo total.
*   2026-03-29: [Refinamiento UI & Android Build] - Rediseño de escala del botón "Nueva Ronda" (+20%, 480px). Implementación de avance manual en pantalla de Pánico, restauración de cuenta atrás visual y centrado absoluto del orbe al 57%. Resolución de error de espacio en Android Studio mediante la migración de 300MB de assets pesados no utilizados a `_source_assets_backup`.
*   2026-03-30: [UI/UX] - Pantalla Personajes: Implementación de visualización dinámica para el rol 'TURNO', fusionando como "conjunto" en primer plano el sprite "starter" del jugador y enmascarando en el fondo 3D interior de la tarjeta el asset `bg_eligetucarta.png` (usando la clase `.card-bg-timer`). El tratamiento se extiende de manera uniforme en las miniaturas de selección. Reparación proactiva y unificación del encuadre `contain` de todos los personajes solucionando desbordes del marco por herencia CSS.
*   2026-03-30: [Animación & UX] - Transición fluida en screen-reveal: Sustitución del cambio brusco de fondo tras la revelación del impostor por un suave crossfade (fade-in) de opacidad controlada mediante pseudocapa global `::before` (`bg_tension_dark.png`), sincronizando milimétricamente el inicio de la inyección con el *flip* de la carta (delay js reducido de 600ms a 50ms).
*   2026-03-30: [UI/UX] - Pantalla Reveal: Micro-alineación óptica (kerning-level offset) a la palabra secreta, aplicando traslaciones X e Y complementarias a la rotación para nivelar el centro geométrico de la fuente tipográfica con el centro pictórico del estandarte dorado.
*   2026-03-30: [Estabilidad UX & Core Flow] - Pantalla Pánico: Conversión del timer visual a activación "bajo demanda" (on-demand); la cuenta regresiva solo empezará a correr en fase 2 cuando el narrador pulse manualmente la caja que contiene la palabra secreta, otorgando tiempo indefinido previo de asimilación sin penalizaciones automáticas.
*   2026-03-30: [Fix Visual & Estabilidad Layout] - Pantalla Pánico: Resolución de fallo crítico en el motor dinámico de texto que producía superposiciones con el temporizador al renderizar refranes o frases largas (e.g. "GATO CON GUANTES..."). Se ha solidificado estructuralmente el contenedor `secret-word-box` sustituyendo sus cotas variables (`max-height`) por una arquitectura rígida `height: 32vh`, forzando a la rutina de JavaScript a detonarse y encoger proporcionalmente los píxeles de cualquier frase multi-línea. Adicionalmente, se ha reubicado el orbe temporal de forma empírica en el eje Y (`top: 57%` -> `top: 69%`) aplomándolo en perfecta coincidencia visual con el hueco del engranaje místico del arte de fondo y logrando un margen de amortiguador a prueba de solapamientos con la caja superior.
*   2026-03-30: [UI/UX] - Pantalla Marcadores: Ajuste de dimensiones del botón `#btn-next-round` (`95vw` -> `88vw`, `max-width: 420px`). Ahora el área de click está ceñida exclusivamente a la zona central donde se encuentra el asset visual `btn_nueva_ronda.png`, evitando que el botón ocupe toda la franja horizontal inferior y permitiendo una interacción más precisa.
*   2026-03-30: [Fix Estabilidad & UX] - Prevención de "Ghost-Click": Implementación de un sistema de *Gating* (bloqueo temporal) de 550ms para el botón de confirmación en `screen-aciertos`. Esta medida deshabilita el `pointer-events` mediante la clase CSS `.btn-antighost-gate` al entrar en la pantalla, evitando que toques residuales provenientes de la pantalla de Pánico disparen la navegación accidentalmente antes de que el usuario seleccione a los acertantes.
*   2026-03-30: [UX Global] - Transiciones SPA Suavizadas: Identificado y mitigado el problema de brusquedad en el salto de pantallas del router (`display: none` a `display: flex`). Se ha orquestado una coreografía CSS nativa (`animation: mysticScreenEnter`) atada globalmente a la inyección de la clase `.screen.active`, la cual aplica un Fade-In suavizado con un micro-desenfoque (`blur 8px -> 0px`) y un mínimo efecto de escalado tridimensional (`scale 0.97 -> 1.0`). Esta medida atenúa por completo los cortes de frame (Hard Cuts) y confiere una calidad Mística y orgánica, propia de una aplicación Premium, sin repercutir en el hilo de ejecución JavaScript.
*   2026-03-30: [Sistemas UI Dinámicos] - Pantalla Turno: Ampliado el sistema de Easter Eggs visuales de la "Cerveza de Juan" a una mecánica global automatizada. Cualquier avatar ahora soporta inyección autónoma de accesorios. El sistema comprueba al vuelo si existe un `<slug>_obj.png` asociado al jugador y lo renderiza anclado al `starter-hero-panel`. Posee tolerancia a fallos (`onerror: this.remove()`), por lo que su inclusión no quiebra el DOM de quienes no poseen equipamiento especial. Conserva la animación combinada de suspensión y bioluminiscencia (`mystic-obj-float` y `mystic-obj-pulse`).
*   2026-03-30: [Rediseño Estructural & UX] - Reloj Místico (Pantalla Turno): Se rediseñó por completo el sistema de avance de turno garantizando exclusión posicional. El reloj de la cuenta regresiva y sus botones preestablecidos descuelgan ahora hasta el cuadrante inferior más bajo (`bottom: 0px`). Durante este periodo de tiempo activo, el colosal botón de avance ("Cartas en la mesa") entra en estado `display: none` (`.timer-active`). Cuando el cronómetro se agota (ya sea por ciclo natural o por pulsar el orbe central haciendo un 'skip' temprano), el panel completo del temporizador se evapora, devolviendo la visibilidad al botón inferior, el cual hace su aparición mediante una animación enfática y dimensional (`fadeInScale`) para invitar a la decisión, erradicando pulsaciones fantasma anticipadas.
*   2026-03-30: [UI/UX - Sesión B] - Refinamiento Estético Final: 
    *   **Pantalla Turno**: Actualizado el resplandor de los objetos flotantes de azul a blanco intenso para mejorar la legibilidad y misticismo. Añadida animación de aparición y flotación para el asset `cartas.png` con resplandor azul palpitante, coordinada con el botón de decisión final.
    *   **Pantalla Marcadores**: Redimensionado el botón `#btn-next-round` para ajustarse estrictamente a los píxeles del asset `btn_nueva_ronda.png`, optimizando el área de interacción y evitando solapamientos accidentales.
    *   **Menú Principal**: Añadido resplandor interior azul al logo (`vs-part`) y un nuevo elemento animado: el **Reloj de Arena** (`reloj_arena.png`).
    *   **Coreografía de Animación**: El Reloj de Arena opera en una órbita antihoraria desincronizada respecto a Santi Astronauta. Para evitar colisiones visuales compartiendo el vortex central, se implementó un sistema de **Anillos Orbitales Concéntricos**: Santi habita la periferia exterior (Radios > 35vw) mientras que el Reloj se confina al núcleo central (Radios < 15vw), garantizando una danza cósmica persistente sin solapamientos.
