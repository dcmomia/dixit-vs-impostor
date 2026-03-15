const state = {
    players: [],
    playerAvatars: {}, // {playerName: 'ðŸ°'}
    avatarPool: ['ðŸ°', 'ðŸ¦Š', 'ðŸ»', 'ðŸ¼', 'ðŸ¨', 'ðŸ¯', 'ðŸ¦', 'ðŸ®', 'ðŸ·', 'ðŸ¸', 'ðŸµ', 'ðŸ¦„', 'ðŸ¶', 'ðŸ±', 'ðŸ¹', 'ðŸ­'],
    minPlayers: 3,
    selectedCategory: null,
    gameData: null,
    roles: [], // {playerName, role, word}
    impostorName: null,
    secretWord: null,
    scores: {}, // {playerName: totalScore}
    roundScores: {}, // {playerName: delta}
    roundReasons: {}, // {playerName: emoji+razon}
    lastCorrectVoters: [], // FIX: Inicializado
    usedWords: [], // FIX: Para no repetir palabras
    lastImpostor: null, // FIX: Para prevenir rachas repetitivas
    categories: [
        { id: 'conceptos', name: 'Conceptos', icon: 'ðŸ’¡' },
        { id: 'peliculas', name: 'PelÃ­culas', icon: 'ðŸŽ¬' },
        { id: 'lugares', name: 'Lugares', icon: 'ðŸ“' },
        { id: 'refranes', name: 'Refranes', icon: 'ðŸ—£ï¸' },
        { id: 'acciones', name: 'Acciones', icon: 'ðŸŽ­' }
    ]
};

// Jugadores recurrentes (plantilla predefinida)
const PRESET_PLAYERS = ['DC', 'JAVI', 'AG', 'ELI', 'JUAN', 'JUANI', 'IRENE', 'TINA', 'DIEGO J', 'SANTI', 'TRINI'];

/**
 * Genera el HTML para el avatar de un jugador intentando cargar su imagen si existe.
 * Si la imagen (nombre.png) no se encuentra (404), el atributo onerror la reemplaza dinÃ¡micamente
 * por su emoji de fallback asignado en state.playerAvatars
 */
function getAvatarHTML(name, sizeClass = '') {
    const fallbackEmoji = state.playerAvatars[name] || 'ðŸ‘¤';
    // FIX: Eliminar espacios para coincidir con el sistema de archivos (diego j -> diegoj)
    const slug = name.toLowerCase().replace(/\s+/g, '');
    const imagePath = `assets/players/${slug}.png`;

    return `<div class="avatar-box ${sizeClass}">
                <img src="${imagePath}" alt="${name}" onerror="this.outerHTML='<span class=\\'avatar-emoji ${sizeClass}\\'>${fallbackEmoji}</span>'">
            </div>`;
}

function getSetupAvatarHTML(name) {
    const fallbackEmoji = state.playerAvatars[name] || 'ðŸ°';
    const slug = name.toLowerCase().replace(/\s+/g, '');
    const imagePath = `assets/players/${slug}.png`;

    return `
        <div class="avatar-frame">
            <img src="${imagePath}" alt="${name}" onerror="this.outerHTML='<div class=\\'avatar-fallback-container\\'><span class=\\'avatar-fallback-emoji\\'>${fallbackEmoji}</span></div>'">
            <div class="star-dust"></div>
        </div>
    `;
}

function getHeroAvatarHTML(name) {
    const fallbackEmoji = state.playerAvatars[name] || 'ðŸ‘¤';
    const slug = name.toLowerCase().replace(/\s+/g, '');
    const imagePath = `assets/players/${slug}.png`;

    return `<div class="hero-avatar">
                <img src="${imagePath}" alt="Avatar de ${name}" onerror="this.outerHTML='<span class=\\'hero-avatar-emoji\\'>${fallbackEmoji}</span>'">
            </div>`;
}

/**
 * Deriva la ruta de imagen de carta a partir del nombre del jugador.
 * Convierte "DIEGO J" â†’ "diegoj", "JAVI" â†’ "javi", etc.
 */
function getCardImagePath(name, type = 'Inocente') {
    const filename = name.toLowerCase().replace(/\s+/g, '');
    return type === 'Impostor'
        ? `assets/IMG/Impostor/${filename}_impostor.png`
        : `assets/IMG/Inocente/${filename}.png`;
}

// Selectores
const UI = {
    mainContent: document.getElementById('main-content'),
    dynamicContent: document.getElementById('dynamic-content'),
    // Main Menu
    btnMenuNew: document.getElementById('btn-menu-new'),
    btnMenuScores: document.getElementById('btn-menu-scores'),
    btnMenuRules: document.getElementById('btn-menu-rules'),
    btnMenuSettings: document.getElementById('btn-menu-settings'),
    // Setup Screen
    setupScreen: document.getElementById('screen-setup'),
    playerNameInput: document.getElementById('player-name'),
    addPlayerBtn: document.getElementById('add-player'),
    playerList: document.getElementById('player-list'),
    startGameBtn: document.getElementById('btn-start-game')
};

// â”€â”€ Gestor MÃ¡gico de Audio â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const audioManager = {
    bgMusic: document.getElementById('bg-music'),
    isMuted: false,
    hasStarted: false,
    init() {
        if (!this.bgMusic) return;
        this.bgMusic.volume = 0.5; // Volumen inmersivo
        
        // El navegador requiere interacciÃ³n humana para reproducir audio
        const triggerPlay = () => {
            if (!this.hasStarted && !this.isMuted) {
                this.bgMusic.play().catch(e => console.warn("Autoaplay prevenido por el usuario:", e));
                this.hasStarted = true;
                // Limpiamos los listeners para no sobrecargar
                ['click', 'pointerdown', 'keydown'].forEach(evt => document.removeEventListener(evt, triggerPlay));
            }
        };
        ['click', 'pointerdown', 'keydown'].forEach(evt => document.addEventListener(evt, triggerPlay, { once: true }));
    },
    toggleMute() {
        if (!this.bgMusic) return;
        this.isMuted = !this.isMuted;
        this.bgMusic.muted = this.isMuted;
        if (this.isMuted) {
            this.bgMusic.pause();
        } else {
            this.bgMusic.play().catch(e => console.warn("Autoaplay prevenido:", e));
            this.hasStarted = true;
        }
    }
};

