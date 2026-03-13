# 🌌 Guía Maestra de Pantallas y Activos: Dixit vs Impostor

Este documento es la **única fuente de verdad** para la arquitectura visual, componentes técnicos y activos gráficos de la aplicación **Dixit vs Impostor**. Diseñada bajo una estética *Mystic Steampunk*, la interfaz combina fondos inmersivos, botones ilustrados y efectos dinámicos para una experiencia mágica y mobile-first.

---

## 🛠️ Especificaciones Globales y Técnicas
- **Arquitectura:** SPA (Single Page Application) con navegación dinámica gestionada por `app.js`.
- **Efecto de Transparencia:** Pantallas como `screen-setup` utilizan transparencia total para revelar el fondo estelar dinámico.
- **Contenedor Principal (`#app-container`):** Máximo de **500px**, centrado y optimizado para móviles.
- **Tipografías:**
    - `Fredoka`: Títulos principales y etiquetas de juego.
    - `Raleway`: Interfaz de usuario y botones.
    - `Coda`: Cabeceras técnicas (Angular/Facetadas).
    - `Macondo`: Estética mística y narrativa.
- **Área Táctil:** Mínimo de 48x48px en botones, concentrados en la mitad inferior para uso con una sola mano.
- **Funcionalidades:** Implementa `Screen Wake Lock API` para evitar que la pantalla se apague durante el juego.

---

## 🛠️ Activos Globales (Sistema)
Elementos persistentes o compartidos entre múltiples pantallas.

| Elemento | Archivo / Asset | Descripción |
| :--- | :--- | :--- |
| **Botón Atrás** | `assets/IMG/UI/btn_atras.png` | Ubicado en `global-nav`, permite el retroceso seguro. |
| **Botón Inicio** | `assets/IMG/UI/btn_inicio.png` | Retorno directo al Menú Principal. |
| **Ajustes / Audio** | `assets/IMG/UI/btn_ajustes.png` | Control global de silencio (Mute) para la música. |
| **Música Global** | `music/Clockwork Garden Carnival.mp3` | Ambiente sonoro místico. |
| **Avatares** | `assets/players/[slug].png` | Imágenes personalizadas por jugador (slug minúsculas). |

---

## 🏠 1. Menú Principal (`screen-main-menu`)
Portal de entrada con atmósfera onírica y branding central.

- **Fondo:** `assets/IMG/UI/bg_main.jpg` (con gradientes radiales oscuros).
- **Logotipo:** `assets/IMG/UI/logo_dixit.png` (Animación *pulse-pure* y *drift*).
- **Interactivos:**
    - **Botón Nueva Partida:** `assets/IMG/UI/btn_nueva_partida.png` (Asset integrado en `.btn-book`).
    - **Botón Marcadores:** `assets/IMG/UI/btn-menu-scores.png` (Piedra circular).
    - **Botón Reglas:** `assets/IMG/UI/btn_reglas.png` (Pergamino/Pétalo).
- **Contenido:** "Dixit VS Impostor", "MARCADORES" (CSS) y "REGLAS" (CSS).

---

## 👥 2. Configuración / Setup (`screen-setup`)
Gestión de jugadores y círculo de invocación con transparencia nuclear.

- **Fondo:** `assets/IMG/UI/bg_eleccion_jugadores.png` (Fondo estelar con animación `starsRotate`).
- **Cabecera Visual:** `assets/IMG/UI/btn_jugadores.png` (Asset gráfico que sustituye al texto plano).
- **Círculo de Invocación:**
    - **Banner "Invoca"**: `assets/IMG/UI/btn_invoca.png` (Banner "Elegir del Círculo").
    - **Vórtice Mágico**: Efecto `magic-vortex` con animación `vortex-spin`.
    - **Tótems (Chips)**: `.preset-totem` de madera con brillo azul al activarse.
- **Gestión Jugadores:**
    - **Botón Añadir (+)**: `assets/IMG/UI/btm_mas.png` (Sello de lacre rojo).
    - **Cartas Jugador**: Grid de 3 columnas, marcos dorados y banda de nombre pergamino.
    - **Botón Eliminar**: Sello de lacre rojo con aspa blanca (`.svg-wax-seal`).
