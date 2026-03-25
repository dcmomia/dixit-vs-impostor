/**
 * app_explicado.js - El cerebro de Dixit vs Impostor
 * Este archivo gestiona todo el flujo del juego, los puntos y las pantallas.
 */

const state = { // El objeto 'state' guarda todos los datos de la partida actual.
    players: [], // Lista de nombres de los jugadores. Si se vacía, no hay partida.
    playerAvatars: {}, // Diccionario {nombre: emoji}. Asocia a cada jugador un icono de respaldo.
    avatarPool: ['🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🦄', '🐶', '🐱', '🐹', '🐭'], 
    // Banco de emojis disponibles. A medida que se usan, se quitan de aquí para no repetir.
    
    minPlayers: 3, // Mínimo de jugadores para empezar. Cambiarlo a 4 haría el juego más restrictivo.
    selectedCategory: null, // Categoría elegida (conceptos, películas...).
    gameData: null, // Aquí se guardan las palabras cargadas desde words.json.
    
    roles: [], // Guarda qué rol tiene cada jugador (Inocente o Impostor) y su palabra.
    impostorName: null, // Nombre del jugador que ha sido elegido como impostor en la ronda.
    secretWord: null, // La palabra que los inocentes deben conocer y el impostor adivinar.
    
    scores: {}, // Puntos totales acumulados en la sesión {Nombre: Puntos}.
    roundScores: {}, // Puntos ganados o perdidos SOLO en la última ronda.
    roundReasons: {}, // Mensaje explicativo de por qué ganó esos puntos (ej: "Pillado por todos").
    
    lastCorrectVoters: [], // Lista de quiénes acertaron quién era el impostor.
    usedWords: [], // Historial de palabras usadas para que no salgan dos veces la misma noche.
    lastImpostor: null, // Guarda quién fue el último impostor para evitar que le toque dos veces seguidas.
    
    categories: [ // Definición de las temáticas disponibles en el juego.
        { id: 'conceptos', name: 'Conceptos', icon: '💡' },
        { id: 'peliculas', name: 'Películas', icon: '🎬' },
        { id: 'lugares', name: 'Lugares', icon: '📍' },
        { id: 'refranes', name: 'Refranes', icon: '🗣️' },
        { id: 'acciones', name: 'Acciones', icon: '🎭' }
    ]
};

// Jugadores que aparecen como botones rápidos en el Setup.
const PRESET_PLAYERS = ['DC', 'JAVI', 'AG', 'ELI', 'JUAN', 'JUANI', 'IRENE', 'TINA', 'DIEGO J', 'SANTI', 'TRINI'];

/**
 * Función que genera el HTML para el Avatar.
 * Intenta cargar una imagen (assets/players/nombre.png). 
 * Si falla (porque no existe la foto), pone el emoji de reserva.
 */
function getAvatarHTML(name, sizeClass = '') {
    const fallbackEmoji = state.playerAvatars[name] || '👤'; // Si no hay emoji, usa silueta.
    const slug = name.toLowerCase().replace(/\s+/g, ''); // Limpia el nombre (ej: "Diego J" -> "diegoj").
    const imagePath = `assets/players/${slug}.png`; // Ruta de la imagen esperada.

    return `<div class="avatar-box ${sizeClass}">
                <img src="${imagePath}" alt="${name}" onerror="this.outerHTML='<span class=\\'avatar-emoji ${sizeClass}\\'>${fallbackEmoji}</span>'">
            </div>`; 
    // onerror: Si la imagen da error, se borra a sí misma y se cambia por un <span> con el emoji.
}

// Similar a anterior, pero optimizada para la pantalla de Setup (con marcos específicos).
function getSetupAvatarHTML(name) {
    const fallbackEmoji = state.playerAvatars[name] || '🐰';
    const slug = name.toLowerCase().replace(/\s+/g, '');
    const imagePath = `assets/players/${slug}.png`;

    return `
        <div class="avatar-frame">
            <img src="${imagePath}" alt="${name}" onerror="this.outerHTML='<div class=\\'avatar-fallback-container\\'><span class=\\'avatar-fallback-emoji\\'>${fallbackEmoji}</span></div>'">
            <div class="star-dust"></div> <!-- Efecto decorativo de brillo. -->
        </div>
    `;
}