// â”€â”€ NavegaciÃ³n principal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Pantallas ESTÃTICAS (existen en el HTML como <section>)
const STATIC_SCREENS = ['screen-main-menu', 'screen-setup'];
let currentTimerInterval = null;
let navigationHistory = [{ id: 'screen-main-menu', data: {} }]; // Rastreo para botÃ³n atrÃ¡s
let isStartingRound = false;
let panicInterval = null;

function goBack() {
    if (navigationHistory.length > 1) {
        navigationHistory.pop(); // Sacar la actual
        const previousScreen = navigationHistory[navigationHistory.length - 1]; // Obtener la anterior
        navigateTo(previousScreen.id, previousScreen.data || {}, false); // Navegar sin registrar de nuevo
    } else {
        navigateTo('main-menu', {}, false);
    }
}

function updateGlobalNav(screenId) {
    const globalNav = document.getElementById('global-nav');
    if (globalNav) {
        globalNav.style.display = (screenId === 'screen-main-menu' || screenId === 'main-menu') ? 'none' : 'flex';
    }
}

function navigateTo(screenId, data = {}, recordHistory = true) {
    if (currentTimerInterval) clearInterval(currentTimerInterval);
    if (panicInterval) clearInterval(panicInterval);

    // Registrar historia si no es un "goBack"
    if (recordHistory) {
        const last = navigationHistory[navigationHistory.length - 1];
        if (!last || last.id !== screenId || JSON.stringify(last.data) !== JSON.stringify(data)) {
            navigationHistory.push({ id: screenId, data: data });
        }
    }

    // Visibilidad de controles de navegaciÃ³n globales
    updateGlobalNav(screenId);

    // Si la pantalla objetivo es estÃ¡tica, mostrar/ocultar secciones
    if (STATIC_SCREENS.includes(screenId) || screenId === 'main-menu') {
        const targetId = screenId === 'main-menu' ? 'screen-main-menu' : screenId;
        // Ocultar menÃº y setup
        STATIC_SCREENS.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove('active');
        });

        // Limpiar contenido dinÃ¡mico
        if (UI.dynamicContent) UI.dynamicContent.innerHTML = '';

        const target = document.getElementById(targetId);
        if (target) target.classList.add('active');

        // Restaurar secciÃ³n setup en main-content si fue reemplazada
        if (screenId === 'screen-setup') {
            renderPresetPlayers();
            renderPlayerList();
            // Sync start button state
            const startBtn = document.getElementById('btn-start-game');
            if (startBtn) {
                startBtn.disabled = state.players.length < state.minPlayers;
                startBtn.classList.add('btn-flash-effect');
                // Usamos onclick para asegurar un solo listener y evitar el clonado de nodos
                if (!startBtn.onclick) {
                    startBtn.onclick = () => {
                        if (!startBtn.disabled) {
                            startBtn.classList.add('flash-active');
                            setTimeout(() => {
                                startBtn.classList.remove('flash-active');
                                navigateTo('screen-categories');
                            }, 600);
                        }
                    };
                }
            }
            // Focus automÃ¡tico ELIMINADO para evitar que salte el teclado virtual en mÃ³viles
            // y tape la interfaz. El usuario deberÃ¡ tocar explÃ­citamente el campo de texto.
        }
    } else {
        // Pantalla DINÃMICA: ocultar estÃ¡ticas y cargar contenido en main-content
        STATIC_SCREENS.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove('active');
        });
        showScreen(screenId, data);
        // Post-init callbacks
        if (screenId === 'screen-categories') renderCategories();
    }
}
// â”€â”€ InicializaciÃ³n â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
document.addEventListener('DOMContentLoaded', () => {
    audioManager.init(); // Inicializar motor de audio
    setupEventListeners();
    requestWakeLock(); // Activar bloqueo de suspensiÃ³n

    // Skill pwa-offline-setup: Reconectar WakeLock si minimizan la app
    document.addEventListener('visibilitychange', async () => {
        if (document.visibilityState === 'visible') {
            await requestWakeLock();
        }
    });
});

// Skill dixit-magical-ui: Mantener pantalla encendida
let wakeLock = null;
async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('âœ¨ Pantalla bloqueada para el sueÃ±o mÃ­stico...');
        }
    } catch (err) {
        console.warn('No se pudo activar el Wake Lock:', err);
    }
}

