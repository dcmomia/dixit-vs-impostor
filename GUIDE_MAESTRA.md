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

---

## 🛠️ Activos Globales (Sistema)
Elementos persistentes o compartidos entre pantallas.

| Elemento | Archivo / Asset | Descripción |
| :--- | :--- | :--- |
| **Botón Atrás** | `assets/IMG/UI/global/btn_atras.png` | En `global-nav`. Historial de navegación. |
| **Botón Inicio** | `assets/IMG/UI/global/btn_inicio.png` | En `global-nav`. Retorno al Menú Principal. |
| **Ajustes / Audio** | `assets/IMG/UI/global/btn_ajustes.png` | Control global de volumen/mute. |
| **Música Global** | `music/Clockwork Garden Carnival.mp3` | Ambiente sonoro principal. |
| **Avatares** | `assets/players/[slug].png` | Retratos personalizados (3x3 en Setup). |

---

## 🏠 1. Menú Principal (`screen-main-menu`)
Portal de entrada con atmósfera onírica y branding central.

- **Fondo:** `assets/IMG/UI/menu/bg_main.jpg` (Gradientes radiales profundos).
- **Logotipo:** `assets/IMG/UI/menu/logo_dixit.png` (Animación *pulse-pure* y *drift*).
- **Interactivos:**
    - **Botón Nueva Partida:** `assets/IMG/UI/menu/btn_nueva_partida.png` (Estilo libro antiguo).
    - **Botón Marcadores:** `assets/IMG/UI/menu/btn-menu-scores.png` (Piedra rúnica con texto "MARCADORES").
    - **Botón Reglas:** `assets/IMG/UI/menu/btn_reglas.png` (Pétalo místico con texto "REGLAS").

---

## 👥 2. Configuración / Setup (`screen-setup`)
Gestión de jugadores con transparencia total para revelar el fondo dinámico.

- **Fondo:** `assets/IMG/UI/setup/bg_eleccion_jugadores.png` (Estrellas rotando).
- **Cabecera:** `assets/IMG/UI/setup/btn_jugadores.png` (Sustituye al h2 de "Nueva Partida").
- **Círculo de Invocación (Presets):**
    - **Tótems (Botones)**: Chips de madera con brillo azul al estar activos.
    - **Vórtice**: Animación circular `vortex-spin` de fondo.
- **Divisor Visual**: Texto "**O INVOCA UNO NUEVO**" con sombreado profundo para legibilidad.
- **Entrada Manual:**
    - **Input**: Placeholder "¿Quién se une al sueño?" (Estilo pergamino).
    - **Botón Añadir (+)**: `assets/IMG/UI/setup/btm_mas.png` (Sello de lacre rojo).
- **Lista de Jugadores:** Grid de 3 columnas con cartas de marcos dorados y botón eliminar (Sello de lacre con aspa).
- **Botón Comenzar:** `assets/IMG/UI/setup/btn_comenzarpartida.png` (Animación de pulso dorado).

---

## 🎲 3. Selección de Categorías (`screen-categories`)
Asignación de la temática del mundo onírico.

- **Fondo:** `assets/IMG/UI/categories/bg_categories.jpg` (Vista de horizonte místico).
- **Cartas de Categoría (351x500):**
    - Activos: `cat_conceptos.png` (💡), `cat_peliculas.png` (🎬), `cat_lugares.png` (📍), `cat_refranes.png` (🗣️), `cat_acciones.png` (🎭). *(En `assets/IMG/UI/categories/`)*
    - Diseño: **Resplandor Dual Azul-Rosa** (`box-shadow`) y efecto de **Flotación Mágica** (`categoryMagicFloat`). Sin bordes sólidos amarillos.
- **Botón Sorteo:** `assets/IMG/UI/categories/btn_sorteo.png` (Sorteo del Destino).

---

## 👁️ 4. Revelación de Roles (`screen-reveal`)
Fase de secreto absoluto con tecnología de volteo 3D y marcos dinámicos.

- **Fondos Dinámicos (Atmósfera):**
    - **Por defecto / Inocentes:** `assets/IMG/UI/reveal/bg_tension.jpg` (Textura de alta tensión clara).
    - **Modo Impostor:** `assets/IMG/UI/reveal/bg_tension_dark.png` (Oscuridad siniestra al mantener pulsado el botón de revelar).
- **Sistema de Cartas:**
    - **Anverso (Frente)**: `assets/IMG/Inocente/[slug].png` enmarcado con `marco_inocente.png`.
    - **Reverso (Giro)**: Palabra Secreta o avatar con `marco_impostor.png`.
    - **Marcos de Identidad**: 
        - `assets/IMG/UI/reveal/marco_inocente.png`: Marco azul/místico para inocentes (frontal y reverso).
        - `assets/IMG/UI/reveal/marco_impostor.png`: Marco rojizo/agresivo para el impostor (solo reverso).
