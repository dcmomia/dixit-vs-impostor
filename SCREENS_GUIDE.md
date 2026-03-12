# Guía de Pantallas - Dixit vs Impostor

Esta guía detalla todas las interfaces y el flujo de navegación de la aplicación **Dixit vs Impostor (Game Master)**. La aplicación está diseñada como una SPA (Single Page Application) premium con estética *Dark Blue Mystic*.

---

## 1. Pantallas de Inicio y Preparación

### 🏠 Menú Principal (`screen-main-menu`)
Es el punto de entrada de la aplicación.
- **NUEVA PARTIDA**: Inicia el flujo de configuración de una nueva sesión.
- **MARCADORES**: Acceso directo a la tabla de puntuaciones acumuladas.
- **REGLAS**: Abre un modal con las instrucciones rápidas de juego.

### 👥 Configuración / Setup (`screen-setup`)
Gestión de los participantes de la partida.
- **Jugadores Recurrentes**: Chips de acceso rápido para añadir nombres predefinidos (DC, JAVI, ELI, etc.).
- **Añadir Jugador**: Input manual para nuevos participantes.
- **Lista de Jugadores**: Visualización de los jugadores activos con sus avatares dinámicos y opción de eliminación.
- **Validación**: Requiere un mínimo de 3 jugadores para comenzar.

---

## 2. Ciclo de Juego (Game Loop)

### 🧩 Selección de Categorías (`screen-categories`)
Define la temática de la ronda actual.
- **Categorías**: Conceptos, Películas, Lugares, Refranes, Acciones.
- **Aleatorio 🎲**: Selección automática de temática para mayor rapidez.
- **Lógica**: Carga dinámicamente las palabras desde `data/words.json`.

### 👁️ Revelación de Roles (`screen-reveal`)
Fase individual y secreta para cada jugador.
- **Avatar Hero**: Muestra quién debe tomar el dispositivo.
- **Acción "Hold"**: Botón **MANTÉN PULSADO** para ver la palabra secreta (o el aviso de Impostor).
- **Seguridad**: Al soltar el dedo, la palabra se oculta y aparece el botón para pasar al siguiente jugador.

### ⏳ Elección de Carta y Temporizador (`screen-timer`)
Gestión del tiempo mientras los jugadores seleccionan sus cartas físicas.
- **Primer Orador**: Designación aleatoria (RNG Seguro) de quién empieza a defender su carta.
- **Temporizador Dinámico**: Cuenta atrás configurable (60s, 90s, 120s) con controles de ajuste en vivo (+/- 15s).
- **Control de Flujo**: Botón "¡Cartas en la mesa!" para avanzar.

### 🚨 Pánico y Revelación de Palabra (`screen-panic`)
Fase de tensión máxima donde todos conocen la palabra.
- **Tap to Reveal**: Pantalla de bloqueo para asegurar que todos están listos.
- **Efecto Pánico**: Revelación de la palabra en tamaño gigante y cuenta atrás de **5 segundos** de improvisación para el impostor.
- **Debate**: Tras el pánico, se mantiene la palabra visible para apoyar la discusión física.

---

## 3. Resolución y Resultados

### 🗳️ Votación (`screen-voting`)
Fase de auditoría de la ronda.
- **Checkboxes**: El Game Master marca quiénes han identificado correctamente al impostor.
- **Lógica**: Excluye automáticamente al impostor de la lista de votantes.

### 🏆 Marcadores / Puntuación (`screen-score`)
Resumen de puntos y estado de la partida.
- **Ranking**: Tabla ordenada por puntuación descendente.
- **Feedback de Ronda**: Muestra los puntos ganados (+X) y el motivo (ej: "🎯 Único Acertante").
- **Edición Manual**: Permite sumar o restar puntos directamente en los marcadores.
- **Acciones Finales**: Nueva Ronda (vuelve a categorías), Resetear Partida o Salir al Menú.

---

## 🛠️ Utilidades Globales

- **Modal de Confirmación**: Sistema de diálogos premium para evitar errores accidentales (borrar jugadores, salir, etc.).
- **Fallback de Avatares**: Si no se encuentra la imagen en `assets/players/`, el sistema asigna automáticamente un emoji único del `avatarPool`.