function setupEventListeners() {
    // Auxiliar para Efecto Ripple (Gota de Agua)
    function createLiquidRipple(event, button) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-liquid');
        button.appendChild(ripple);

        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;

        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        setTimeout(() => ripple.remove(), 800);
    }

    // MenÃº Principal
    UI.btnMenuNew.addEventListener('click', (e) => {
        createLiquidRipple(e, UI.btnMenuNew);
        
        // Generar semillas de diente de leÃ³n
        const container = document.createElement('div');
        container.className = 'dandelion-container';
        document.body.appendChild(container);

        const rect = UI.btnMenuNew.getBoundingClientRect();
        // Ajuste: El centro del botÃ³n SVG para que las semillas salgan del nÃºcleo
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;

        for (let i = 1; i <= 4; i++) {
            const seed = document.createElement('div');
            seed.className = 'dandelion-seed';
            seed.style.left = `${startX}px`;
            seed.style.top = `${startY}px`;
            seed.style.animation = `seed-fly-${i} 1s cubic-bezier(0.25, 0.1, 0.25, 1) forwards`;
            container.appendChild(seed);
        }

        // Retrasar navegaciÃ³n para el efecto visual
        setTimeout(() => {
            navigateTo('screen-setup');
            setTimeout(() => {
                container.remove();
            }, 500);
        }, 600);
    });


    UI.btnMenuRules.addEventListener('click', () => {
        const rules = "ðŸŽ® CÃ“MO JUGAR\n\n1. El GM asigna en secreto una palabra a cada jugador.\n2. El IMPOSTOR recibe una palabra diferente o nada.\n3. Jugad cartas de Dixit sin revelar la palabra.\n4. Votad: Â¿quiÃ©n es el Impostor?\n5. Si el Impostor no es descubierto â†’ gana. Si es descubierto, puede salvar puntos adivinando la palabra secreta.";
        showConfirm(rules, () => { });
        document.getElementById('modal-btn-cancel').classList.add('hidden');
    });

    UI.btnMenuSettings.addEventListener('click', () => {
        const estado = audioManager.isMuted ? "REACTIVAR" : "SILENCIAR";
        const icon = audioManager.isMuted ? "ðŸ”Š" : "ðŸ”‡";
        
        showConfirm(`âš™ï¸ AJUSTES DE AUDIO\n\nÂ¿Deseas ${estado} ${icon} la melodÃ­a "Clockwork Garden Carnival"?`, () => {
            audioManager.toggleMute();
        });
        
        // Asegurarnos de que el botÃ³n cancelar aparezca (puede estar oculto de otros modales)
        document.getElementById('modal-btn-cancel').classList.remove('hidden');
    });

    // Setup
    UI.addPlayerBtn.addEventListener('click', (e) => addPlayer(e));
    UI.playerNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addPlayer(e);
    });
    // btn-start-game listener extraÃ­do para evitar dual-fire con navigateTo()
}

function showScreen(screenId, data = {}) {
    // Renderizado dinÃ¡mico de pantallas
    if (screenId === 'screen-categories') {
        UI.dynamicContent.innerHTML = `
            <section id="screen-categories" class="screen active">
                <header>
                    <h2 class="glow-text small">CategorÃ­as</h2>
                    <p class="subtitle">Selecciona la temÃ¡tica</p>
                </header>
                
                <div class="category-grid" id="category-grid">
                    <!-- CategorÃ­as inyectadas -->
                </div>
                
                <div id="category-error" class="error-toast hidden"></div>
                
                <button id="btn-random-category" aria-label="Sorteo del Destino"></button>
            </section>
        `;
        document.getElementById('btn-random-category').addEventListener('click', pickRandomCategory);
    } else if (screenId === 'screen-reveal') {
        const player = data.player;
        const playerRole = state.roles[data.index];
        const isImpostor = playerRole.isImpostor;
        const frontImgPath = getCardImagePath(player, 'Inocente');
        // Para inocentes, usamos la imagen de inocente en el reverso con la palabra encima
        const backImgPath = isImpostor ? getCardImagePath(player, 'Impostor') : frontImgPath;
        const fallbackEmoji = state.playerAvatars[player] || 'ðŸ‘¤';

        UI.dynamicContent.innerHTML = `
            <section id="screen-reveal" class="screen active reveal-screen">

                <div class="reveal-header">
                    <h2 class="reveal-player-name">${escapeHTML(player)}</h2>
                </div>

                <!-- Escena 3D de la carta -->
                <div class="reveal-card-scene">
                    <div class="reveal-card" id="reveal-card">

                        <!-- CARA FRONTAL: imagen inicial -->
                        <div class="reveal-card__face reveal-card__front">
                            <img
                                src="${frontImgPath}"
                                alt="Carta de ${escapeHTML(player)}"
                                class="card-img"
                                id="card-front-img"
                                onerror="this.style.display='none'; document.getElementById('card-front-fallback').style.display='flex';"
                            >
                            <div class="card-fallback" id="card-front-fallback" style="display:none">
                                <span class="card-fallback-emoji">${fallbackEmoji}</span>
                            </div>
                            <!-- Marco Inocente (siempre en la cara inicial) -->
                            <div class="card-frame card-frame--inocente"></div>
                        </div>

                        <!-- CARA TRASERA: RevelaciÃ³n (tras el flip 3D) -->
                        <div class="reveal-card__face reveal-card__back">
                            <img
                                src="${backImgPath}"
                                alt="Reverso"
                                class="card-img"
                                onerror="this.style.display='none';"
                            >
                            ${isImpostor ? '' : `
                                <div class="reveal-word-overlay">
                                    <span class="reveal-word-text">${escapeHTML(playerRole.word)}</span>
                                </div>
                            `}
                            <!-- Marco Trasero (depende del rol) -->
                            <div class="card-frame ${isImpostor ? 'card-frame--impostor' : 'card-frame--inocente'}"></div>
                        </div>

                    </div>
                </div>

                </div>
                
                <!-- Botones onÃ­ricos -->
                <div class="reveal-actions">
                    <div class="reveal-btn-container">
                        <button id="btn-reveal" class="btn-dreamy btn-dreamy--hold btn-hold-dimmed" aria-label="MantÃ©n pulsado"></button>
                    </div>
                    <button id="btn-next-player" class="btn-dreamy btn-dreamy--ready btn-locked" aria-label="Listo"></button>
                </div>

            </section>
        `;
        setupRevealLogic(player, data.index);
    } else if (screenId === 'screen-timer') {
        showTimerScreen();
    } else if (screenId === 'screen-panic') {
        showRevealPanicScreen();
    } else if (screenId === 'screen-voting') {
        showVotingScreen();
    } else if (screenId === 'screen-score') {
        showScoreScreen();
    }
}