- **Botón Comenzar:** `assets/IMG/UI/btn_comenzarpartida.png` (Animación `pulse_glow`).

---

## 🎲 3. Selección de Categorías (`screen-categories`)
- **Fondo:** `assets/IMG/UI/bg_categories.jpg` (Vista onírica amplia).
- **Cartas de Categoría (351x500 aprox):**
    - `cat_conceptos.png` (💡), `cat_peliculas.png` (🎬), `cat_lugares.png` (📍), `cat_refranes.png` (🗣️), `cat_acciones.png` (🎭).
- **Acción Inferior:** `assets/IMG/UI/btn_sorteo.png` (SORTEO DEL DESTINO).

---

## 👁️ 4. Revelación de Roles (`screen-reveal`)
Fase de secreto absoluto y flip 3D.

- **Fondo:** `assets/IMG/UI/bg_tension.jpg` (Fondo de alta tensión).
- **Sistema de Cartas:**
    - **Anverso (Inocente)**: `assets/players/{slug}.png`.
    - **Reverso (Revelación)**: `assets/IMG/Impostor/{slug}_impostor.png` o Palabra Secreta.
- **Botones:**
    - `btn_mostrarrol.png`: **MANTÉN PULSADO**.
    - `btn_listo.png`: **LISTO**.

---

## ⏳ 5. Elección de Carta y Temporizador (`screen-timer`)
- **Fondo:** `assets/IMG/UI/bg_eligetucarta.png`.
- **Imagen Protagonista:** `assets/IMG/Empieza_Turno/[slug]_start.png` (Asset "Empieza el turno").
- **Controles de Tiempo:** `btn_edittime.png` (Botones +/- 15s y rápidos de 60s, 90s, 120s).
- **Botón Acción:** `btn_cartasalamesa.png` (¡CARTAS EN LA MESA! con `magic-flicker`).

---

## 🚨 6. Pánico y Revelación (`screen-panic`)
- **Fondo:** `assets/IMG/UI/bg_reveal.png`.
- **Piedra de Invocación:**
    - **Base**: `btn_piedrareveal.png`.
    - **Luz**: `btn_luz_reveal.png` (Animación `rotateMagicLight`).
- **Visuales:** Palabra secreta gigante en fuente `Fredoka` con animación `heartbeat`.
- **Botón Final:** "Finalizar Debate y Votar 🗳️".

---

## 🗳️ 7. Votación y Marcadores (`screen-voting` & `screen-score`)
- **Fondos:** `bg_reveal.png` (Votación) y `bg_soft.jpg` (Marcadores).
- **Interactividad:** Lista `voting-row` con avatares y destello `✨`.
- **Marcadores:** `score-item` con ganadores resaltados (`.winner`).
- **Acciones:** `btn_primary.png` (Nueva Ronda), `btn_secondary.png` (Reset), `btn_danger.png` (Salir).

---

## 📊 Inventario de Assets y Resoluciones

| Recurso | Resolución | Uso |
| :--- | :--- | :--- |
| **bg_main.jpg** | 1072x1920 | Menú y Marcadores |
| **bg_categories.jpg** | 1616x2624 | Categorías |
| **bg_tension.jpg** | 1072x1920 | Revelación y Votos |
| **bg_reveal.png** | 1072x1920 | Pánico y Votación |
| **logo_dixit.png** | 1024x512 | Branding Animado |
| **btn_primary.png** | 1024x336 | Acciones Positivas |
| **btn_jugadores.png** | 1024x256 | Cabecera Setup |
| **btn_invoca.png** | 496x176 | Banner Setup |
| **wax_seal_add.png** | 640x640 | Añadir Jugador |
| **cat_*.png** | ~350x500 | Categorías |

---

## ✨ Sistema de Efectos Visuales
- **Dandelion Seeds:** Semillas voladoras (`seed-fly`) al iniciar partida.
- **Star Dust:** Partículas doradas al interactuar con jugadores.
- **Liquid Ripple:** Onda expansiva al pulsar botones.
- **Vortex:** Espiral de luz en el círculo de invocación.

---

> [!IMPORTANT]
> **Rutas Críticas:** Los nombres de activos para jugadores (`assets/players/`) deben coincidir exactamente con el **slug** del nombre del jugador (minúsculas, sin espacios). Ejemplo: `dc.png`.
