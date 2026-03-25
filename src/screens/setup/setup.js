import { state, UI, PRESET_PLAYERS } from '../../core/state.js';
import { getSetupAvatarHTML, escapeHTML, createStarDust } from '../../core/utils.js';

export function addPlayer(e) {
    const name = UI.playerNameInput.value.trim();
    if (name && !state.players.includes(name)) {
        state.players.push(name);

        let fallbackEmoji = '👤';
        if (state.avatarPool.length > 0) {
            const poolIndex = Math.floor(Math.random() * state.avatarPool.length);
            fallbackEmoji = state.avatarPool.splice(poolIndex, 1)[0];
        }
        state.playerAvatars[name] = fallbackEmoji;

        createStarDust(e.clientX || e.pageX, e.clientY || e.pageY);
        UI.playerNameInput.value = '';
        renderPlayerList();
        checkMinPlayers();
    }
}

export function removePlayer(name) {
    state.players = state.players.filter(p => p !== name);

    const releasedAvatar = state.playerAvatars[name];
    if (releasedAvatar && releasedAvatar !== '👤') {
        state.avatarPool.push(releasedAvatar);
    }
    delete state.playerAvatars[name];

    renderPlayerList();
    renderPresetPlayers();
    checkMinPlayers();
}

export function renderPresetPlayers() {
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
                createStarDust(e.clientX, e.clientY);
                state.players.push(name);
                let fallbackEmoji = '👤';
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

export function renderPlayerList() {
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
            <div class="active-glow-star" aria-hidden="true">⭐</div>
        `;

        li.querySelector('.remove-player-btn').addEventListener('click', () => {
            removePlayer(name);
            renderPresetPlayers();
        });
        UI.playerList.appendChild(li);
    });
}

export function checkMinPlayers() {
    const isEnough = state.players.length >= state.minPlayers;
    const isIndicative = state.players.length >= 2;

    UI.startGameBtn.disabled = !isEnough;

    if (isIndicative) {
        UI.startGameBtn.classList.add('can-start');
    } else {
        UI.startGameBtn.classList.remove('can-start');
    }
}