function renderCategories() {
    const grid = document.getElementById('category-grid');
    if (!grid) return;
    grid.innerHTML = '';

    state.categories.forEach(cat => {
        const card = document.createElement('div');
        card.className = 'category-card';
        // Usamos setAttribute para el style para mayor seguridad
        card.style.backgroundImage = `url('assets/IMG/UI/categories/cat_${cat.id}.png')`;
        card.setAttribute('aria-label', cat.name);
        card.onclick = () => selectCategory(cat.id);
        grid.appendChild(card);
    });
}

async function selectCategory(catId) {
    if (isStartingRound) return;
    isStartingRound = true;

    state.selectedCategory = catId;
    const errorToast = document.getElementById('category-error');

    // Cargar palabras si no estÃ¡n cargadas
    if (!state.gameData) {
        try {
            const response = await fetch('data/words.json');
            if (!response.ok) throw new Error("No se pudo cargar la base de datos.");
            state.gameData = await response.json();
            if (errorToast) errorToast.classList.add('hidden');
        } catch (e) {
            console.error("Error cargando palabras:", e);
            if (errorToast) {
                errorToast.textContent = "Error: Verifica que words.json existe en /data. Usa un servidor local (Live Server).";
                errorToast.classList.remove('hidden');
            }
            isStartingRound = false;
            return;
        }
    }

    startRoleAssignment();
    isStartingRound = false;
}

function startRoleAssignment() {
    const errorToast = document.getElementById('category-error');
    if (errorToast) errorToast.classList.add('hidden');

    const words = state.gameData[state.selectedCategory];

    // Filtrar palabras ya usadas
    let availableWords = words.filter(w => !state.usedWords.includes(w));

    // Si se agotan, resetear la lista (o avisar)
    if (availableWords.length === 0) {
        if (errorToast) {
            errorToast.textContent = "Â¡Se han agotado las palabras de esta categorÃ­a! Reseteando base de datos interna...";
            errorToast.classList.remove('hidden');
        }
        state.usedWords = [];
        availableWords = words;
    }

    // SelecciÃ³n segura criptogrÃ¡fica para la palabra
    const wordIndex = getRandomSecure(availableWords.length);
    state.secretWord = availableWords[wordIndex];
    state.usedWords.push(state.secretWord);

    // SelecciÃ³n segura criptogrÃ¡fica para el impostor con sistema anti-racha mitigada
    let impostorIndex = getRandomSecure(state.players.length);
    let chosenImpostor = state.players[impostorIndex];

    // Si toca el mismo de la ronda anterior, volvemos a tirar los dados una vez 
    // (reduce brutalmente la repeticiÃ³n seguida pero no la hace "imposible")
    if (chosenImpostor === state.lastImpostor && state.players.length > 3) {
        impostorIndex = getRandomSecure(state.players.length);
        chosenImpostor = state.players[impostorIndex];
    }

    state.impostorName = chosenImpostor;
    state.lastImpostor = state.impostorName;

    state.roles = state.players.map((name) => ({
        name,
        isImpostor: name === state.impostorName,
        word: name === state.impostorName ? "Â¡ERES EL IMPOSTOR!" : state.secretWord
    }));

    navigateTo('screen-reveal', { player: state.players[0], index: 0 });
}

// Generador CriptogrÃ¡fico de NÃºmeros Aleatorios
function getRandomSecure(max) {
    if (window.crypto && window.crypto.getRandomValues) {
        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        return array[0] % max;
    }
    // Fallback por si acaso
    return Math.floor(Math.random() * max);
}

function setupRevealLogic(playerName, index) {
    const btnHold = document.getElementById('btn-reveal');
    const btnNext = document.getElementById('btn-next-player');
    const card = document.getElementById('reveal-card');
    const playerRole = state.roles[index];

    let hasRevealed = false;

    // â”€â”€ Revelar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const reveal = () => {
        // Ahora TODOS giran la carta en 3D para ver el reverso
        card.classList.add('is-flipped');

        // MECÃ NICA NUEVA: Si es impostor, cambiamos el fondo de la pantalla a bg_tension_dark (oscuro)
        if (playerRole.isImpostor) {
            const screen = document.getElementById('screen-reveal');
            if (screen) screen.classList.add('impostor-reveal-active');
        }
    };

    // â”€â”€ Ocultar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const hide = () => {
        card.classList.remove('is-flipped');

        // Quitar el fondo especial al soltar
        if (playerRole.isImpostor) {
            const screen = document.getElementById('screen-reveal');
            if (screen) screen.classList.remove('impostor-reveal-active');
        }

        if (!hasRevealed) {
            hasRevealed = true;
            btnNext.classList.remove('btn-locked');
        }
    };

    // â”€â”€ Pointer Events (mobile safe) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    btnHold.onpointerdown = (e) => {
        if (e.cancelable) e.preventDefault();
        reveal();
    };
    btnHold.onpointerup = btnHold.onpointercancel = btnHold.onpointerleave = (e) => {
        if (e.cancelable) e.preventDefault();
        hide();
    };

    // â”€â”€ Avanzar al siguiente jugador â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    btnNext.onclick = () => {
        const nextIndex = index + 1;
        if (nextIndex < state.players.length) {
            navigateTo('screen-reveal', { player: state.players[nextIndex], index: nextIndex });
        } else {
            navigateTo('screen-timer');
        }
    };
}

