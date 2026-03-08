const state = {
    players: [],
    playerAvatars: {}, // {playerName: '🐰'}
    avatarPool: ['🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🦄', '🐶', '🐱', '🐹', '🐭'],
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
        { id: 'conceptos', name: 'Conceptos', icon: '💡' },
        { id: 'peliculas', name: 'Películas', icon: '🎬' },
        { id: 'lugares', name: 'Lugares', icon: '📍' },
        { id: 'refranes', name: 'Refranes', icon: '🗣️' },
        { id: 'acciones', name: 'Acciones', icon: '🎭' }
    ]
};

// Selectores
const UI = {
    mainContent: document.getElementById('main-content'),
    // Main Menu
    btnMenuNew: document.getElementById('btn-menu-new'),
    btnMenuScores: document.getElementById('btn-menu-scores'),
    btnMenuRules: document.getElementById('btn-menu-rules'),
    // Setup Screen
    setupScreen: document.getElementById('screen-setup'),
    playerNameInput: document.getElementById('player-name'),
    addPlayerBtn: document.getElementById('add-player'),
    playerList: document.getElementById('player-list'),
    startGameBtn: document.getElementById('btn-start-game')
};

// ── Navegación principal ───────────────────────────────────────────────────
// Pantallas ESTÁTICAS (existen en el HTML como <section>)
const STATIC_SCREENS = ['screen-main-menu', 'screen-setup'];

function navigateTo(screenId, data = {}) {
    // Si la pantalla objetivo es estática, mostrar/ocultar secciones
    if (STATIC_SCREENS.includes(screenId)) {
        // Ocultar menú y setup
        STATIC_SCREENS.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove('active');
        });
        // Limpiar contenido dinámico que pudiera estar en #main-content
        const dynamic = document.getElementById('screen-dynamic');
        if (dynamic) dynamic.remove();

        const target = document.getElementById(screenId);
        if (target) target.classList.add('active');

        // Restaurar sección setup en main-content si fue reemplazada
        if (screenId === 'screen-setup') {
            renderPlayerList();
            // Sync start button state
            const startBtn = document.getElementById('btn-start-game');
            if (startBtn) startBtn.disabled = state.players.length < state.minPlayers;
            // Focus en el input de jugador
            setTimeout(() => {
                const input = document.getElementById('player-name');
                if (input) input.focus();
            }, 50);
        }
    } else {
        // Pantalla DINÁMICA: ocultar estáticas y cargar contenido en main-content
        STATIC_SCREENS.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove('active');
        });
        showScreen(screenId, data);
        // Post-init callbacks
        if (screenId === 'screen-categories') renderCategories();
    }
}
// ── Inicialización ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

function setupEventListeners() {
    // Menú Principal
    UI.btnMenuNew.addEventListener('click', () => {
        navigateTo('screen-setup');
    });

    UI.btnMenuScores.addEventListener('click', () => {
        if (Object.keys(state.scores).length === 0) {
            showConfirm("Aún no hay marcadores. ¡Juega una partida primero!", () => { });
            document.getElementById('modal-btn-cancel').classList.add('hidden');
        } else {
            showScoreScreen();
        }
    });

    UI.btnMenuRules.addEventListener('click', () => {
        const rules = "🎮 CÓMO JUGAR\n\n1. El GM asigna en secreto una palabra a cada jugador.\n2. El IMPOSTOR recibe una palabra diferente o nada.\n3. Jugad cartas de Dixit sin revelar la palabra.\n4. Votad: ¿quién es el Impostor?\n5. Si el Impostor no es descubierto → gana. Si es descubierto, puede salvar puntos adivinando la palabra secreta.";
        showConfirm(rules, () => { });
        document.getElementById('modal-btn-cancel').classList.add('hidden');
    });

    // Setup
    UI.addPlayerBtn.addEventListener('click', addPlayer);
    UI.playerNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addPlayer();
    });
    UI.startGameBtn.addEventListener('click', () => {
        navigateTo('screen-categories');
    });
}

