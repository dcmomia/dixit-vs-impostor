import { state, UI } from './state.js';
import { renderPresetPlayers, renderPlayerList } from '../screens/setup/setup.js';
import { renderCategories } from '../screens/categories/categories.js';
import { setupRevealLogic } from '../screens/reveal/reveal.js';
import { showTimerScreen, clearTimer } from '../screens/timer/timer.js';
import { showRevealPanicScreen, clearPanicTimer } from '../screens/panic/panic.js';
import { showAciertosScreen } from '../screens/aciertos/aciertos.js';
import { showScoreScreen } from '../screens/score/score.js';
import { renderGlobalScores } from '../screens/global-scores/global-scores.js';

export const STATIC_SCREENS = ['screen-main-menu', 'screen-setup', 'screen-global-scores', 'screen-characters'];
export let navigationHistory = [{ id: 'screen-main-menu', data: {} }];

export function goBack() {
    if (navigationHistory.length > 1) {
        navigationHistory.pop();
        const previousScreen = navigationHistory[navigationHistory.length - 1];
        navigateTo(previousScreen.id, previousScreen.data || {}, false);
    } else {
        navigateTo('main-menu', {}, false);
    }
}

export function updateGlobalNav(screenId) {
    const globalNav = document.getElementById('global-nav');
    if (globalNav) {
        globalNav.style.display = (screenId === 'screen-main-menu' || screenId === 'main-menu' || screenId === 'screen-characters') ? 'none' : 'flex';
    }
    const settingsBtn = document.getElementById('btn-menu-settings');
    if (settingsBtn) settingsBtn.style.display = 'block';
}

export function navigateTo(screenId, data = {}, recordHistory = true) {
    clearTimer();
    clearPanicTimer();

    if (recordHistory) {
        const last = navigationHistory[navigationHistory.length - 1];
        if (!last || last.id !== screenId || JSON.stringify(last.data) !== JSON.stringify(data)) {
            navigationHistory.push({ id: screenId, data: data });
        }
    }

    updateGlobalNav(screenId);

    if (STATIC_SCREENS.includes(screenId) || screenId === 'main-menu') {
        const targetId = screenId === 'main-menu' ? 'screen-main-menu' : screenId;
        STATIC_SCREENS.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove('active');
        });

        if (UI.dynamicContent) UI.dynamicContent.innerHTML = '';

        const target = document.getElementById(targetId);
        if (target) target.classList.add('active');

        if (screenId === 'screen-setup') {
            renderPresetPlayers();
            renderPlayerList();
            const startBtn = document.getElementById('btn-start-game');
            if (startBtn) {
                startBtn.disabled = state.players.length < state.minPlayers;
                startBtn.classList.add('btn-flash-effect');
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
        }

        if (screenId === 'screen-global-scores') {
            renderGlobalScores();
        }
    } else {
        STATIC_SCREENS.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove('active');
        });
        showScreen(screenId, data);
        if (screenId === 'screen-categories') renderCategories();
    }
}

export function showScreen(screenId, data = {}) {
    if (screenId === 'screen-categories') {
        UI.dynamicContent.innerHTML = `
            <section id="screen-categories" class="screen active">
                <header>
                    <h2 class="glow-text small">Categorías</h2>
                    <p class="subtitle">Selecciona la temática</p>
                </header>
                
                <div class="category-grid" id="category-grid"></div>
                <div id="category-error" class="error-toast hidden"></div>
                <button id="btn-random-category" aria-label="Sorteo del Destino"></button>
            </section>
        `;
        // Needs import of pickRandomCategory from categories.js.. wait loop?
        // Let's resolve the circular dep: the DOM event can be set inside renderCategories!
        // Or we export pickRandomCategory. For now I'll dispatch a generic click.
        document.getElementById('btn-random-category').addEventListener('click', () => {
            import('../screens/categories/categories.js').then(module => {
                module.pickRandomCategory();
            });
        });
    } else if (screenId === 'screen-reveal') {
        const player = data.player;
        const playerRole = state.roles[data.index];
        const isImpostor = playerRole.isImpostor;
        const slug = player.toLowerCase().replace(/\s+/g, '');
        const frontImgPath = `assets/IMG/reveal/cards/inocente/${slug}.png`;
        const backImgPath = isImpostor ? `assets/IMG/reveal/cards/impostor/${slug}_impostor.png` : frontImgPath;
        const fallbackEmoji = state.playerAvatars[player] || '👤';

        // Escaping was tricky directly so I'll trust it's fine for simple strings or we inline escapeHTML
        const escapedPlayer = player.replace(/[&<>'"]/g, tag => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'}[tag] || tag));

        UI.dynamicContent.innerHTML = `
            <section id="screen-reveal" class="screen active reveal-screen">
                <div class="reveal-header">
                    <h2 class="reveal-player-name">${escapedPlayer}</h2>
                </div>
                <div class="reveal-card-scene">
                    <div class="reveal-card" id="reveal-card">
                        <div class="reveal-card__face reveal-card__front">
                            <img src="${frontImgPath}" alt="Carta" class="card-img" id="card-front-img" onerror="this.style.display='none'; document.getElementById('card-front-fallback').style.display='flex';">
                            <div class="card-fallback" id="card-front-fallback" style="display:none">
                                <span class="card-fallback-emoji">${fallbackEmoji}</span>
                            </div>
                            <div class="card-frame card-frame--inocente"></div>
                        </div>
                        <div class="reveal-card__face reveal-card__back">
                            <img src="${backImgPath}" alt="Reverso" class="card-img" onerror="this.style.display='none';">
                            ${isImpostor ? '' : `
                                <div class="reveal-word-overlay">
                                    <span class="reveal-word-text">${playerRole.word}</span>
                                </div>
                            `}
                            <div class="card-frame ${isImpostor ? 'card-frame--impostor' : 'card-frame--inocente'}"></div>
                        </div>
                    </div>
                </div>
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
        showTimerScreen(UI);
    } else if (screenId === 'screen-panic') {
        showRevealPanicScreen();
    } else if (screenId === 'screen-aciertos') {
        showAciertosScreen();
    } else if (screenId === 'screen-score') {
        showScoreScreen();
    }
}