function showTimerScreen() {
    // Elegir aleatoriamente quiÃ©n empieza a hablar (cualquier jugador, incl. el impostor)
    const startIndex = getRandomSecure(state.players.length);
    const startPlayer = state.players[startIndex];

    // Estado del temporizador (90 segundos por defecto)
    let timeLeft = 90;

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    /**
     * Obtiene la ruta de la imagen 'Empieza el turno' para un jugador.
     */
    const getStarterImagePath = (name) => {
        const slug = name.toLowerCase().replace(/\s+/g, ''); // DC -> dc, DIEGO J -> diegoj
        // Ruta limpia sin espacios para evitar problemas de carga
        return `assets/IMG/Empieza_Turno/${slug}_start.png`;
    };

    const starterImage = getStarterImagePath(startPlayer);

    UI.dynamicContent.innerHTML = `
        <section id="screen-timer" class="screen active">
            <header>
                <h2 class="glow-text small">Empieza el turno</h2>
            </header>
            
            <div class="starter-hero-panel">
                <img src="${starterImage}" alt="Empieza el turno: ${startPlayer}" class="starter-full-image">
            </div>
            
            <div class="timer-widget">
                <div class="countdown-orb">
                    <div id="countdown-display" class="timer-display">${formatTime(timeLeft)}</div>
                </div>
                
                <!-- Botones Laterales (-/+ 15s) -->
                <button id="btn-time-sub" class="btn-preset btn-preset--side btn-preset--left">-15s</button>
                <button id="btn-time-add" class="btn-preset btn-preset--side btn-preset--right">+15s</button>
            </div>

            <!-- Columna Derecha (Presets Rápidos) -->
            <div class="right-presets-column">
                <button class="btn-preset btn-preset--column" data-time="60">1:00</button>
                <button class="btn-preset btn-preset--column" data-time="90">1:30</button>
                <button class="btn-preset btn-preset--column" data-time="120">2:00</button>
            </div>
            
            <div class="bottom-action-container">
                <button id="btn-all-ready" class="btn-parchment-action" aria-label="Â¡Cartas en la mesa!"></button>
            </div>
        </section>
    `;

    const display = document.getElementById('countdown-display');

    const updateDisplay = () => {
        if (timeLeft < 0) timeLeft = 0;
        display.textContent = formatTime(timeLeft);
        if (timeLeft <= 10 && timeLeft > 0) {
            display.style.color = "var(--accent)";
            display.style.transform = "scale(1.1)";
            setTimeout(() => display.style.transform = "scale(1)", 200);
        } else if (timeLeft === 0) {
            display.style.color = "var(--primary)";
        } else {
            display.style.color = "var(--text)";
        }
    };

    if (currentTimerInterval) clearInterval(currentTimerInterval);
    currentTimerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        }
    }, 1000);

    // Set listeners
    document.getElementById('btn-time-add').onclick = () => { timeLeft += 15; updateDisplay(); };
    document.getElementById('btn-time-sub').onclick = () => { timeLeft -= 15; updateDisplay(); };

    document.querySelectorAll('.time-presets .btn-preset').forEach(btn => {
        btn.onclick = (e) => {
            const time = parseInt(e.target.dataset.time, 10);
            if (!isNaN(time)) {
                timeLeft = time;
                updateDisplay();
            }
        };
    });

    document.getElementById('btn-all-ready').onclick = () => {
        if (currentTimerInterval) clearInterval(currentTimerInterval);
        navigateTo('screen-panic');
    };
}

function showRevealPanicScreen() {
    UI.dynamicContent.innerHTML = `
        <section id="screen-panic" class="screen active" style="display: flex; flex-direction: column; justify-content: center; height: 100%;">
            
            <!-- FASE 1: ESPERA (Piedra rÃºnica con luz giratoria) -->
            <div id="panic-phase-1" style="height: 100%; display: flex; align-items: center; justify-content: center; position: relative; overflow: visible;">
                <div class="panic-light-wrap">
                    <div class="btn-dreamy--panic pulse-card" style="position: relative; z-index: 1;"></div>
                    <img src="assets/IMG/UI/tension/btn_luz_reveal.png" class="panic-magic-light" alt="Luz mÃ¡gica">
                </div>
            </div>

            <!-- FASE 2 y 3: PANICO Y DEBATE -->
            <div id="panic-phase-2" class="hidden" style="text-align: center; display: flex; flex-direction: column; height: 100%; justify-content: flex-start; padding: 2vh 0; box-sizing: border-box;">
                
                <!-- Contenedor Superior (Palabra pegada arriba) -->
                <div style="flex: 0; display: flex; flex-direction: column; justify-content: flex-start; padding-top: 5vh; gap: 2vh;">
                    <h2 class="shamanic-glyph">${escapeHTML(state.secretWord)}</h2>
                </div>
                
                <!-- Contenedor Central (Cuenta atrÃ¡s O BotÃ³n Votar) -->
                <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%;">
                    <div id="panic-countdown" class="panic-number" style="margin: 0;">
                        <img src="assets/IMG/UI/tension/cuenta_atras/5.png" alt="5">
                    </div>
                    <div id="panic-debate-ui" class="hidden" style="display: flex; align-items: center; justify-content: center; width: 100%;">
                        <button id="btn-to-vote" class="btn-votar-action"></button>
                    </div>
                </div>
            </div>
            
        </section>
    `;

    document.getElementById('panic-phase-1').onclick = () => {
        document.getElementById('screen-panic').classList.add('revealed');
        document.getElementById('panic-phase-1').classList.add('hidden');
        document.getElementById('panic-phase-2').classList.remove('hidden');

        const countdownEl = document.getElementById('panic-countdown');
        let panicTime = 5;

        countdownEl.classList.add('heartbeat'); // anim inicial

        if (panicInterval) clearInterval(panicInterval);
        panicInterval = setInterval(() => {
            panicTime--;
            if (panicTime > 0) {
                countdownEl.innerHTML = `<img src="assets/IMG/UI/tension/cuenta_atras/${panicTime}.png" alt="${panicTime}">`;
                void countdownEl.offsetWidth;
            } else {
                clearInterval(panicInterval);
                countdownEl.classList.add('hidden');
                document.getElementById('panic-debate-ui').classList.remove('hidden');
                // Cambio de fondo: ahora es la fase de votaciÃ³n
                document.getElementById('screen-panic').classList.add('voting-mode');
            }
        }, 1000);
    };

    document.getElementById('btn-to-vote').onclick = () => {
        navigateTo('screen-voting');
    };
}

