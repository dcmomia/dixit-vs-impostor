import { state } from '../../core/state.js';
import { navigateTo } from '../../core/router.js';

/**
 * Ajusta el tamaño de fuente de la palabra secreta midiendo el espacio real.
 * Reduce el tamaño píxel a píxel hasta que el texto quepa en una sola línea.
 */
function adjustRevealWordFont() {
    const textEl = document.querySelector('.reveal-word-text');
    const container = document.querySelector('.reveal-word-overlay');
    if (!textEl || !container) return;

    // Empezamos desde un tamaño máximo (aprox 3.2rem)
    let fontSize = 52; 
    textEl.style.fontSize = fontSize + 'px';

    // Límites de seguridad ampliados: 95% del ancho y 80% del alto carta
    const maxWidth = container.clientWidth * 0.95;
    const maxHeight = container.clientHeight * 0.8;

    // Si el bloque de texto desborda por ancho (una palabra larga) o por alto (muchas líneas)
    // bajamos el tamaño hasta que encaje. Mínimo 14px para legibilidad.
    let iterations = 0;
    while ((textEl.scrollWidth > maxWidth || textEl.scrollHeight > maxHeight) && fontSize > 14 && iterations < 100) {
        fontSize -= 1;
        textEl.style.fontSize = fontSize + 'px';
        iterations++;
    }
}

export function setupRevealLogic(playerName, index) {
    const btnHold = document.getElementById('btn-reveal');
    const btnNext = document.getElementById('btn-next-player');
    const card = document.getElementById('reveal-card');
    const playerRole = state.roles[index];

    let hasRevealed = false;
    let revealTimeout = null;

    // Ajustar fuente al cargar (usamos un pequeño delay para asegurar que el DOM y fuentes estén listos)
    setTimeout(adjustRevealWordFont, 0);

    const reveal = () => {
        card.classList.add('is-flipped');

        if (playerRole.isImpostor) {
            if (revealTimeout) clearTimeout(revealTimeout);

            revealTimeout = setTimeout(() => {
                const screen = document.getElementById('screen-reveal');
                if (screen && card.classList.contains('is-flipped')) {
                    screen.classList.add('impostor-reveal-active');
                }
            }, 50); // Sincronizando con el inicio del giro
        }
    };

    const hide = () => {
        if (revealTimeout) {
            clearTimeout(revealTimeout);
            revealTimeout = null;
        }

        card.classList.remove('is-flipped');
        if (playerRole.isImpostor) {
            const screen = document.getElementById('screen-reveal');
            if (screen) screen.classList.remove('impostor-reveal-active');
        }

        if (!hasRevealed) {
            hasRevealed = true;
            btnNext.classList.remove('btn-locked');
            btnNext.classList.add('heartbeat');
            
            const hintBox = document.querySelector('.reveal-hold-hint');
            if (hintBox) hintBox.style.visibility = 'hidden';
        }
    };

    btnHold.onpointerdown = (e) => {
        if (e.cancelable) e.preventDefault();
        reveal();
    };
    btnHold.onpointerup = btnHold.onpointercancel = btnHold.onpointerleave = (e) => {
        if (e.cancelable) e.preventDefault();
        hide();
    };

    btnNext.onclick = () => {
        const nextIndex = index + 1;
        if (nextIndex < state.players.length) {
            navigateTo('screen-reveal', { player: state.players[nextIndex], index: nextIndex });
        } else {
            navigateTo('screen-timer');
        }
    };
}