function showScreen(screenId, data = {}) {
    // Renderizado dinámico de pantallas
    if (screenId === 'screen-categories') {
        UI.mainContent.innerHTML = `
            <section id="screen-categories" class="screen active">
                <header>
                    <h2 class="glow-text small">Categorías</h2>
                    <p class="subtitle">Selecciona la temática</p>
                </header>
                
                <div class="category-grid" id="category-grid">
                    <!-- Categorías inyectadas -->
                </div>
                
                <div id="category-error" class="error-toast hidden"></div>
                
                <button id="btn-random-category" class="btn-secondary">Aleatorio 🎲</button>
            </section>
        `;
        document.getElementById('btn-random-category').addEventListener('click', pickRandomCategory);
    } else if (screenId === 'screen-reveal') {
        const player = data.player;
        const avatar = state.playerAvatars[player] || '👤';
        UI.mainContent.innerHTML = `
            <section id="screen-reveal" class="screen active">
                <header>
                    <p class="subtitle" style="margin-bottom: 0.2rem;">Pasa el móvil a:</p>
                    <h2 class="glow-text" style="font-size: 3.5rem; margin-top: 0;">${avatar} ${escapeHTML(player)}</h2>
                </header>
                
                <div class="reveal-container glass-card" id="reveal-card">
                    <p id="reveal-instruction">Mantén pulsado para ver tu palabra</p>
                    <div id="role-info" class="hidden">
                        <span class="role-label">Tu palabra es:</span>
                        <h3 id="secret-word-display" class="glow-text">---</h3>
                    </div>
                    <button id="btn-reveal" class="btn-primary glow">MANTÉN PULSADO</button>
                    <button id="btn-next-player" class="btn-secondary hidden">LISTO, PASAR</button>
                </div>
            </section>
        `;
        setupRevealLogic(player, data.index);
    }
}

function renderCategories() {
    const grid = document.getElementById('category-grid');
    grid.innerHTML = '';

    state.categories.forEach(cat => {
        const card = document.createElement('div');
        card.className = 'category-card glass-card';
        card.innerHTML = `
            <div class="cat-icon">${cat.icon}</div>
            <div class="cat-name">${cat.name}</div>
        `;
        card.onclick = () => selectCategory(cat.id);
        grid.appendChild(card);
    });
}

async function selectCategory(catId) {
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
            return;
        }
    }

    startRoleAssignment();
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
            errorToast.textContent = "¡Se han agotado las palabras de esta categoría! Reseteando base de datos interna...";
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
        word: name === state.impostorName ? "¡ERES EL IMPOSTOR!" : state.secretWord
    }));

    showScreen('screen-reveal', { player: state.players[0], index: 0 });
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
    const btn = document.getElementById('btn-reveal');
    const btnNext = document.getElementById('btn-next-player');
    const instruction = document.getElementById('reveal-instruction');
    const roleInfo = document.getElementById('role-info');
    const wordDisplay = document.getElementById('secret-word-display');
    const playerRole = state.roles[index];

    let hasRevealed = false; // Flag para controlar UX

    const reveal = () => {
        instruction.classList.add('hidden');
        roleInfo.classList.remove('hidden');
        wordDisplay.textContent = playerRole.word;
        if (playerRole.isImpostor) wordDisplay.classList.add('impostor-text');
        else wordDisplay.classList.remove('impostor-text');
    };

    const hide = () => {
        // FIX UX: Ocultamiento absoluto y borrado de seguridad del DOM
        roleInfo.classList.add('hidden');
        wordDisplay.textContent = '---';
        hasRevealed = true;

        // FIX UX: El botón MANTÉN PULSADO no desaparece, permitiendo reintentos.
        btnNext.classList.remove('hidden');
        btnNext.style.marginTop = "2rem"; // Separar visualmente los botones
        instruction.textContent = "Palabra vista. Puedes volver a pulsar o continuar.";
        instruction.classList.remove('hidden');
    };

    // Eventos Mouse/Touch
    btn.onmousedown = btn.ontouchstart = (e) => { e.preventDefault(); reveal(); };
    btn.onmouseup = btn.ontouchend = (e) => { e.preventDefault(); hide(); };

    // btnNext asume la responsabilidad del avance explícito
    btnNext.onclick = () => {
        const nextIndex = index + 1;
        if (nextIndex < state.players.length) {
            showScreen('screen-reveal', { player: state.players[nextIndex], index: nextIndex });
        } else {
            showTableScreen();
        }
    };
}