function showVotingScreen() {
    // Lista de jugadores que no son el impostor
    const voters = state.players.filter(p => p !== state.impostorName);

    UI.dynamicContent.innerHTML = `
        <section id="screen-voting" class="screen active">
            <header>
                <h2 class="glow-text small">VotaciÃ³n</h2>
                <p class="subtitle">Â¿QuiÃ©nes acertaron al impostor?</p>
            </header>
            
            <div class="voting-list">
                ${voters.map(name => `
                    <div class="voting-row" role="checkbox" aria-checked="false" tabindex="0" data-name="${escapeHTML(name)}">
                        <div class="player-info">
                            ${getAvatarHTML(name)}
                            <span class="player-name">${escapeHTML(name)}</span>
                        </div>
                        <div class="vote-indicator">
                            <span class="magic-spark">âœ¨</span>
                        </div>
                        <input type="checkbox" class="vote-check-hidden" data-name="${escapeHTML(name)}">
                    </div>
                `).join('')}
            </div>
            
            <button id="btn-confirm-votes" class="btn-primary">Confirmar Votos</button>
        </section>
    `;

    // LÃ³gica de interacciÃ³n para las filas
    const rows = document.querySelectorAll('.voting-row');
    rows.forEach(row => {
        const toggle = () => {
            const isVoted = row.classList.toggle('is-voted');
            row.setAttribute('aria-checked', isVoted);
            const checkbox = row.querySelector('.vote-check-hidden');
            if (checkbox) checkbox.checked = isVoted;
        };

        row.onclick = toggle;
        row.onkeydown = (e) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                toggle();
            }
        };
    });

    document.getElementById('btn-confirm-votes').onclick = () => {
        const checks = document.querySelectorAll('.vote-check-hidden');
        const correctVoters = [];
        checks.forEach(c => {
            if (c.checked) correctVoters.push(c.dataset.name);
        });

        state.lastCorrectVoters = correctVoters;

        // El impostor no tiene salvaciÃ³n en las nuevas reglas, directos a la asignaciÃ³n de puntos
        handleRoundEnd({
            impostorFound: true,
            correctVoters: state.lastCorrectVoters
        });
        navigateTo('screen-score');
    };
}

// Fase de salvaciÃ³n eliminada

function handleRoundEnd({ impostorFound, correctVoters = [] }) {
    // Inicializar scores y limpiar deltas de ronda anterior
    state.roundScores = {};
    state.roundReasons = {};

    state.players.forEach(p => {
        if (!state.scores[p]) state.scores[p] = 0;
        state.roundScores[p] = 0;
        state.roundReasons[p] = "";
    });

    const totalPlayers = state.players.length;
    const innocentCount = totalPlayers - 1; // Todos menos el impostor
    const numAcertantes = correctVoters.length;

    if (!impostorFound || numAcertantes === 0) {
        // Nadie acierta (Impostor invicto)
        state.scores[state.impostorName] += 6;
        state.roundScores[state.impostorName] = 6;
        state.roundReasons[state.impostorName] = "ðŸ‘» Invicto (Nadie acierta)";
    } else {
        if (numAcertantes === 1) {
            // Solo 1 acierta: Impostor +4, Acertante +6
            state.scores[state.impostorName] += 4;
            state.roundScores[state.impostorName] = 4;
            state.roundReasons[state.impostorName] = "ðŸ¤¡ Descubierto por 1";

            state.scores[correctVoters[0]] += 6;
            state.roundScores[correctVoters[0]] = 6;
            state.roundReasons[correctVoters[0]] = "ðŸŽ¯ Ãšnico Acertante";
        } else if (numAcertantes < innocentCount / 2) {
            // MinorÃ­a acierta: Impostor +2, Acertantes +4
            state.scores[state.impostorName] += 2;
            state.roundScores[state.impostorName] = 2;
            state.roundReasons[state.impostorName] = "ðŸ¤¡ Descubierto por minorÃ­a";

            correctVoters.forEach(name => {
                state.scores[name] += 4;
                state.roundScores[name] = 4;
                state.roundReasons[name] = "âœ”ï¸ Acierto (MinorÃ­a)";
            });
        } else if (numAcertantes === innocentCount / 2) {
            // Empate (50%): Impostor +1, Acertantes +3
            state.scores[state.impostorName] += 1;
            state.roundScores[state.impostorName] = 1;
            state.roundReasons[state.impostorName] = "âš–ï¸ Descubierto por la mitad";

            correctVoters.forEach(name => {
                state.scores[name] += 3;
                state.roundScores[name] = 3;
                state.roundReasons[name] = "âœ”ï¸ Acierto (Empate)";
            });
        } else if (numAcertantes > innocentCount / 2 && numAcertantes < innocentCount) {
            // MayorÃ­a acierta: Impostor 0, Acertantes +2
            state.scores[state.impostorName] += 0;
            state.roundScores[state.impostorName] = 0;
            state.roundReasons[state.impostorName] = "ðŸš¨ Descubierto por mayorÃ­a";

            correctVoters.forEach(name => {
                state.scores[name] += 2;
                state.roundScores[name] = 2;
                state.roundReasons[name] = "âœ”ï¸ Acierto (MayorÃ­a)";
            });
        } else if (numAcertantes === innocentCount) {
            // Todos aciertan: Impostor -1, Acertantes +2
            state.scores[state.impostorName] -= 1;
            state.roundScores[state.impostorName] = -1;
            state.roundReasons[state.impostorName] = "ðŸ’€ Pillado por TODOS";

            correctVoters.forEach(name => {
                state.scores[name] += 2;
                state.roundScores[name] = 2;
                state.roundReasons[name] = "âœ”ï¸ Acierto UnÃ¡nime";
            });
        }
    }
}