// Crea la versión grande del avatar para la pantalla del Temporizador.
function getHeroAvatarHTML(name) {
    const fallbackEmoji = state.playerAvatars[name] || '👤';
    const slug = name.toLowerCase().replace(/\s+/g, '');
    const imagePath = `assets/players/${slug}.png`;

    return `<div class="hero-avatar">
                <img src="${imagePath}" alt="Avatar de ${name}" onerror="this.outerHTML='<span class=\\'hero-avatar-emoji\\'>${fallbackEmoji}</span>'">
            </div>`;
}

/**
 * Elige qué carta mostrar en el Reveal.
 * Si eres impostor, busca en la carpeta /Impostor/. Si no, en /Inocente/.
 */
function getCardImagePath(name, type = 'Inocente') {
    const filename = name.toLowerCase().replace(/\s+/g, '');
    return type === 'Impostor'
        ? `assets/IMG/Impostor/${filename}_impostor.png`
        : `assets/IMG/Inocente/${filename}.png`;
}

// Objeto UI: Acceso rápido a elementos del HTML para no repetir 'document.getElementById'.
const UI = {
    mainContent: document.getElementById('main-content'),
    dynamicContent: document.getElementById('dynamic-content'),
    btnMenuNew: document.getElementById('btn-menu-new'),
    btnMenuScores: document.getElementById('btn-menu-scores'),
    btnMenuRules: document.getElementById('btn-menu-rules'),
    btnMenuSettings: document.getElementById('btn-menu-settings'),
    setupScreen: document.getElementById('screen-setup'),
    playerNameInput: document.getElementById('player-name'),
    addPlayerBtn: document.getElementById('add-player'),
    playerList: document.getElementById('player-list'),
    startGameBtn: document.getElementById('btn-start-game')
};

// --- GESTIÓN DE AUDIO ---
const audioManager = {
    bgMusic: document.getElementById('bg-music'), // Referencia al <audio> del HTML.
    isMuted: false, // Variable de control de silencio.
    hasStarted: false, // Evita que la música intente sonar dos veces a la vez.
    init() { // Configura el volumen y prepara el inicio.
        if (!this.bgMusic) return;
        this.bgMusic.volume = 0.5; // Ajusta el volumen al 50%.
        
        const triggerPlay = () => { // Función para arrancar la música tras el primer click del usuario.
            if (!this.hasStarted && !this.isMuted) {
                this.bgMusic.play().catch(e => console.warn("Autoplay bloqueado:", e));
                this.hasStarted = true;
                ['click', 'pointerdown', 'keydown'].forEach(evt => document.removeEventListener(evt, triggerPlay));
            }
        };
        ['click', 'pointerdown', 'keydown'].forEach(evt => document.addEventListener(evt, triggerPlay, { once: true }));
    },
    toggleMute() { // Alterna entre sonido y silencio.
        if (!this.bgMusic) return;
        this.isMuted = !this.isMuted;
        this.bgMusic.muted = this.isMuted;
        if (this.isMuted) { this.bgMusic.pause(); } else { this.bgMusic.play(); }
    }
};

// --- NAVEGACIÓN SPA (Single Page Application) ---
// Esta lógica permite cambiar de pantalla sin recargar la página web.
const STATIC_SCREENS = ['screen-main-menu', 'screen-setup']; // Pantallas que ya están en el index.html.
let currentTimerInterval = null; // Guardará el cronómetro para poder pararlo al cambiar de pantalla.
let navigationHistory = [{ id: 'screen-main-menu', data: {} }]; // Permite que el botón "Atrás" funcione.

function navigateTo(screenId, data = {}, recordHistory = true) {
    if (currentTimerInterval) clearInterval(currentTimerInterval); // Limpia cronómetros activos para que no sigan sumando/restando.
    if (panicInterval) clearInterval(panicInterval); // Limpia efectos de pánico.

    if (recordHistory) { // Guarda la pantalla actual en el historial.
        navigationHistory.push({ id: screenId, data: data });
    }

    // Oculta todas las pantallas estáticas.
    STATIC_SCREENS.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
    });

    if (STATIC_SCREENS.includes(screenId) || screenId === 'main-menu') {
        // Si vamos a una pantalla estática (Menu o Setup):
        const targetId = screenId === 'main-menu' ? 'screen-main-menu' : screenId;
        if (UI.dynamicContent) UI.dynamicContent.innerHTML = ''; // Borra el contenido dinámico anterior.
        document.getElementById(targetId).classList.add('active'); // Muestra la pantalla elegida.
        
        if (screenId === 'screen-setup') { // Si entramos al Setup, redibuja los jugadores.
            renderPresetPlayers();
            renderPlayerList();
        }
    } else {
        // Pantalla DINÁMICA: Se "dibuja" desde cero usando JavaScript.
        showScreen(screenId, data);
        if (screenId === 'screen-categories') renderCategories(); // Si son categorías, dibuja los iconos.
    }
}