function showTableScreen() {
    UI.mainContent.innerHTML = `
        <section id="screen-table" class="screen active">
            <header>
                <h2 class="glow-text small">Fase de Mesa</h2>
                <p class="subtitle">¡A jugar!</p>
            </header>
            
            <div class="glass-card table-info">
                <p>Jugad vuestras cartas y debatid.</p>
                <p class="muted" style="margin-top: 1rem;">GM Info: Game running con ${state.players.length} jugadores.</p>
            </div>
            
            <div class="resolution-buttons">
                <button id="btn-impostor-won" class="btn-primary">Impostor Invicto 🏆</button>
                <button id="btn-impostor-found" class="btn-secondary">Impostor Descubierto 🔍</button>
            </div>
        </section>
    `;

    document.getElementById('btn-impostor-won').addEventListener('click', () => {
        handleRoundEnd({ impostorFound: false });
        showScoreScreen();
    });

    document.getElementById('btn-impostor-found').addEventListener('click', () => {
        showVotingScreen();
    });
}

function showVotingScreen() {
    // Lista de jugadores que no son el impostor
    const voters = state.players.filter(p => p !== state.impostorName);

    UI.mainContent.innerHTML = `
        <section id="screen-voting" class="screen active">
            <header>
                <h2 class="glow-text small">Votación</h2>
                <p class="subtitle">¿Quiénes acertaron al impostor?</p>
            </header>
            
            <div class="glass-card voting-list">
                ${voters.map(name => `
                    <div class="voting-item">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <span style="font-size:1.5rem">${state.playerAvatars[name] || '👤'}</span>
                            <span style="font-family:'Fredoka', cursive; font-size:1.2rem">${escapeHTML(name)}</span>
                        </div>
                        <input type="checkbox" class="vote-check" data-name="${escapeHTML(name)}">
                    </div>
                `).join('')}
            </div>
            
            <button id="btn-confirm-votes" class="btn-primary">Confirmar Votos</button>
        </section>
    `;

    document.getElementById('btn-confirm-votes').onclick = () => {
        const checks = document.querySelectorAll('.vote-check');
        const correctVoters = [];
        checks.forEach(c => {
            if (c.checked) correctVoters.push(c.dataset.name);
        });

        state.lastCorrectVoters = correctVoters;

        // El impostor siempre tiene opción a salvación si ha sido descubierto
        showSalvacionScreen();
    };
}

function showSalvacionScreen() {
    const words = state.gameData[state.selectedCategory];
    const decoys = words.filter(w => w !== state.secretWord)
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);
    const options = [...decoys, state.secretWord].sort(() => 0.5 - Math.random());

    UI.mainContent.innerHTML = `
        <section id="screen-salvacion" class="screen active">
            <header>
                <h2 class="glow-text small">Salvación</h2>
                <p class="subtitle">${escapeHTML(state.impostorName)}, ¿cuál es la palabra?</p>
            </header>
            
            <p id="salvacion-msg" class="subtitle hidden"></p>

            <div class="options-grid" id="salvacion-grid">
                ${options.map(opt => `
                    <button class="btn-option glass-card">${escapeHTML(opt)}</button>
                `).join('')}
            </div>
            
            <button id="btn-to-scores" class="btn-primary hidden">Ver Marcadores</button>
        </section>
    `;

    // Asignar eventos manualmente para evitar problemas de window scope
    const buttons = document.querySelectorAll('.btn-option');
    buttons.forEach(btn => {
        btn.onclick = () => handleSalvacion(btn.textContent, buttons);
    });

    document.getElementById('btn-to-scores').onclick = () => showScoreScreen();
}