function showScoreScreen() {
    // Ordenar por puntuaciÃ³n descendente
    const sortedPlayers = [...state.players].sort((a, b) => (state.scores[b] || 0) - (state.scores[a] || 0));

    // FIX: AÃ±adido id="screen-score" y clase score-screen con botones de sumar y restar
    UI.dynamicContent.innerHTML = `
        <section id="screen-score" class="screen score-screen active">
            <h2>Marcadores ðŸ†</h2>
            <div class="score-list glass-card">
                ${sortedPlayers.map((name, index) => {
        const delta = state.roundScores[name] || 0;
        const reason = state.roundReasons[name] || "";
        const deltaHTML = delta > 0 ? `<div class="round-delta"><span class="delta-pts">+${delta}</span> <span class="delta-reason">${reason}</span></div>` : (reason ? `<div class="round-delta"><span class="delta-pts muted">+0</span> <span class="delta-reason muted">${reason}</span></div>` : '');
        const slugId = name.toLowerCase().replace(/\s+/g, '-');

        return `
                    <div class="score-item ${index === 0 && state.scores[name] > 0 ? 'winner' : ''}">
                        <span class="rank">${index + 1}</span>
                        <div class="name">
                            <div style="display:flex; align-items:center; gap:8px;">
                                ${getAvatarHTML(name)}
                                <span>${escapeHTML(name)}</span>
                            </div>
                            ${deltaHTML}
                        </div>
                        <div class="score-edit-group">
                            <button class="btn-score-mod" data-action="minus" data-player="${escapeHTML(name)}">-</button>
                            <span class="score-display" id="score-val-${slugId}">${state.scores[name] || 0}</span>
                            <button class="btn-score-mod" data-action="plus" data-player="${escapeHTML(name)}">+</button>
                        </div>
                    </div>
                `}).join('')}
            </div>
            <div class="score-actions">
                <button id="btn-next-round" class="btn-primary">Nueva Ronda ðŸ”„</button>
                <button id="btn-reset-scores" class="btn-secondary">Resetear Marcadores âš ï¸</button>
                <button id="btn-exit-game" class="btn-danger">Salir al Inicio ðŸšª</button>
            </div>
        </section>
    `;

    // Listeners para botones de puntuaciÃ³n
    document.querySelectorAll('.btn-score-mod').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const player = e.target.dataset.player;
            const action = e.target.dataset.action;
            const playerSlug = player.toLowerCase().replace(/\s+/g, '-');
            let currentScore = state.scores[player] || 0;

            if (action === 'plus') currentScore++;
            else if (action === 'minus') currentScore--;

            state.scores[player] = currentScore;
            document.getElementById('score-val-' + playerSlug).textContent = currentScore;

            // Re-render opcional completo para reordenar
            // showScoreScreen();
        });
    });

    document.getElementById('btn-next-round').onclick = () => {
        navigateTo('screen-categories');
    };

    document.getElementById('btn-reset-scores').onclick = () => {
        showConfirm("Â¿Seguro que quieres resetear todos los puntos?", () => {
            state.players.forEach(p => state.scores[p] = 0);
            showScoreScreen();
        });
    };

    document.getElementById('btn-exit-game').onclick = () => {
        showConfirm("Â¿Volver al menÃº principal? Se perderÃ¡ el progreso de esta ronda.", () => {
            // Limpiamos el contenido dinÃ¡mico 
            UI.dynamicContent.innerHTML = '';
            // Reset state partial
            state.gameData = null;
            state.scores = {};
            state.players = [];
            state.playerAvatars = {};
            state.avatarPool = ['ðŸ°', 'ðŸ¦Š', 'ðŸ»', 'ðŸ¼', 'ðŸ¨', 'ðŸ¯', 'ðŸ¦', 'ðŸ®', 'ðŸ·', 'ðŸ¸', 'ðŸµ', 'ðŸ¦„', 'ðŸ¶', 'ðŸ±', 'ðŸ¹', 'ðŸ­'];

            // Reactivate setup screen to be sure
            navigateTo('screen-main-menu');
        });
    };
}

function showConfirm(message, onConfirm) {
    const modal = document.getElementById('modal-container');
    const msg = document.getElementById('modal-message');
    const btnConfirm = document.getElementById('modal-btn-confirm');
    const btnCancel = document.getElementById('modal-btn-cancel');

    // Restaurar el botÃ³n cancelar por si fue ocultado
    btnCancel.classList.remove('hidden');

    msg.innerText = message; // innerText respeta \n
    modal.classList.remove('hidden');

    btnConfirm.onclick = () => {
        modal.classList.add('hidden');
        onConfirm();
    };

    btnCancel.onclick = () => {
        modal.classList.add('hidden');
    };
}

function pickRandomCategory() {
    const random = state.categories[Math.floor(Math.random() * state.categories.length)];
    selectCategory(random.id);
}

function addPlayer(e) {
    const name = UI.playerNameInput.value.trim();
    if (name && !state.players.includes(name)) {
        state.players.push(name);

        // Asignar emoji aleatorio Ãºnico (sin repetir) como fallback
        let fallbackEmoji = 'ðŸ‘¤';
        if (state.avatarPool.length > 0) {
            const poolIndex = Math.floor(Math.random() * state.avatarPool.length);
            fallbackEmoji = state.avatarPool.splice(poolIndex, 1)[0];
        }
        state.playerAvatars[name] = fallbackEmoji;

        createStarDust(e); // El evento e vendrÃ¡ del listener
        UI.playerNameInput.value = '';
        renderPlayerList();
        checkMinPlayers();
    }
}

