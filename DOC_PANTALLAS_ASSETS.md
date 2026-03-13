# 🌌 Guía Maestra de Pantallas y Activos: Dixit vs Impostor

Este documento detalla la arquitectura visual y los activos gráficos de cada pantalla de la aplicación **Dixit vs Impostor (Game Master)**. Diseñada bajo una estética *Mystic Steampunk*, la interfaz utiliza una combinación de fondos inmersivos, botones ilustrados y efectos dinámicos.

---

## 🛠️ Activos Globales (Navegación y Sistema)
Estos elementos están presentes en múltiples pantallas o actúan como controles persistentes.

| Elemento | Archivo / Asset | Descripción |
| :--- | :--- | :--- |
| **Botón Atrás** | `assets/IMG/UI/btn_atras.png` | Ubicado en `global-nav`, permite el retroceso seguro. |
| **Botón Inicio** | `assets/IMG/UI/btn_inicio.png` | Retorno directo al Menú Principal. |
| **Ajustes / Audio** | `assets/IMG/UI/btn_ajustes.png` | Control global de silencio (Mute) para la música. |
| **Música Global** | `music/Clockwork Garden Carnival.mp3` | Ambiente sonoro místico. |
| **Avatares** | `assets/players/[slug].png` | Imágenes personalizadas por jugador (slug minúsculas). |

---

## 🏠 1. Menú Principal (`screen-main-menu`)
El portal de entrada. Enfocado en la marca y la acción inmediata.

- **Fondo**: `assets/IMG/UI/bg_main.jpg` (Imagen base del menú). *Nota: bg_main_new.jpg existe como variante de alta resolución.*
- **Logotipo**: `assets/IMG/UI/logo_dixit.png` (Con animación `logo-pulse-pure` de 5s).
- **Contenido de Texto**:
    - Título (Logo): "Dixit VS Impostor".
    - Botón Principal: "NUEVA PARTIDA" (Integrado en asset).
    - Botón Secundario 1: "MARCADORES" (vía CSS `::after`).
    - Botón Secundario 2: "REGLAS" (vía CSS `::after`).
- **Botón "Nueva Partida"**: `assets/IMG/UI/btn_nueva_partida.png` (Asset integrado en `.btn-book`).
- **Botón "Marcadores"**: `assets/IMG/UI/btn-menu-scores.png` (Estética de piedra circular).
- **Botón "Reglas"**: `assets/IMG/UI/btn_reglas.png` (Estética de pergamino/pétalo).

---

## 👥 2. Configuración / Setup (`screen-setup`)
Gestión de jugadores y círculo de invocación.

- **Fondo**: `assets/IMG/UI/bg_eleccion_jugadores.png` (Fondo estelar dinámico con animación `starsRotate`).
- **Círculo de Invocación**:
    - **Banner "Invoca"**: `assets/IMG/UI/btn_invoca.png`.
    - **Vórtice Mágico**: Efecto `magic-vortex` con animación `vortex-spin`.
    - **Tótems (Chips)**: `.preset-totem` con textura de madera y brillo azul al activarse.
- **Añadir Nuevo Jugador**:
    - **Botón (+)**: `assets/IMG/UI/btm_mas.png` (Sello de lacre rojo).
- **Cartas de Jugador**: Grid de 3 columnas con borde dorado (`.player-card`).
    - **Botón Eliminar**: Sello de lacre rojo con aspa blanca (`.svg-wax-seal`).
- **Botón Comenzar**: `assets/IMG/UI/btn_comenzarpartida.png` (Animación `pulse_glow` al habilitarse).
- **Contenido de Texto**:
    - Cabecera: "Nueva Partida" (Fuente: `Coda`).
    - Banner de Presets: "INVOCA" (Asset) / Lógica interna: "Elegir del Círculo".
    - Divisor: "O INVOCAR NUEVO".
    - Input: "¿Quién se une al sueño?" (Placeholder).
    - Botón Acción: "COMENZAR PARTIDA" (Integrado en asset).

---

## 🎲 3. Selección de Categorías (`screen-categories`)
Define el destino de la ronda.

- **Fondo**: `assets/IMG/UI/bg_categories.jpg` (Vista onírica a pantalla completa).
- **Cartas de Categoría**:
    - `cat_conceptos.png`, `cat_peliculas.png`, `cat_lugares.png`, `cat_refranes.png`, `cat_acciones.png`.
    - Layout: Grid 2x3 con el 5º elemento centrado.
- **Botón Sorteo (Random)**: `assets/IMG/UI/btn_sorteo.png` (Pergamino horizontal al pie).
- **Contenido de Texto**:
    - Cabecera: "Categorías".
    - Subtitle: "Selecciona la temática".
    - Botón Sorteo: "SORTEO DEL DESTINO" (Asset).
    - Categorías: "Conceptos", "Películas", "Lugares", "Refranes", "Acciones".

---

