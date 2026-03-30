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
    const slug = startPlayer.toLowerCase().replace(/\s+/g, '');
    const objImagePath = `src/screens/timer/assets/starter/${slug}_obj.png`;

    // Intentamos cargar el objeto dinámico. Si no existe, el evento onerror lo elimina del DOM.
    const floatingObjectHTML = `<img src="${objImagePath}" class="floating-hero-obj" alt="Objeto del personaje" onerror="this.remove()">`;

    UI.dynamicContent.innerHTML = `
        <section id="screen-timer" class="screen active">
            <header>
                <img src="src/screens/timer/assets/title_empieza_turno.png" alt="Empieza el turno" class="timer-title-img">
            </header>
            
            <div class="starter-hero-panel">
                <img src="${starterImage}" alt="Empieza el turno: ${startPlayer}" class="starter-full-image">
                ${floatingObjectHTML}
            </div>
            
            <div class="timer-widget">
                <div class="countdown-orb">
                    <div id="countdown-display" class="timer-display">${formatTime(timeLeft)}</div>
                </div>
                
                <button id="btn-time-sub" class="btn-preset btn-preset--side btn-preset--left">-15s</button>
                <button id="btn-time-add" class="btn-preset btn-preset--side btn-preset--right">+15s</button>
            </div>

            <div class="bottom-action-container timer-active">
                <div class="floating-cards-wrapper">
                    <img src="src/screens/timer/assets/starter/cartas.png" alt="Cartas" class="floating-cards">
                </div>
                <button id="btn-all-ready" class="btn-parchment-action" aria-label="¡Cartas en la mesa!"></button>
            </div>
        </section>
    `;

    const display = document.getElementById('countdown-display');

    const updateDisplay = () => {
        if (timeLeft < 0) timeLeft = 0;
        display.textContent = formatTime(timeLeft);
        
        const timerWidget = document.querySelector('.timer-widget');
        const bottomContainer = document.querySelector('.bottom-action-container');

        if (timeLeft <= 10 && timeLeft > 0) {
            display.style.color = "var(--accent)";
            display.style.transform = "scale(1.1)";
            setTimeout(() => display.style.transform = "scale(1)", 200);
            if(timerWidget) timerWidget.classList.remove('timer-finished');
            if(bottomContainer) bottomContainer.classList.add('timer-active');
        } else if (timeLeft === 0) {
            display.style.color = "var(--primary)";
            if(timerWidget) timerWidget.classList.add('timer-finished');
            if(bottomContainer) bottomContainer.classList.remove('timer-active');
        } else {
            display.style.color = "var(--text)";
            if(timerWidget) timerWidget.classList.remove('timer-finished');
            if(bottomContainer) bottomContainer.classList.add('timer-active');
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
    document.querySelector('.countdown-orb').onclick = () => { timeLeft = 0; updateDisplay(); };

    document.getElementById('btn-all-ready').onclick = () => {
        if (currentTimerInterval) clearInterval(currentTimerInterval);
        navigateTo('screen-panic');
    };
}

export function clearTimer() {
    if (currentTimerInterval) clearInterval(currentTimerInterval);
}
