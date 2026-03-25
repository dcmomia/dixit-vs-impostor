import { UI, state } from './core/state.js';
import { audioManager } from './core/audio.js';
import { navigateTo, goBack } from './core/router.js';
import { addPlayer } from './screens/setup/setup.js';
import { showConfirm } from './core/utils.js';

document.addEventListener('DOMContentLoaded', () => {
    audioManager.init();
    setupEventListeners();
    requestWakeLock();

    document.addEventListener('visibilitychange', async () => {
        if (document.visibilityState === 'visible') {
            await requestWakeLock();
        }
    });
});

let wakeLock = null;
async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('✨ Pantalla bloqueada...');
        }
    } catch (err) {
        console.warn('No se pudo activar el Wake Lock:', err);
    }
}

function setupEventListeners() {
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

    UI.btnMenuNew.addEventListener('click', (e) => {
        createLiquidRipple(e, UI.btnMenuNew);

        const container = document.createElement('div');
        container.className = 'dandelion-container';
        document.body.appendChild(container);

        const rect = UI.btnMenuNew.getBoundingClientRect();
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

    UI.btnMenuCharacters.addEventListener('click', (e) => {
        createLiquidRipple(e, UI.btnMenuCharacters);
        initCharactersScreen();
        navigateTo('screen-characters');
        
        // Forzar visibilidad por si el router tiene algun delay o conflicto
        const screen = document.getElementById('screen-characters');
        if (screen) screen.classList.add('active');
    });

    // Eventos Pantalla Personajes
    UI.btnCharactersBack.addEventListener('click', () => {
        goBack();
    });

    UI.btnCharPrev.addEventListener('click', () => {
        state.currentCharacterIndex = (state.currentCharacterIndex - 1 + state.characters.length) % state.characters.length;
        updateCharacterDisplay();
    });

    UI.btnCharNext.addEventListener('click', () => {
        state.currentCharacterIndex = (state.currentCharacterIndex + 1) % state.characters.length;
        updateCharacterDisplay();
    });

    UI.charCardFlip.addEventListener('click', () => {
        UI.charCardFlip.classList.toggle('is-flipped');
    });

    UI.roleThumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            const newRole = thumb.dataset.role;
            state.currentRole = newRole;
            
            UI.roleThumbs.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            
            UI.currentRoleLabel.innerText = newRole;
            UI.charCardFlip.classList.remove('is-flipped');
            
            // Actualizar imagen al cambiar de rol
            updateCharacterDisplay();
        });
    });

    UI.btnMenuSettings.addEventListener('click', () => {
        const estado = audioManager.isMuted ? "REACTIVAR" : "SILENCIAR";
        const icon = audioManager.isMuted ? "🔊" : "🔇";

        showConfirm(`⚙️ AJUSTES DE AUDIOnn¿Deseas ${estado} ${icon} la melodía "Clockwork Garden Carnival"?`, () => {
            audioManager.toggleMute();
        });

        document.getElementById('modal-btn-cancel').classList.remove('hidden');
    });

    UI.addPlayerBtn.addEventListener('click', (e) => addPlayer(e));
    UI.playerNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addPlayer(e);
    });

    const btnBack = document.getElementById('global-nav')?.querySelector('.btn-nav-back') || document.getElementById('btn-global-back');
    const btnHome = document.getElementById('global-nav')?.querySelector('.btn-nav-home') || document.getElementById('btn-global-home');

    if (btnBack) btnBack.addEventListener('click', goBack);
    if (btnHome) btnHome.addEventListener('click', () => navigateTo('main-menu'));
}

/**
 * Inicializa la pantalla de personajes
 */
function initCharactersScreen() {
    // Seguridad: Si los thumbs no se capturaron bien al inicio (rareza de carga), re-intentar
    if (!UI.roleThumbs || UI.roleThumbs.length === 0) {
        UI.roleThumbs = document.querySelectorAll('.role-thumb-container');
        // Re-vincular eventos si fue necesario re-capturar
        UI.roleThumbs.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const newRole = thumb.dataset.role;
                state.currentRole = newRole;
                UI.roleThumbs.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                UI.currentRoleLabel.innerText = newRole;
                UI.charCardFlip.classList.remove('is-flipped');
                updateCharacterDisplay();
            });
        });
    }

    state.currentCharacterIndex = 0;
    state.currentRole = 'INOCENTE';
    
    // Resetear thumbs de roles
    UI.roleThumbs.forEach(t => {
        t.classList.remove('active');
        if (t.dataset.role === 'INOCENTE') t.classList.add('active');
    });
    updateCharacterDisplay();
}

/**
 * Actualiza la información visual del personaje actual empleando los rostros reales
 */
function updateCharacterDisplay() {
    const char = state.characters[state.currentCharacterIndex];
    UI.characterNameDisplay.innerText = char.name;
    
    // Rutas base para los rostros reales (Inocente e Impostor)
    const inocentePath = `src/screens/reveal/assets/cards/inocente/${char.slug}.png`;
    const impostorPath = `src/screens/reveal/assets/cards/impostor/${char.slug}_impostor.png`;

    // Asignar imagen principal según el rol seleccionado
    UI.mainCharImg.src = (state.currentRole === 'IMPOSTOR') ? impostorPath : inocentePath;
    UI.charDescriptionText.innerText = char.desc;
    UI.currentRoleLabel.innerText = state.currentRole;
    
    // Cambiar color del badge segun el rol
    if (state.currentRole === 'IMPOSTOR') {
        UI.currentRoleLabel.classList.add('is-impostor');
    } else {
        UI.currentRoleLabel.classList.remove('is-impostor');
    }
    
    // Animación suave de entrada
    UI.mainCharImg.style.opacity = '0';
    UI.mainCharImg.style.transform = 'scale(0.95)';
    setTimeout(() => {
        UI.mainCharImg.style.opacity = '1';
        UI.mainCharImg.style.transform = 'scale(1)';
    }, 50);

    // Actualizar las miniaturas inferiores con las variantes del personaje seleccionado
    UI.roleThumbs.forEach(thumb => {
        const img = thumb.querySelector('.role-thumb-img-node');
        if (img) {
            const role = thumb.dataset.role;
            // Mostramos la cara de impostor en el selector de impostor, y la normal en el resto
            img.src = (role === 'IMPOSTOR') ? impostorPath : inocentePath;
        }
    });
}
