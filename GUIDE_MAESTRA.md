# 🌌 Guía Maestra de Pantallas y Activos: Dixit vs Impostor

Este documento es la **única fuente de verdad** para la arquitectura visual, componentes técnicos y activos gráficos de la aplicación **Dixit vs Impostor**. Diseñada bajo una estética *Mystic Steampunk*, la interfaz combina fondos inmersivos, botones ilustrados y efectos dinámicos para una experiencia mágica y mobile-first.

---

## 🛠️ Especificaciones Globales y Técnicas
- **Arquitectura:** SPA (Single Page Application) con navegación dinámica gestionada por `app.js`.
- **Contenedor Principal (`#app-container`):** Máximo de **550px** en escritorio (centrado) y **100%** en móviles.
- **Tipografías:**
    - `Fredoka`: Títulos místicos y etiquetas de juego.
    - `Raleway`: Interfaz de usuario y botones técnicos.
    - `Macondo`: Etiquetas narrativas y nombres de tarjetas.
    - `Nunito`: Texto de apoyo y placeholders.
- **Área Táctil:** Botones concentrados en la mitad inferior para uso con el pulgar.
- **Funcionalidades:** Implementa `Screen Wake Lock API` para evitar la suspensión de pantalla.
- **Seguridad:** Uso de `window.crypto.getRandomValues` para el sorteo de roles e imparcialidad (anti-repetición mediante `lastImpostor`).

---

## 🛠️ Activos Globales (Sistema)
Elementos persistentes o compartidos entre pantallas.

| Elemento | Archivo / Asset | Descripción |
| :--- | :--- | :--- |
| **Botón Atrás** | `assets/IMG/UI/global/btn_atras.png` | En `global-nav`. Historial de navegación. |
| **Botón Inicio** | `assets/IMG/UI/global/btn_inicio.png` | En `global-nav`. Retorno al Menú Principal. |
| **Ajustes / Audio** | `assets/IMG/UI/global/btn_ajustes.png` | Control global de volumen/mute. |
| **Música Global** | `music/Clockwork Garden Carnival.mp3` | Ambiente sonoro principal. |
| **Avatares** | `assets/players/[slug].png` | Retratos personalizados (Grid 3 col en Setup). |

---

## 🏠 1. Menú Principal (`screen-main-menu`)
Portal de entrada con atmósfera onírica y branding central.
- **Funcionalidad**: Punto de acceso a Nueva Partida, Marcadores y Reglas.
- **Fondo:** `assets/IMG/UI/menu/bg_main.jpg` (Gradientes radiales profundos).
- **Logotipo:** `assets/IMG/UI/menu/logo_dixit.png` (Animación *pulse-pure* y *drift*).
- **Interactivos:**
    - **Botón Nueva Partida:** `assets/IMG/UI/menu/btn_nueva_partida.png` (Estilo libro antiguo).
    - **Botón Marcadores:** `assets/IMG/UI/menu/btn-menu-scores.png` (Piedra rúnica con texto "MARCADORES").
    - **Botón Reglas:** `assets/IMG/UI/menu/btn_reglas.png` (Pétalo místico con texto "REGLAS").

---

## 👥 2. Configuración / Setup (`screen-setup`)
Gestión de jugadores con transparencia total para revelar el fondo dinámico.
- **Funcionalidad**: Gestión de participantes. Mínimo 3 jugadores.
    - **Chips Rápido**: Selección de jugadores recurrentes (DC, JAVI, ELI, etc.).
    - **Invocación Nueva**: Añadir mediante input estilo pergamino y sello de lacre rojo.
- **Fondo:** `assets/IMG/UI/setup/bg_eleccion_jugadores.png` (Estrellas rotando).
- **Cabecera:** `assets/IMG/UI/setup/btn_jugadores.png`.
- **Lista de Jugadores:** Grid con cartas de marcos dorados y botón eliminar (Sello de lacre con aspa).
- **Botón Comenzar:** `assets/IMG/UI/setup/btn_comenzarpartida.png` (Animación de pulso dorado).

---

## 🎲 3. Selección de Categorías (`screen-categories`)
Asignación de la temática del mundo onírico (Conceptos, Películas, Lugares, etc.).
- **Funcionalidad**: Carga dinámica desde `data/words.json`. Opción de sorteo aleatorio 🎲.
- **Fondo:** `assets/IMG/UI/categories/bg_categories.jpg` (Vista de horizonte místico).
- **Cartas de Categoría (351x500):**
    - Activos: `cat_conceptos.png`, `cat_peliculas.png`, `cat_lugares.png`, `cat_refranes.png`, `cat_acciones.png`.
    - Diseño: Resplandor Dual Azul-Rosa y efecto de **Flotación Mágica**.
- **Botón Sorteo:** `assets/IMG/UI/categories/btn_sorteo.png`.

---