function handleSalvacion(choice, buttons) {
    const msg = document.getElementById('salvacion-msg');
    const btnScores = document.getElementById('btn-to-scores');

    buttons.forEach(b => b.disabled = true);

    const guessed = (choice === state.secretWord);

    if (guessed) {
        msg.textContent = "¡TE HAS SALVADO! +2 Puntos";
        msg.style.color = "var(--primary)";
    } else {
        msg.textContent = `FALLASTE. Era: ${state.secretWord}`;
        msg.style.color = "var(--accent)";
    }

    handleRoundEnd({
        impostorFound: true,
        correctVoters: state.lastCorrectVoters,
        impostorGuessedWord: guessed
    });

    msg.classList.remove('hidden');
    btnScores.classList.remove('hidden');
    document.getElementById('salvacion-grid').classList.add('faded');
}

function handleRoundEnd({ impostorFound, correctVoters = [], impostorGuessedWord = false }) {
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

    if (!impostorFound) {
        // Impostor Invicto = 3pts
        state.scores[state.impostorName] += 3;
        state.roundScores[state.impostorName] = 3;
        state.roundReasons[state.impostorName] = "👻 Invicto";

        // Inocentes que fallaron = 0pts
    } else {
        // Impostor Descubierto = 1pt base (si NO es unánime) o 0pt
        if (numAcertantes < innocentCount) {
            state.scores[state.impostorName] += 1;
            state.roundScores[state.impostorName] += 1;
            state.roundReasons[state.impostorName] = "🤡 Descubierto";
        } else {
            state.roundReasons[state.impostorName] = "💀 Pillado por TODOS";
        }

        if (impostorGuessedWord) {
            state.scores[state.impostorName] += 2; // +2 extra por salvarse
            state.roundScores[state.impostorName] += 2;
            state.roundReasons[state.impostorName] += " + 🛟 Salvado";
        }

        // Puntos para jugadores inocentes
        if (numAcertantes === 1) {
            // Acierto Super-Aislado
            state.scores[correctVoters[0]] += 3;
            state.roundScores[correctVoters[0]] = 3;
            state.roundReasons[correctVoters[0]] = "🎯 Rencor Único";
        } else if (numAcertantes > 1) {
            // Acierto Parcial o Unánime
            correctVoters.forEach(name => {
                state.scores[name] += 2;
                state.roundScores[name] = 2;
                state.roundReasons[name] = "✔️ Acierto";
            });
        }
    }
}