function createStarDust(e) {
    // Reutilizar la logica que limite las particulas al app-container para no desbordar body
    const container = document.getElementById('app-container') || document.body;
    let containerRect = { left: 0, top: 0 };
    if(container.id === 'app-container') {
        containerRect = container.getBoundingClientRect();
    }
    
    const x = e.clientX || e.pageX;
    const y = e.clientY || e.pageY;
    
    const localX = x - containerRect.left;
    const localY = y - containerRect.top;

    for (let i = 0; i < 12; i++) {
        const star = document.createElement('div');
        star.className = 'star-dust';
        star.innerHTML = 'âœ¨';
        star.style.left = `${localX}px`;
        star.style.top = `${localY}px`;

        const angle = Math.random() * Math.PI * 2;
        const velocity = 2 + Math.random() * 5;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        container.appendChild(star);

        let posX = x;
        let posY = y;
        let opacity = 1;

        const anim = setInterval(() => {
            posX += vx;
            posY += vy;
            opacity -= 0.05;
            star.style.left = `${posX}px`;
            star.style.top = `${posY}px`;
            star.style.opacity = opacity;
            star.style.transform = `scale(${opacity})`;

            if (opacity <= 0) {
                clearInterval(anim);
                star.remove();
            }
        }, 16);
    }
}

function removePlayer(name) {
    state.players = state.players.filter(p => p !== name);

    // Liberar el avatar para que otros puedan usarlo
    const releasedAvatar = state.playerAvatars[name];
    if (releasedAvatar && releasedAvatar !== 'ðŸ‘¤') {
        state.avatarPool.push(releasedAvatar);
    }
    delete state.playerAvatars[name];

    renderPlayerList();
    renderPresetPlayers();
    checkMinPlayers();
}

function renderPresetPlayers() {
    const grid = document.getElementById('preset-players-grid');
    if (!grid) return;
    grid.innerHTML = '';

    PRESET_PLAYERS.forEach(name => {
        const isActive = state.players.includes(name);
        const chip = document.createElement('button');
        chip.className = 'preset-totem' + (isActive ? ' active' : '');
        chip.innerHTML = `<span class="totem-text">${name}</span>`;
        chip.setAttribute('role', 'button');
        chip.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        chip.title = isActive ? 'Quitar de la partida' : 'AÃ±adir a la partida';
        chip.setAttribute('data-name', name);

        chip.addEventListener('click', (e) => {
            if (state.players.includes(name)) {
                removePlayer(name);
            } else {
                createStardust(e.clientX, e.clientY);
                state.players.push(name);
                let fallbackEmoji = 'ðŸ‘¤';
                if (state.avatarPool.length > 0) {
                    const poolIndex = Math.floor(Math.random() * state.avatarPool.length);
                    fallbackEmoji = state.avatarPool.splice(poolIndex, 1)[0];
                }
                state.playerAvatars[name] = fallbackEmoji;
                renderPlayerList();
                renderPresetPlayers();
                checkMinPlayers();
            }
        });

        grid.appendChild(chip);
    });
}

function renderPlayerList() {
    UI.playerList.innerHTML = '';
    state.players.forEach((name, index) => {
        const li = document.createElement('li');
        li.className = `player-card avatar-color-${(index % 6) + 1}`;
        li.setAttribute('role', 'listitem');
        li.setAttribute('aria-label', `Jugador: ${name}`);

        li.innerHTML = `
            <div class="card-img-container">
                ${getSetupAvatarHTML(name)}
            </div>
            <button class="remove-player-btn" title="Eliminar Jugador" aria-label="Eliminar a ${name}">
                <svg viewBox="0 0 100 100" class="svg-wax-seal">
                    <path d="M50 5 C25 5, 5 25, 5 50 C5 75, 25 95, 50 95 C75 95, 95 75, 95 50 C95 25, 75 5" fill="#a01d1d" />
                    <circle cx="50" cy="50" r="35" fill="#8b1a1a" stroke="#6b1414" stroke-width="2" />
                    <path d="M35 35 L65 65 M65 35 L35 65" stroke="rgba(255,255,255,0.3)" stroke-width="8" stroke-linecap="round" />
                </svg>
            </button>
            <div class="card-name-band">
                <span>${escapeHTML(name.charAt(0).toUpperCase() + name.slice(1))}</span>
            </div>
            <div class="active-glow-star" aria-hidden="true">â­</div>
        `;

        li.querySelector('.remove-player-btn').addEventListener('click', () => {
            removePlayer(name);
            renderPresetPlayers(); // Actualizar chips al eliminar
        });
        UI.playerList.appendChild(li);
    });
}

function checkMinPlayers() {
    const isEnough = state.players.length >= state.minPlayers;
    const isIndicative = state.players.length >= 2;

    UI.startGameBtn.disabled = !isEnough;

    if (isIndicative) {
        UI.startGameBtn.classList.add('can-start');
    } else {
        UI.startGameBtn.classList.remove('can-start');
    }
}

// â”€â”€ InicializaciÃ³n y Eventos Globales (Fase 0) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar historial con la pantalla de inicio
    navigationHistory = [{ id: 'screen-main-menu', data: {} }];

    // Listeners de navegaciÃ³n global
    const btnBack = document.getElementById('btn-global-back');
    const btnHome = document.getElementById('btn-global-home');

    if (btnBack) btnBack.addEventListener('click', goBack);
    if (btnHome) btnHome.addEventListener('click', () => navigateTo('main-menu'));
});

// Utilidad XSS
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g,
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag])
    );
}

function createStardust(x, y) {
    const container = document.getElementById('app-container') || document.body;
    
    // Si usamos app-container (position:relative), requerimos coords relativas:
    let containerRect = { left: 0, top: 0 };
    if (container.id === 'app-container') {
        containerRect = container.getBoundingClientRect();
    }
    
    // Coordenadas locales al contenedor
    const localX = x - containerRect.left;
    const localY = y - containerRect.top;

    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'stardust-particle';
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${localX}px`;
        particle.style.top = `${localY}px`;

        const destinationX = (Math.random() - 0.5) * 100;
        const destinationY = (Math.random() - 0.5) * 100;

        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${destinationX}px, ${destinationY}px) scale(0)`, opacity: 0 }
        ], {
            duration: 800 + Math.random() * 400,
            easing: 'cubic-bezier(0, .9, .57, 1)',
            delay: Math.random() * 100
        }).onfinish = () => particle.remove();

        container.appendChild(particle);
    }
}