// --- INICIO DEL JUEGO (LÓGICA) ---

/**
 * Selecciona una categoría y carga las palabras si es la primera vez.
 */
async function selectCategory(catId) {
    state.selectedCategory = catId;
    if (!state.gameData) { // Si no tenemos las palabras aún:
        const response = await fetch('data/words.json'); // Descarga el archivo de palabras.
        state.gameData = await response.json(); // Lo convierte a objeto de JavaScript.
    }
    startRoleAssignment(); // Reparte los papeles.
}

/**
 * Reparto de Roles y Palabra.
 * Elige un impostor y una palabra secreta de la categoría.
 */
function startRoleAssignment() {
    const words = state.gameData[state.selectedCategory]; // Coge la lista de esa categoría.
    let availableWords = words.filter(w => !state.usedWords.includes(w)); // Quita las palabras ya usadas.

    if (availableWords.length === 0) { // Si se acaban todas las palabras:
        state.usedWords = []; // Resetea el historial.
        availableWords = words;
    }

    // Selecciona palabra al azar usando criptografía (más al azar que Math.random).
    const wordIndex = getRandomSecure(availableWords.length);
    state.secretWord = availableWords[wordIndex];
    state.usedWords.push(state.secretWord);

    // Selecciona quién será el impostor.
    let impostorIndex = getRandomSecure(state.players.length);
    let chosenImpostor = state.players[impostorIndex];

    // Anti-racha: Si le tocaba al mismo de antes, repite el sorteo (si hay más de 3 jugadores).
    if (chosenImpostor === state.lastImpostor && state.players.length > 3) {
        impostorIndex = getRandomSecure(state.players.length);
        chosenImpostor = state.players[impostorIndex];
    }

    state.impostorName = chosenImpostor;
    state.lastImpostor = chosenImpostor;

    // Asigna el objeto de rol a cada jugador.
    state.roles = state.players.map(name => ({
        name: name,
        isImpostor: name === state.impostorName,
        word: name === state.impostorName ? "¡ERES EL IMPOSTOR!" : state.secretWord
    }));

    // Navega a la pantalla donde cada uno ve su carta personal.
    navigateTo('screen-reveal', { player: state.players[0], index: 0 });
}

// Función para obtener AZAR puro y seguro (criptográfico).
function getRandomSecure(max) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
}

// --- PUNTUACIÓN (EL MOTOR DEL JUEGO) ---

/**
 * Calcula cuántos puntos gana cada uno según si pillaron al impostor o no.
 */
function handleRoundEnd({ impostorFound, correctVoters = [] }) {
    const innocentCount = state.players.length - 1; // Número de inocentes.
    const numAcertantes = correctVoters.length; // Cuántos señalaron al culpable.

    if (!impostorFound || numAcertantes === 0) {
        // Escenario: El impostor engañó a TODOS.
        state.scores[state.impostorName] += 6; // Gana 6 puntos (máximo).
        state.roundReasons[state.impostorName] = "👻 Invicto (Nadie acierta)";
    } else {
        if (numAcertantes === 1) { 
            // Escenario: Casi todos fallaron, solo 1 acertó.
            state.scores[state.impostorName] += 4; // El impostor gana 4 por haber engañado a casi todos.
            state.scores[correctVoters[0]] += 6; // El único listo gana 6.
        } else if (numAcertantes < innocentCount / 2) {
            // Escenario: Menos de la mitad acertó.
            state.scores[state.impostorName] += 2; // Impostor gana 2.
            correctVoters.forEach(n => state.scores[n] += 4); // Acertantes ganan 4.
        } else if (numAcertantes === innocentCount) {
            // Escenario: Pillado totalmente (UNANIMIDAD).
            state.scores[state.impostorName] -= 1; // El Impostor PIERDE 1 punto.
            correctVoters.forEach(n => state.scores[n] += 2); // Los acertantes ganan el mínimo (2).
        }
    }
}

// --- UTILIDADES ---

/**
 * Previene ataques XSS (Scripts maliciosos).
 * Limpia los nombres de los jugadores antes de ponerlos en el HTML.
 */
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[tag]));
}

// Inicia el juego escuchando cuando el HTML está listo.
document.addEventListener('DOMContentLoaded', () => {
    audioManager.init(); // Enciende el sistema de audio.
    setupEventListeners(); // Activa los clics de los botones.
});