- **Botón Hold:** `assets/IMG/UI/reveal/btn_mostrarrol.png` (MANTÉN PULSADO).
- **Botón Listo:** `assets/IMG/UI/reveal/btn_listo.png` (LISTO - Diseño de gran tamaño).
- **Estética Limpia**: Se ha eliminado el texto "ERES EL IMPOSTOR" y las luces rojas dinámicas; la identidad se comunica puramente a través del marco.

---

## ⏳ 5. Temporizador y Turno (`screen-timer`)
- **Fondo:** `assets/IMG/UI/tension/bg_eligetucarta.png`.
- **Imagen Protagonista:** `assets/IMG/Empieza_Turno/[slug]_start.png` (Imagen de gran formato del jugador que empieza).
- **Controles:** `assets/IMG/UI/tension/btn_edittime.png` (Botones circulares para +/- 15s y botones rápidos).
- **Botón Acción:** `assets/IMG/UI/tension/btn_cartasalamesa.png` (¡CARTAS EN LA MESA! con resplandor parpadeante).

---

## 🚨 6. Pánico y Revelación (`screen-panic`)
- **Dinámica de Fondo:**
    - Fase Inicial: `assets/IMG/UI/reveal/bg_reveal.png`.
    - Fase Revelación (al pulsar piedra): `assets/IMG/UI/tension/bg_palabrailuminada.png`.
- **Efecto Piedra:**
    - **Base de Piedra**: `assets/IMG/UI/tension/btn_piedrareveal.png`.
    - **Aura Giratoria**: `assets/IMG/UI/tension/btn_luz_reveal.png` (Animación `rotateMagicLight`).
- **Layout de Pánico/Debate**:
    - **Parte Superior**: Palabra secreta (Clase `.shamanic-glyph`: Amarilla-Naranja, letras rectas) centrada arriba.
    - **Centro Visual**: Contador numérico sobre fondo iluminado, reemplazado por botón de Votar.
- **Botón Final**: `assets/IMG/UI/tension/btn_votar.png` (Con animación `angelicButtonGlow` de brillo blanco pulsante).

---

## 🗳️ 7. Votación y Marcadores (`screen-voting` & `screen-score`)
- **Fondo Votación:** `assets/IMG/UI/voting_score/bg_votaciones.png`.
- **Fondo Marcadores:** `assets/IMG/UI/menu/bg_main.jpg` (con filtros de desenfoque).
- **Activos de Voto:** Filas interactivas con avatares y destello `✨` de confirmación.
- **Botones Marcadores:** `assets/IMG/UI/voting_score/btn_circle.png` (Para ajustar puntos manualmente).
- **Acciones Finales:** `btn_primary.png`, `btn_secondary.png`, `btn_danger.png` *(En `assets/IMG/UI/global/`)*.

---

## 📊 Inventario de Assets por Categoría

| Categoría | Recurso | Función |
| :--- | :--- | :--- |
| **Fondos** | `bg_main.jpg` | Menú Principal / Marcadores |
| **Fondos** | `bg_categories.jpg` | Categorías |
| **Fondos** | `bg_tension.jpg` | Revelación (Estado Base / Inocentes) |
| **Fondos** | `bg_tension_dark.png` | Revelación (Efecto Crítico Impostor) |
| **Fondos** | `bg_eleccion_jugadores.png` | Setup / Configuración |
| **Fondos** | `bg_reveal.png` | Pánico / Votación |
| **Fondos** | `bg_eligetucarta.png` | Temporizador / Turno |
| **UI** | `btn_jugadores.png` | Cabecera Setup |
| **UI** | `btm_mas.png` | Añadir Jugador |
| **UI** | `btn_comenzarpartida.png` | Iniciar Juego |
| **UI** | `btn_mostrarrol.png` | Revelación Secreta |
| **UI** | `btn_listo.png` | Confirmación Turno |
| **UI** | `reveal/marco_inocente.png` | Marco para cartas de Inocentes |
| **UI** | `reveal/marco_impostor.png` | Marco para cartas de Impostor |
| **UI** | `btn_cartasalamesa.png` | Fin de Turno |
| **UI** | `btn_piedrareveal.png` | Piedra de Revelación |
| **UI** | `btn_luz_reveal.png` | Aura de la Piedra |
| **UI** | `btn_votar.png` | Botón para ir a votación |
| **UI** | `cuenta_atras/` | Imágenes 5 a 1 para cuenta atrás |

---

## ✨ Sistema de Efectos Visuales
- **Dandelion Seeds:** Semillas que vuelan al pulsar Nueva Partida.
- **Star Dust / Stardust:** Partículas doradas (`✨`) al añadir, eliminar o interactuar con jugadores.
- **Liquid Ripple:** Onda expansiva al pulsar botones principales.
- **Magic Vortex:** Espiral de luz en el fondo de los jugadores preset.
- **Magic Float:** Efecto de levitación rítmica para las cartas de categoría.

---

> [!IMPORTANT]
> **Rutas Críticas:** Todas las imágenes dinámicas dependen del **slug** del jugador (resultado de eliminar espacios y pasar a minúsculas). Ejemplo: `Diego J` -> `diegoj.png`.