## 👁️ 4. Revelación de Roles (`screen-reveal`)
Fase de secreto absoluto con tecnología de volteo 3D y marcos dinámicos.
- **Funcionalidad**: Fase individual. "Hold" para ver rol (Protección visual).
- **Fondos Dinámicos (Atmósfera):**
    - **Inocentes:** `assets/IMG/UI/reveal/bg_tension.jpg` (Textura clara).
    - **Modo Impostor:** `assets/IMG/UI/reveal/bg_tension_dark.png` (Oscuridad siniestra al mantener pulsado).
- **Sistema de Cartas:**
    - **Anverso**: `assets/IMG/Inocente/[slug].png` + `marco_inocente.png`.
    - **Reverso (Giro)**: Palabra Secreta o avatar + `marco_impostor.png` (Rojizo/agresivo).
- **Botón Hold:** `assets/IMG/UI/reveal/btn_mostrarrol.png` (MANTÉN PULSADO).
- **Botón Listo:** `assets/IMG/UI/reveal/btn_listo.png` (Pasar al siguiente jugador).

---

## ⏳ 5. Temporizador y Turno (`screen-timer`)
Fase de defensa y selección de cartas físicas.
- **Funcionalidad (Actualización 2026-03-15)**: 
    - **Designación**: Anuncia el primer orador (Cualquiera puede empezar, incluido Impostor).
    - **Widget del Tiempo**: Orbe central de `190x190px` con fondo `btn_time.png`.
    - **Ajustes en vivo**: Botones rápidos (1m, 1.5m, 2m) y controles +/- 15s (`btn_edittime.png`).
- **Fondo:** `assets/IMG/UI/tension/bg_eligetucarta.png`.
- **Imagen Protagonista:** `[slug]_start.png` (55vh) con resplandor azul parpadeante (`blueGlowPulse`).
- **Botón Acción:** `assets/IMG/UI/tension/btn_cartasalamesa.png`.

---

## 🚨 6. Pánico y Revelación (`screen-panic`)
Fase de tensión máxima donde todos conocen la palabra.
- **Funcionalidad**: Pánico de 5s para improvisación del Impostor. Tras el 0, se mantiene para debate.
- **Botón Piedra**: `btn_piedrareveal.png` con aura giratoria `btn_luz_reveal.png`.
- **Fase Revelada**: Fondo `bg_palabrailuminada.png`. Palabra y Cuenta Atrás en fuente `.shamanic-glyph` / `.panic-number-text` (Amarillo Místico).
- **Botón Final**: `assets/IMG/UI/tension/btn_votar.png` (Brillo `angelicButtonGlow`).

---

## 🗳️ 7. Aciertos y Marcadores (`screen-aciertos` & `screen-score`)
- **Aciertos (Revelación Exclusiva)**: Grid adaptativo (hasta 4x4) de jugadores que descubrieron al impostor. Carteles steampunk para los nombres. Fondo `bg_acertar_impostor.png`.
    - **Acciones**: Botón flotante `btn_acertarimpostor.png` y confirmación `btn_confirmar_votos.png`.
- **Marcadores Astrales**: Tabla ordenada de puntuaciones con jerarquía visual (Corona de Oro 1º, Plata 2º). Fondo `bg_marcadores.png`.
    - **Edición Manual**: Ajuste mediante botones `+` y `-` para delegar el control. (Lista scrolleable, hasta 16 jugadores).
    - **Acciones**: Retorno, Nueva Travesía o Reiniciar Ritual (Alineación horizontal fija inferior).

---

## 📊 Inventario de Assets por Categoría

| Categoría | Recurso | Función |
| :--- | :--- | :--- |
| **Fondos** | `bg_main.jpg`, `bg_categories.jpg`, `bg_eleccion_jugadores.png`, `bg_reveal.png`, `bg_eligetucarta.png`, `bg_tension.jpg`, `bg_tension_dark.png` | Atmósferas de pantalla |
| **UI** | `btn_jugadores.png`, `btm_mas.png`, `btn_comenzarpartida.png`, `btn_mostrarrol.png`, `btn_listo.png`, `btn_cartasalamesa.png`, `btn_piedrareveal.png`, `btn_luz_reveal.png`, `btn_votar.png` | Botones temáticos |
| **UI** | `reveal/marco_inocente.png`, `reveal/marco_impostor.png` | Marcos de identidad secreta |
| **UI** | `btn_time.png`, `btn_edittime.png` | Elementos de temporizador (Marzo 15) |
| **Otros** | `assets/players/[slug].png` | Assets variables |

---

## ✨ Sistema de Efectos Visuales
- **Dandelion Seeds / Star Dust**: Partículas y transiciones mágicas.
- **Magic Vortex / Liquid Ripple**: Animaciones de interacción táctica.
- **BlueGlowPulse**: Resplandor dinámico en el avatar del orador actual.

---

> [!IMPORTANT]
> **Rutas Críticas:** Todas las imágenes dinámicas dependen del **slug** del jugador (resultado de eliminar espacios y pasar a minúsculas). Ejemplo: `Diego J` -> `diegoj.png`.