## 👁️ 4. Revelación de Roles (`screen-reveal`)
Fase de secreto absoluto y flip 3D.

- **Fondo**: `assets/IMG/UI/bg_tension.jpg` (Fondo de alta tensión para la fase de secreto).
- **Efecto de Carta (Flip 3D)**:
    - **Anverso (Inocente)**: `assets/IMG/Inocente/[slug].png`.
    - **Reverso (Revelación)**: 
        - *Inocente*: Palabra secreta sobre fondo de carta habitual.
        - *Impostor*: `assets/IMG/Impostor/[slug]_impostor.png` + Etiqueta roja pulsante.
- **Botón "MANTÉN PULSADO"**: `assets/IMG/UI/btn_mostrarrol.png`.
- **Botón "LISTO"**: `assets/IMG/UI/btn_listo.png`.
- **Contenido de Texto**:
    - Cabecera: "${nombre_jugador}" (Dinámico).
    - Acción 1: "MANTÉN PULSADO" (Asset).
    - Acción 2: "LISTO" (Asset).
    - Revelación Inocente: "${palabra_secreta}" (Dinámico).
    - Revelación Impostor: "ERES EL IMPOSTOR" (Label pulsante).

---

## ⏳ 5. Elección de Carta y Temporizador (`screen-timer`)
Fase física de búsqueda de cartas.

- **Fondo**: `assets/IMG/UI/bg_eligetucarta.png`.
- **Imagen Protagonista (Starter)**: `assets/IMG/Empieza_Turno/[slug]_start.png` (Asset de gran formato).
- **Controles de Tiempo**:
    - **Botones Ajuste**: `assets/IMG/UI/btn_edittime.png` (Para +/- 15s y selectores rápidos).
- **Botón "Cartas a la Mesa"**: `assets/IMG/UI/btn_cartasalamesa.png` (Animación `magic-flicker`).
- **Contenido de Texto**:
    - Cabecera: "Empieza el turno".
    - Starter: "Empieza el turno: ${jugador}" (Asset dinámico).
    - Controles Tiempo: "-15s", "+15s", "1:00", "1:30", "2:00".
    - Botón Acción: "¡CARTAS EN LA MESA!" (Asset).

---

## 🚨 6. Pánico y Revelación (`screen-panic`)
El momento de la verdad para el impostor.

- **Fondo**: `assets/IMG/UI/bg_reveal.png` (Fondo onírico para la revelación grupal).
- **Piedra de Invocación**:
    - **Piedra**: `assets/IMG/UI/btn_piedrareveal.png`.
    - **Aura de Luz**: `assets/IMG/UI/btn_luz_reveal.png` (Animación `rotateMagicLight`).
- **Revelación**: Palabra en tamaño gigante con animación `heartbeat` en la cuenta atrás.
- **Contenido de Texto**:
    - Fase Revelación: "La palabra secreta es:".
    - Palabra: "${palabra_secreta}" (Dinámico).
    - Cuenta Atrás: "5, 4, 3, 2, 1" (Visual).
    - Debate UI: "¡A defender!".
    - Botón Post-Debate: "Finalizar Debate y Votar 🗳️".

---

## 🗳️ 7. Votación y Marcadores (`screen-voting` & `screen-score`)
Resolución y gloria.

- **Fondo Votación**: `assets/IMG/UI/bg_reveal.png`.
- **Fondo Marcadores**: `assets/IMG/UI/bg_soft.jpg` (Textura suave para legibilidad de puntuaciones).
- **Modificadores de Puntos**:
    - **Botones +/-**: `assets/IMG/UI/btn_circle.png`.
- **Acciones Finales**:
    - **Nueva Ronda**: `assets/IMG/UI/btn_primary.png`.
    - **Salir / Reset**: `assets/IMG/UI/btn_danger.png` / `assets/IMG/UI/btn_secondary.png`.
- **Contenido de Texto**:
    - Título Votación: "Votación".
    - Subtitlo Votación: "¿Quiénes acertaron al impostor?".
    - Título Score: "Marcadores 🏆".
    - Razones Score: "Invicto", "Único Acertante", "Pillado por TODOS", etc.
    - Botones Acción: "Nueva Ronda 🔄", "Resetear Marcadores ⚠️", "Salir al Inicio 🚪".

---

## ✨ Sistema de Partículas y Efectos Visuales
La inmersión se completa con efectos programáticos:
- **Dandelion Seeds**: Semillas que vuelan (`seed-fly`) al iniciar una nueva partida.
- **Star Dust**: Partículas doradas al añadir jugadores.
- **Liquid Ripple**: Efecto de gota de agua al pulsar botones principales.
- **Vortex**: Espiral de luz en el menú de setup.

---

> [!IMPORTANT]
> **Rutas Críticas**: Los nombres de archivos de jugadores y cartas deben estar en minúsculas y sin espacios (slug) para que el sistema de carga dinámica en `app.js` funcione correctamente. Ejemplo: `Diego J` -> `diegoj.png`.
