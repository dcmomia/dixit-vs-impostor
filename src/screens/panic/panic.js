import { state, UI } from '../../core/state.js';
import { escapeHTML } from '../../core/utils.js';
import { navigateTo } from '../../core/router.js';

let isNavigating = false;
let panicInterval = null;

export function showRevealPanicScreen() {
    isNavigating = false;
    clearPanicTimer();
    
    UI.dynamicContent.innerHTML = `
        <section id="screen-panic" class="screen active" style="display: flex; flex-direction: column; height: 100%; position: relative;">
            
            <!-- FASE 1: ESPERA (Piedra rúnica con luz giratoria) -->
            <div id="panic-phase-1" style="flex: 1; display: flex; align-items: center; justify-content: center; position: relative; overflow: visible;">
                <div class="panic-light-wrap">
                    <div class="btn-dreamy--panic pulse-card" style="position: relative; z-index: 1;"></div>
                    <img src="src/screens/panic/assets/btn_luz_reveal.png" class="panic-magic-light" alt="Luz mágica">
                </div>
            </div>

            <!-- FASE 2: DEBATE (Manual + Cuenta atrás visual) -->
            <div id="panic-phase-2" class="hidden" style="position: absolute; inset: 0; text-align: center; display: flex; flex-direction: column; justify-content: flex-start; padding-top: 15vh; box-sizing: border-box;">
                
                <!-- Palabra elevada -->
                <div style="width: 100%; display: flex; justify-content: center; align-items: center; z-index: 10;">
                    <div class="secret-word-box">
                        <h2 class="shamanic-glyph">${escapeHTML(state.secretWord)}</h2>
                    </div>
                </div>

                <!-- Orbe de Cuenta Atrás Visual (Posicionamiento absoluto para centrado perfecto en el tótem) -->
                <div id="panic-countdown-container" style="position: absolute; top: 69%; left: 50%; transform: translate(-50%, -50%); z-index: 5; display: flex; justify-content: center; align-items: center; width: 200px; height: 200px; pointer-events: none;">
                    <img id="panic-countdown-img" src="src/screens/panic/assets/cuenta_atras/5.png" alt="5" style="width: 180px; height: 180px; object-fit: contain; filter: drop-shadow(0 0 25px rgba(0,255,255,0.5));">
                </div>
                
                <!-- Banda de Legibilidad Inferior -->
                <div class="panic-footer-hint" style="
                    position: absolute; 
                    bottom: 0; 
                    left: 0; 
                    width: 100%; 
                    height: 140px; 
                    background: linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.4) 50%, transparent);
                    display: flex; 
                    flex-direction: column; 
                    justify-content: flex-end; 
                    align-items: center; 
                    padding-bottom: 5vh; 
                    pointer-events: none;
                    z-index: 10;
                ">
                    <div style="font-family: 'Fredoka', sans-serif; color: #fff; text-transform: uppercase; letter-spacing: 2.5px; font-size: 0.95rem; font-weight: 600; text-shadow: 0 2px 10px rgba(0,0,0,1);">
                        Pulsar pantalla para terminar debate
                    </div>
                </div>
            </div>
            
        </section>
    `;

    // Función de escalado dinámico de la palabra
    const adjustSecretWordFontSize = () => {
        const wordEl = document.querySelector('.shamanic-glyph');
        const boxEl  = document.querySelector('.secret-word-box');
        if (!wordEl || !boxEl) return;

        wordEl.style.setProperty('font-size', '4.5rem', 'important');
        const boxRect = boxEl.getBoundingClientRect();
        const maxW = boxRect.width  * 0.88;
        const maxH = boxRect.height * 0.88;
        const minFontSize = 12;

        let fontSize = parseFloat(window.getComputedStyle(wordEl).fontSize);
        const isOverflowing = () => wordEl.scrollWidth > maxW || wordEl.scrollHeight > maxH;

        while (isOverflowing() && fontSize > minFontSize) {
            fontSize -= 1;
            wordEl.style.setProperty('font-size', fontSize + 'px', 'important');
        }
    };

    const runCountdownVisualOnly = () => {
        let timeLeft = 5;
        const imgEl = document.getElementById('panic-countdown-img');
        if (!imgEl) return;

        panicInterval = setInterval(() => {
            timeLeft--;
            if (timeLeft < 1) {
                clearInterval(panicInterval);
                // Mantenemos el '1' en pantalla para marcar el final visual de la espera
                imgEl.src = `src/screens/panic/assets/cuenta_atras/1.png`;
                imgEl.style.opacity = '0.5'; // Atenuamos para indicar que terminó
                return;
            }
            imgEl.src = `src/screens/panic/assets/cuenta_atras/${timeLeft}.png`;
            
            // Micro-animación de pulso con cada número
            imgEl.style.transform = 'scale(1.1)';
            setTimeout(() => {
                if (imgEl) imgEl.style.transform = 'scale(1)';
            }, 150);

        }, 1000);
    };

    document.getElementById('panic-phase-1').onclick = () => {
        document.getElementById('screen-panic').classList.add('revealed');
        document.getElementById('panic-phase-1').classList.add('hidden');
        document.getElementById('panic-phase-2').classList.remove('hidden');

        requestAnimationFrame(() => adjustSecretWordFontSize());

        // La cuenta atrás no arranca hasta hacer tap en la caja de la palabra secreta
        const secretBoxContainer = document.querySelector('.secret-word-box');
        let countdownStarted = false;

        if (secretBoxContainer) {
            secretBoxContainer.onpointerdown = (e) => {
                e.stopPropagation(); // Prevenir que el tap sobre la caja envíe a la  pantalla siguiente
                if (!countdownStarted) {
                    countdownStarted = true;
                    runCountdownVisualOnly();
                    
                    // Micro-pull feedback para constatar el click
                    secretBoxContainer.style.transition = 'transform 0.1s ease';
                    secretBoxContainer.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        secretBoxContainer.style.transform = 'scale(1)';
                    }, 100);
                }
            };
        }

        // El narrador decide cuándo avanzar pulsando en el resto de la pantalla (fuera de la caja)
        document.getElementById('screen-panic').onpointerdown = () => {
            if (!isNavigating) {
                clearPanicTimer();
                isNavigating = true;
                navigateTo('screen-aciertos');
            }
        };
    };
}

export function clearPanicTimer() {
    if (panicInterval) {
        clearInterval(panicInterval);
        panicInterval = null;
    }
}
