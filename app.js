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
        { id: 'peliculas', name: 'Películas', icon: 'ðŸŽ¬' },
        { id: 'lugares', name: 'Lugares', icon: 'ðŸ“' },
        { id: 'refranes', name: 'Refranes', icon: 'ðŸ—£ï¸' },
        { id: 'acciones', name: 'Acciones', icon: 'ðŸŽ­' }
    ],
    globalRanking: JSON.parse(localStorage.getItem('dixit_global_ranking')) || {}
};

// Jugadores recurrentes (plantilla predefinida)
const PRESET_PLAYERS = ['DC', 'JAVI', 'AG', 'ELI', 'JUAN', 'JUANI', 'IRENE', 'TINA', 'DIEGO J', 'SANTI', 'TRINI'];

// Títulos nativos por cada Preset
const PLAYER_TITLES = {
    'DC': 'El ingenioso',
    'JAVI': 'El sensato',
    'AG': 'La energía',
    'ELI': 'La ambiciosa',
    'JUAN': 'Don de gentes',
    'JUANI': 'La artista',
    'IRENE': 'La protectora',
    'TINA': 'La bailarina',
    'DIEGO J': 'El vendedor',
    'SANTI': 'El feliz',
    'TRINI': 'La viajera'
};

/**
 * Genera el HTML para el avatar de un jugador intentando cargar su imagen si existe.
 * Si la imagen (nombre.png) no se encuentra (404), el atributo onerror la reemplaza dinámicamente
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

// â”€â”€ Gestor Mágico de Audio â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const audioManager = {
    bgMusic: document.getElementById('bg-music'),
    isMuted: false,
    hasStarted: false,
    init() {
        if (!this.bgMusic) return;
        this.bgMusic.volume = 0.5; // Volumen inmersivo

        // El navegador requiere interacción humana para reproducir audio
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

// â”€â”€ Navegación principal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Pantallas ESTÃTICAS (existen en el HTML como <section>)
const STATIC_SCREENS = ['screen-main-menu', 'screen-setup', 'screen-global-scores'];
let currentTimerInterval = null;
let navigationHistory = [{ id: 'screen-main-menu', data: {} }]; // Rastreo para botón atrás
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
    // Restaurar botón de ajustes (puede ser ocultado por pantallas específicas como 'score')
    const settingsBtn = document.getElementById('btn-menu-settings');
    if (settingsBtn) settingsBtn.style.display = 'block';
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

    // Visibilidad de controles de navegación globales
    updateGlobalNav(screenId);

    // Si la pantalla objetivo es estática, mostrar/ocultar secciones
    if (STATIC_SCREENS.includes(screenId) || screenId === 'main-menu') {
        const targetId = screenId === 'main-menu' ? 'screen-main-menu' : screenId;
        // Ocultar menú y setup
        STATIC_SCREENS.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove('active');
        });

        // Limpiar contenido dinámico
        if (UI.dynamicContent) UI.dynamicContent.innerHTML = '';

        const target = document.getElementById(targetId);
        if (target) target.classList.add('active');

        // Restaurar sección setup en main-content si fue reemplazada
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
            // Focus automático ELIMINADO para evitar que salte el teclado virtual en móviles
            // y tape la interfaz. El usuario deberá tocar explícitamente el campo de texto.
        }

        if (screenId === 'screen-global-scores') {
            renderGlobalScores();
        }
    } else {
        // Pantalla DINÃMICA: ocultar estáticas y cargar contenido en main-content
        STATIC_SCREENS.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove('active');
        });
        showScreen(screenId, data);
        // Post-init callbacks
        if (screenId === 'screen-categories') renderCategories();
    }
}
// â”€â”€ Inicialización â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
document.addEventListener('DOMContentLoaded', () => {
    audioManager.init(); // Inicializar motor de audio
    setupEventListeners();
    requestWakeLock(); // Activar bloqueo de suspensión

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
            console.log('âœ¨ Pantalla bloqueada para el sueño místico...');
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

    // Menú Principal
    UI.btnMenuNew.addEventListener('click', (e) => {
        createLiquidRipple(e, UI.btnMenuNew);

        // Generar semillas de diente de león
        const container = document.createElement('div');
        container.className = 'dandelion-container';
        document.body.appendChild(container);

        const rect = UI.btnMenuNew.getBoundingClientRect();
        // Ajuste: El centro del botón SVG para que las semillas salgan del núcleo
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

        // Retrasar navegación para el efecto visual
        setTimeout(() => {
            navigateTo('screen-setup');
            setTimeout(() => {
                container.remove();
            }, 500);
        }, 600);
    });


    UI.btnMenuRules.addEventListener('click', () => {
        const rules = `📜 REGLAS DEL DESTINO

1. SELECCIÓN: Todos reciben la PALABRA SECRETA, excepto el IMPOSTOR.
2. ACCIÓN: Cada uno juega una carta física de Dixit que evoque la palabra.
3. DEBATE: El Impostor debe fingir que conoce la palabra para no ser descubierto.
4. VOTACIÓN: Al final, señalad al unísono a quién creéis que es el Impostor.

🏆 PUNTUACIÓN:
• Si NADIE descubre al Impostor: Impostor +6 pts.
• Si TODOS descubren al Impostor: Impostor -1 pt / Inocentes +2 pts.
• Si hay dudas: Los puntos se reparten según el éxito del engaño.`;
        showConfirm(rules, () => { });
        document.getElementById('modal-btn-cancel').classList.add('hidden');
    });

    UI.btnMenuScores.addEventListener('click', (e) => {
        createLiquidRipple(e, UI.btnMenuScores);
        navigateTo('screen-global-scores');
    });

    UI.btnMenuSettings.addEventListener('click', () => {
        const estado = audioManager.isMuted ? "REACTIVAR" : "SILENCIAR";
        const icon = audioManager.isMuted ? "ðŸ”Š" : "ðŸ”‡";

        showConfirm(`âš™ï¸ AJUSTES DE AUDIO\n\nÂ¿Deseas ${estado} ${icon} la melodía "Clockwork Garden Carnival"?`, () => {
            audioManager.toggleMute();
        });

        // Asegurarnos de que el botón cancelar aparezca (puede estar oculto de otros modales)
        document.getElementById('modal-btn-cancel').classList.remove('hidden');
    });

    // Setup
    UI.addPlayerBtn.addEventListener('click', (e) => addPlayer(e));
    UI.playerNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addPlayer(e);
    });
    // btn-start-game listener extraído para evitar dual-fire con navigateTo()
}

function showScreen(screenId, data = {}) {
    // Renderizado dinámico de pantallas
    if (screenId === 'screen-categories') {
        UI.dynamicContent.innerHTML = `
            <section id="screen-categories" class="screen active">
                <header>
                    <h2 class="glow-text small">Categorías</h2>
                    <p class="subtitle">Selecciona la temática</p>
                </header>
                
                <div class="category-grid" id="category-grid">
                    <!-- Categorías inyectadas -->
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

                        <!-- CARA TRASERA: Revelación (tras el flip 3D) -->
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
                
                <!-- Botones oníricos -->
                <div class="reveal-actions">
                    <div class="reveal-btn-container">
                        <button id="btn-reveal" class="btn-dreamy btn-dreamy--hold btn-hold-dimmed" aria-label="Mantén pulsado"></button>
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
    } else if (screenId === 'screen-aciertos') {
        showAciertosScreen();
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

    // Cargar palabras si no están cargadas
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
            errorToast.textContent = "Â¡Se han agotado las palabras de esta categoría! Reseteando base de datos interna...";
            errorToast.classList.remove('hidden');
        }
        state.usedWords = [];
        availableWords = words;
    }

    // Selección segura criptográfica para la palabra
    const wordIndex = getRandomSecure(availableWords.length);
    state.secretWord = availableWords[wordIndex];
    state.usedWords.push(state.secretWord);

    // Selección segura criptográfica para el impostor con sistema anti-racha mitigada
    let impostorIndex = getRandomSecure(state.players.length);
    let chosenImpostor = state.players[impostorIndex];

    // Si toca el mismo de la ronda anterior, volvemos a tirar los dados una vez 
    // (reduce brutalmente la repetición seguida pero no la hace "imposible")
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

// Generador Criptográfico de Números Aleatorios
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

        // MECáNICA NUEVA: Si es impostor, cambiamos el fondo de la pantalla a bg_tension_dark (oscuro)
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
    // Elegir aleatoriamente quién empieza a hablar (cualquier jugador, incl. el impostor)
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


    document.getElementById('btn-all-ready').onclick = () => {
        if (currentTimerInterval) clearInterval(currentTimerInterval);
        navigateTo('screen-panic');
    };
}

function showRevealPanicScreen() {
    UI.dynamicContent.innerHTML = `
        <section id="screen-panic" class="screen active" style="display: flex; flex-direction: column; justify-content: center; height: 100%;">
            
            <!-- FASE 1: ESPERA (Piedra rúnica con luz giratoria) -->
            <div id="panic-phase-1" style="height: 100%; display: flex; align-items: center; justify-content: center; position: relative; overflow: visible;">
                <div class="panic-light-wrap">
                    <div class="btn-dreamy--panic pulse-card" style="position: relative; z-index: 1;"></div>
                    <img src="assets/IMG/UI/tension/btn_luz_reveal.png" class="panic-magic-light" alt="Luz mágica">
                </div>
            </div>

            <!-- FASE 2 y 3: PANICO Y DEBATE -->
            <div id="panic-phase-2" class="hidden" style="text-align: center; display: flex; flex-direction: column; height: 100%; justify-content: flex-start; padding-top: 5vh; box-sizing: border-box;">
                
                <!-- Icono Superior -->
                <div style="flex: 0; display: flex; justify-content: center; margin-top: -6vh; margin-bottom: 1.5vh;">
                    <img src="assets/IMG/UI/tension/btn_hora.png" alt="Hora" class="panic-time-icon" style="width: 240px; height: auto; filter: drop-shadow(0 5px 15px rgba(0,0,0,0.4));">
                </div>
                
                <!-- Contenedor Superior (Palabra centrada) -->
                <div style="flex: 0; display: flex; flex-direction: column; justify-content: center; min-height: 25vh; gap: 2vh;">
                    <h2 class="shamanic-glyph" style="margin: 0; padding-top: 4vh;">${escapeHTML(state.secretWord)}</h2>
                </div>
                
                <!-- Contenedor Central (Cuenta atrás O Botón Votar) -->
                <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%;">
                    <div id="panic-countdown" class="panic-number" style="margin: 0;">
                        <img src="assets/IMG/UI/tension/cuenta_atras/5.png" alt="5">
                    </div>
                    <div id="panic-debate-ui" class="hidden" style="display: flex; align-items: center; justify-content: center; width: 100%;">
                        <button id="btn-to-vote" class="btn-confirm-votos-action">
                            <img src="assets/IMG/UI/voting_score/btn_confirmar_votos.png" alt="Confirmar" style="width: 250px; max-width: 70vw;">
                        </button>
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
                navigateTo('screen-aciertos');
            }
        }, 1000);
    };
}

function showAciertosScreen() {
    const playersExceptImpostor = state.players.filter(p => !state.roles.find(r => r.name === p).isImpostor);

    UI.dynamicContent.innerHTML = `
        <section id="screen-aciertos" class="screen score-setup-screen active">
            <div class="aciertos-header">
                <img src="assets/IMG/UI/voting_score/btn_acertarimpostor.png" alt="Acierta al Impostor" class="img-header-aciertos">
            </div>

            <div class="aciertos-grid-container">
                <div class="aciertos-grid grid-count-${playersExceptImpostor.length}">
                    ${playersExceptImpostor.map(name => `
                        <div class="vote-avatar-card" data-name="${escapeHTML(name)}" role="button" aria-pressed="false" tabindex="0">
                            <div class="vote-avatar-frame-wrapper">
                                ${getSetupAvatarHTML(name)}
                            </div>
                            <div class="vote-player-name">${escapeHTML(name)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="aciertos-footer">
                <button id="btn-confirm-aciertos" class="btn-confirm-votos-action">
                    <img src="assets/IMG/UI/voting_score/btn_confirmar_votos.png" alt="Confirmar">
                </button>
            </div>
        </section>
    `;

    // Lógica de selección (similar a la anterior pero adaptada)
    const cards = document.querySelectorAll('.vote-avatar-card');
    cards.forEach(card => {
        card.onclick = () => {
            const isSelected = card.classList.toggle('is-selected');
            card.setAttribute('aria-pressed', isSelected);
        };
    });

    document.getElementById('btn-confirm-aciertos').onclick = () => {
        const selectedCards = document.querySelectorAll('.vote-avatar-card.is-selected');
        const correctVoters = [];
        selectedCards.forEach(card => {
            correctVoters.push(card.dataset.name);
        });

        state.lastCorrectVoters = correctVoters;
        handleRoundEnd({
            impostorFound: true,
            correctVoters: state.lastCorrectVoters
        });
        navigateTo('screen-score');
    };
}

function handleRoundEnd({ impostorFound, correctVoters = [] }) {
    state.roundScores = {};
    state.roundReasons = {};

    state.players.forEach(p => {
        if (!state.scores[p]) state.scores[p] = 0;
        state.roundScores[p] = 0;
        state.roundReasons[p] = "";
    });

    const totalPlayers = state.players.length;
    const innocentCount = totalPlayers - 1;
    const numAcertantes = correctVoters.length;

    if (!impostorFound || numAcertantes === 0) {
        state.scores[state.impostorName] += 6;
        state.roundScores[state.impostorName] = 6;
        state.roundReasons[state.impostorName] = "Invicto (Nadie acierta)";
    } else {
        if (numAcertantes === 1) {
            state.scores[state.impostorName] += 4;
            state.roundScores[state.impostorName] = 4;
            state.roundReasons[state.impostorName] = "Descubierto por 1";

            state.scores[correctVoters[0]] += 6;
            state.roundScores[correctVoters[0]] = 6;
            state.roundReasons[correctVoters[0]] = "Único Acertante";
        } else if (numAcertantes < innocentCount / 2) {
            state.scores[state.impostorName] += 2;
            state.roundScores[state.impostorName] = 2;
            state.roundReasons[state.impostorName] = "Descubierto por minoría";

            correctVoters.forEach(name => {
                state.scores[name] += 4;
                state.roundScores[name] = 4;
                state.roundReasons[name] = "Acierto (Minoría)";
            });
        } else if (numAcertantes === innocentCount / 2) {
            state.scores[state.impostorName] += 1;
            state.roundScores[state.impostorName] = 1;
            state.roundReasons[state.impostorName] = "Descubierto por la mitad";

            correctVoters.forEach(name => {
                state.scores[name] += 3;
                state.roundScores[name] = 3;
                state.roundReasons[name] = "Acierto (Empate)";
            });
        } else if (numAcertantes > innocentCount / 2 && numAcertantes < innocentCount) {
            state.scores[state.impostorName] += 0;
            state.roundScores[state.impostorName] = 0;
            state.roundReasons[state.impostorName] = "Descubierto por mayoría";

            correctVoters.forEach(name => {
                state.scores[name] += 2;
                state.roundScores[name] = 2;
                state.roundReasons[name] = "Acierto (Mayoría)";
            });
        } else if (numAcertantes === innocentCount) {
            state.scores[state.impostorName] -= 1;
            state.roundScores[state.impostorName] = -1;
            state.roundReasons[state.impostorName] = "Pillado por TODOS";

            correctVoters.forEach(name => {
                state.scores[name] += 2;
                state.roundScores[name] = 2;
                state.roundReasons[name] = "Acierto Unánime";
            });
        }
    }
}

  function showScoreScreen() {
    const sortedPlayers = [...state.players].sort((a, b) => (state.scores[b] || 0) - (state.scores[a] || 0));

    const getPlayerRoleText = (name) => {
        const playerRoleObj = state.roles.find(r => r.name === name);
        if (playerRoleObj && playerRoleObj.isImpostor) return 'El Impostor';
        return PLAYER_TITLES[name.toUpperCase()] || 'Participante Astral';
    };

    UI.dynamicContent.innerHTML = `
        <section id="screen-score" class="screen score-screen astral-score-screen active">
            
            <header class="astral-header">
                <img src="assets/IMG/UI/voting_score/btn_marcadores.png" alt="Marcadores" class="astral-title-img">
            </header>

            <div class="astral-score-list">
                ${sortedPlayers.map((name, index) => {
        const delta = state.roundScores[name] || 0;
        const deltaText = delta > 0 ? `+${delta}` : `+0`;
        const slugId = name.toLowerCase().replace(/\s+/g, '-');
        const roleText = getPlayerRoleText(name);
        
        let rankClass = "astral-rank-base";
        let rankIcon = "";
        let borderClass = "astral-item-base";
        let isLast = index === sortedPlayers.length - 1;
        
        if (index === 0) {
            rankClass = "astral-rank-1";
            borderClass = "astral-item-gold";
        } else if (index === 1) {
            rankClass = "astral-rank-2";
            borderClass = "astral-item-silver";
        } else if (index === 2 && !isLast) {
            rankClass = "astral-rank-3";
            borderClass = "astral-item-bronze";
        }

        if (isLast && index > 0) {
            rankClass = "astral-rank-last";
            borderClass = "astral-item-red";
        }

        const isFirst = index === 0;
        const isImpostor = !!(state.roles.find(r => r.name === name && r.isImpostor));
        
        let extraIcons = "";
        if (isFirst) extraIcons += `<img src="assets/IMG/UI/voting_score/btn_corona.png" class="astral-crown-badge" alt="Corona">`;
        if (isImpostor) extraIcons += `<img src="assets/IMG/UI/voting_score/btn_daga.png" class="astral-dagger-badge" alt="Daga">`;

        return `
                    <div class="astral-score-item ${borderClass}">
                        <div class="astral-rank-number ${rankClass}">
                            ${(rankClass === "astral-rank-1")
                                ? `<img src="assets/IMG/UI/voting_score/btn_pos_1.png" class="astral-rank-img" alt="1">
                                   <span class="rank-number-overlay rank-1-blue">1</span>`
                                : (rankClass === "astral-rank-2")
                                    ? `<img src="assets/IMG/UI/voting_score/btn_pos_2.png" class="astral-rank-img" alt="2">
                                       <span class="rank-number-overlay rank-2-silver">2</span>`
                                    : (rankClass === "astral-rank-3" && !isLast)
                                        ? `<img src="assets/IMG/UI/voting_score/btn_pos_3.png" class="astral-rank-img" alt="3">`
                                        : (rankClass === "astral-rank-base")
                                            ? `<img src="assets/IMG/UI/voting_score/btn_pos_cualquiera.png" class="astral-rank-img" alt="Medalla">
                                               <span class="rank-number-overlay">${index + 1}</span>`
                                            : (index + 1)}
                        </div>
                        
                        <div class="astral-avatar-wrapper">
                            ${getAvatarHTML(name, 'astral-avatar')}
                            ${extraIcons}
                        </div>
                        
                        <div class="astral-player-info">
                            <span class="astral-player-name">${escapeHTML(name)}</span>
                            <span class="astral-player-role">${roleText}</span>
                        </div>
                        
                        <div class="astral-delta-pts ${delta > 0 ? 'delta-positive' : ''}" 
                             data-reason="${escapeHTML(state.roundReasons[name] || '')}" 
                             title="Click para ver razón">
                            ${deltaText}
                        </div>
                        
                        <div class="astral-total-pts">
                            <span id="score-val-${slugId}">${state.scores[name] || 0}</span>
                        </div>
                        
                        <div class="astral-score-controls">
                            <button class="btn-score-mod astral-mod" data-action="minus" data-player="${escapeHTML(name)}">-</button>
                            <button class="btn-score-mod astral-mod" data-action="plus" data-player="${escapeHTML(name)}">+</button>
                        </div>
                    </div>
                `}).join('')}
            </div>

            <div class="astral-footer-actions">
                <button id="btn-exit-game" class="btn-astral-action" aria-label="Finalizar Partida"></button>
                <button id="btn-next-round" class="btn-astral-action primary-astral" aria-label="Nueva Ronda"></button>
                <button id="btn-reset-scores" class="btn-astral-action" aria-label="Resetear Puntos"></button>
            </div>
        </section>
    `;

    // Ocultar botón de ajustes solo en esta pantalla
    const settingsBtn = document.getElementById('btn-menu-settings');
    if (settingsBtn) settingsBtn.style.display = 'none';

    // Listeners para botones de puntuación
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
        });
    });

    // Listener para mostrar la razón del delta
    document.querySelectorAll('.astral-delta-pts').forEach(delta => {
        delta.style.cursor = 'pointer';
        delta.addEventListener('click', (e) => {
            const reason = e.target.dataset.reason;
            if (reason) {
                showAstralToast(reason);
            }
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
            showConfirm("¿Volver al menú principal? Se guardarán los puntos de esta partida.", () => {
                // ACTUALIZAR RANKING GLOBAL
                const sortedPlayers = [...state.players].sort((a, b) => (state.scores[b] || 0) - (state.scores[a] || 0));
                state.players.forEach(name => {
                    if (!state.globalRanking[name]) {
                        state.globalRanking[name] = { played: 0, points: 0, wins: 0, avatar: state.playerAvatars[name] || '👤' };
                    }
                    state.globalRanking[name].played += 1;
                });
                const podium = sortedPlayers.slice(0, 3);
                podium.forEach((name, idx) => {
                    const bonus = [5, 3, 1][idx];
                    state.globalRanking[name].points += bonus;
                    if (idx === 0) state.globalRanking[name].wins += 1;
                });
                localStorage.setItem('dixit_global_ranking', JSON.stringify(state.globalRanking));

                // Limpiamos el contenido dinámico 
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

function showAstralToast(message) {
    const existing = document.querySelector('.astral-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'astral-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('active'), 10);
    setTimeout(() => {
        toast.classList.remove('active');
        setTimeout(() => toast.remove(), 500);
    }, 2500);
}

function showConfirm(message, onConfirm) {
            const modal = document.getElementById('modal-container');
            const msg = document.getElementById('modal-message');
            const btnConfirm = document.getElementById('modal-btn-confirm');
            const btnCancel = document.getElementById('modal-btn-cancel');

            // Restaurar el botón cancelar por si fue ocultado
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

                // Asignar emoji aleatorio único (sin repetir) como fallback
                let fallbackEmoji = 'ðŸ‘¤';
                if (state.avatarPool.length > 0) {
                    const poolIndex = Math.floor(Math.random() * state.avatarPool.length);
                    fallbackEmoji = state.avatarPool.splice(poolIndex, 1)[0];
                }
                state.playerAvatars[name] = fallbackEmoji;

                createStarDust(e); // El evento e vendrá del listener
                UI.playerNameInput.value = '';
                renderPlayerList();
                checkMinPlayers();
            }
        }

function createStarDust(e) {
            // Reutilizar la logica que limite las particulas al app-container para no desbordar body
            const container = document.getElementById('app-container') || document.body;
            let containerRect = { left: 0, top: 0 };
            if (container.id === 'app-container') {
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
                chip.title = isActive ? 'Quitar de la partida' : 'Añadir a la partida';
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

function renderGlobalScores() {
    const list = document.getElementById('global-ranking-list');
    if (!list) return;

    // Convertir objeto de ranking a array y ordenar por puntos (DESC)
    const rankingArray = Object.entries(state.globalRanking).map(([name, stats]) => ({
        name,
        ...stats
    })).sort((a, b) => (b.points || 0) - (a.points || 0));

    list.innerHTML = rankingArray.map((player, index) => {
        const slug = player.name.toLowerCase().replace(/\s+/g, '');
        const imagePath = `assets/players/${slug}.png`;
        const fallbackEmoji = player.avatar || 'ðŸ‘¤';

        return `
            <div class="global-ranking-item">
                <div class="ranking-avatar-block">
                    <div class="ranking-avatar-frame" active-color="${(index % 6) + 1}">
                        <img src="${imagePath}" alt="${player.name}" onerror="this.outerHTML='<div class=\\'avatar-fallback-container ranking-fallback\\'><span class=\\'avatar-fallback-emoji\\'>${fallbackEmoji}</span></div>'">
                    </div>
                    <div class="ranking-player-name-container">
                        <span class="ranking-player-name">${escapeHTML(player.name)}</span>
                        <span class="ranking-player-title">${PLAYER_TITLES[player.name.toUpperCase()] || 'El Viajero'}</span>
                    </div>
                </div>

                <div class="ranking-stats-grid">
                    <div class="stat-box" data-stat="puesto">
                        <span class="stat-label">PUESTO</span>
                        <div class="stat-icon-container">
                            <img src="assets/IMG/UI/rmarcadores/icon_podio.png" class="stat-icon" alt="Podio">
                        </div>
                        <span class="stat-value">#${index + 1}</span>
                    </div>

                    <div class="stat-box" data-stat="partidas">
                        <span class="stat-label">JUGADAS</span>
                        <div class="stat-icon-container">
                            <img src="assets/IMG/UI/rmarcadores/icon_cartas.png" class="stat-icon" alt="Cartas">
                        </div>
                        <span class="stat-value">${player.played || 0}</span>
                    </div>

                    <div class="stat-box" data-stat="puntos">
                        <span class="stat-label">PUNTOS</span>
                        <div class="stat-icon-container">
                            <img src="assets/IMG/UI/rmarcadores/icon_orbe.png" class="stat-icon" alt="Orbe">
                        </div>
                        <span class="stat-value">${player.points || 0}</span>
                    </div>

                    <div class="stat-box" data-stat="ganadas">
                        <span class="stat-label">GANADAS</span>
                        <div class="stat-icon-container">
                            <img src="assets/IMG/UI/voting_score/btn_corona.png" class="stat-icon" alt="Corona">
                        </div>
                        <span class="stat-value">${player.wins || 0}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    if (rankingArray.length === 0) {
        list.innerHTML = '<div class="ranking-empty-msg" style="color:#d4af37; text-align:center; padding:2rem; font-weight:bold; width:100%; font-size: 1.1rem; text-shadow: 0 2px 4px rgba(0,0,0,0.8);">El orbe de cristal aún no muestra leyendas... <br> ¡Comienza una partida para forjar tu destino!</div>';
    }
}
document.addEventListener('DOMContentLoaded', () => {
            // Inicializar historial con la pantalla de inicio
            navigationHistory = [{ id: 'screen-main-menu', data: {} }];

            // Listeners de navegación global
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
