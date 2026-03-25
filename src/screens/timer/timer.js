import { state } from '../../core/state.js';
import { getRandomSecure } from '../../core/utils.js';
import { navigateTo } from '../../core/router.js';

let currentTimerInterval = null;

export function showTimerScreen(UI) {
    const startIndex = getRandomSecure(state.players.length);
    const startPlayer = state.players[startIndex];
    let timeLeft = 90;

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const getStarterImagePath = (name) => {
        const slug = name.toLowerCase().replace(/\s+/g, '');
        return `src/screens/timer/assets/starter/${slug}_start.png`;
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
                
                <button id="btn-time-sub" class="btn-preset btn-preset--side btn-preset--left">-15s</button>
                <button id="btn-time-add" class="btn-preset btn-preset--side btn-preset--right">+15s</button>
            </div>

            <div class="bottom-action-container">
                <button id="btn-all-ready" class="btn-parchment-action" aria-label="¡Cartas en la mesa!"></button>
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

    document.getElementById('btn-time-add').onclick = () => { timeLeft += 15; updateDisplay(); };
    document.getElementById('btn-time-sub').onclick = () => { timeLeft -= 15; updateDisplay(); };

    document.getElementById('btn-all-ready').onclick = () => {
        if (currentTimerInterval) clearInterval(currentTimerInterval);
        navigateTo('screen-panic');
    };
}

export function clearTimer() {
    if (currentTimerInterval) clearInterval(currentTimerInterval);
}
