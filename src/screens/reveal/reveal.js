import { state } from '../../core/state.js';
import { navigateTo } from '../../core/router.js';

export function setupRevealLogic(playerName, index) {
    const btnHold = document.getElementById('btn-reveal');
    const btnNext = document.getElementById('btn-next-player');
    const card = document.getElementById('reveal-card');
    const playerRole = state.roles[index];

    let hasRevealed = false;
    let revealTimeout = null;

    const reveal = () => {
        card.classList.add('is-flipped');
        
        if (playerRole.isImpostor) {
            // Cancelar cualquier timeout previo
            if (revealTimeout) clearTimeout(revealTimeout);
            
            // Retrasar el cambio de fondo para que ocurra al final del giro (0.65s en CSS)
            revealTimeout = setTimeout(() => {
                const screen = document.getElementById('screen-reveal');
                // Solo aplicar si la carta sigue girada (usuario mantiene pulsado)
                if (screen && card.classList.contains('is-flipped')) {
                    screen.classList.add('impostor-reveal-active');
                }
            }, 600);
        }
    };

    const hide = () => {
        // Limpiar el timeout si el usuario suelta antes de tiempo
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