function showScoreScreen() {
    // Ordenar por puntuación descendente
    const sortedPlayers = [...state.players].sort((a, b) => (state.scores[b] || 0) - (state.scores[a] || 0));

    // FIX: Añadido id="screen-score" y clase score-screen con botones de sumar y restar
    UI.mainContent.innerHTML = `
        <section id="screen-score" class="screen score-screen active">
            <h2>Marcadores 🏆</h2>
            <div class="score-list glass-card">
                ${sortedPlayers.map((name, index) => {
        const delta = state.roundScores[name] || 0;
        const reason = state.roundReasons[name] || "";
        const deltaHTML = delta > 0 ? `<div class="round-delta"><span class="delta-pts">+${delta}</span> <span class="delta-reason">${reason}</span></div>` : (reason ? `<div class="round-delta"><span class="delta-pts muted">+0</span> <span class="delta-reason muted">${reason}</span></div>` : '');

        return `
                    <div class="score-item ${index === 0 && state.scores[name] > 0 ? 'winner' : ''}">
                        <span class="rank">${index + 1}</span>
                        <div class="name">
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span style="font-size:1.4rem">${state.playerAvatars[name] || '👤'}</span>
                                <span>${escapeHTML(name)}</span>
                            </div>
                            ${deltaHTML}
                        </div>
                        <div class="score-edit-group">
                            <button class="btn-score-mod" data-action="minus" data-player="${escapeHTML(name)}">-</button>
                            <span class="score-display" id="score-val-${escapeHTML(name)}">${state.scores[name] || 0}</span>
                            <button class="btn-score-mod" data-action="plus" data-player="${escapeHTML(name)}">+</button>
                        </div>
                    </div>
                `}).join('')}
            </div>
            <div class="score-actions">
                <button id="btn-next-round" class="btn-primary">Nueva Ronda 🔄</button>
                <button id="btn-reset-scores" class="btn-secondary">Resetear Marcadores ⚠️</button>
                <button id="btn-exit-game" class="btn-danger">Salir al Inicio 🚪</button>
            </div>
        </section>
    `;

    // Listeners para botones de puntuación
    document.querySelectorAll('.btn-score-mod').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const player = e.target.dataset.player;
            const action = e.target.dataset.action;
            let currentScore = state.scores[player] || 0;

            if (action === 'plus') currentScore++;
            else if (action === 'minus') currentScore--;

            state.scores[player] = currentScore;
            document.getElementById('score-val-' + player).textContent = currentScore;

            // Re-render opcional completo para reordenar
            // showScoreScreen();
        });
    });

    document.getElementById('btn-next-round').onclick = () => {
        navigateTo('screen-categories');
    };

    document.getElementById('btn-reset-scores').onclick = () => {
        showConfirm("¿Seguro que quieres resetear todos los puntos?", () => {
            state.players.forEach(p => state.scores[p] = 0);
            showScoreScreen();
        });
    };

    document.getElementById('btn-exit-game').onclick = () => {
        showConfirm("¿Volver al menú principal? Se perderá el progreso de esta ronda.", () => {
            // Limpiamos el contenido dinámico del main-content
            UI.mainContent.innerHTML = '';
            navigateTo('screen-main-menu');
        });
    };
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

function addPlayer() {
    const name = UI.playerNameInput.value.trim();
    if (name && !state.players.includes(name)) {
        state.players.push(name);

        // Asignar avatar aleatorio único (sin repetir)
        let chosenAvatar = '👤';
        if (state.avatarPool.length > 0) {
            const poolIndex = Math.floor(Math.random() * state.avatarPool.length);
            chosenAvatar = state.avatarPool.splice(poolIndex, 1)[0];
        }
        state.playerAvatars[name] = chosenAvatar;

        UI.playerNameInput.value = '';
        renderPlayerList();
        checkMinPlayers();
    }
}

function removePlayer(name) {
    state.players = state.players.filter(p => p !== name);

    // Liberar el avatar para que otros puedan usarlo
    const releasedAvatar = state.playerAvatars[name];
    if (releasedAvatar && releasedAvatar !== '👤') {
        state.avatarPool.push(releasedAvatar);
    }
    delete state.playerAvatars[name];

    renderPlayerList();
    checkMinPlayers();
}

function renderPlayerList() {
    UI.playerList.innerHTML = '';
    state.players.forEach(name => {
        const li = document.createElement('li');
        li.className = 'player-item';

        const infoDiv = document.createElement('div');
        infoDiv.style.display = 'flex';
        infoDiv.style.alignItems = 'center';
        infoDiv.style.gap = '10px';

        const avatarSpan = document.createElement('span');
        avatarSpan.textContent = state.playerAvatars[name] || '👤';
        avatarSpan.style.fontSize = '1.3rem';

        const nameSpan = document.createElement('span');
        nameSpan.textContent = name;

        infoDiv.appendChild(avatarSpan);
        infoDiv.appendChild(nameSpan);

        const btnDelete = document.createElement('button');
        btnDelete.className = 'btn-delete';
        btnDelete.textContent = '✕';
        btnDelete.addEventListener('click', () => removePlayer(name));

        li.appendChild(infoDiv);
        li.appendChild(btnDelete);
        UI.playerList.appendChild(li);
    });
}

function checkMinPlayers() {
    UI.startGameBtn.disabled = state.players.length < state.minPlayers;
}

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
