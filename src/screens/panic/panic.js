import { state, UI } from '../../core/state.js';
import { escapeHTML } from '../../core/utils.js';
import { navigateTo } from '../../core/router.js';

let panicInterval = null;

export function showRevealPanicScreen() {
    UI.dynamicContent.innerHTML = `
        <section id="screen-panic" class="screen active" style="display: flex; flex-direction: column; justify-content: center; height: 100%;">
            
            <!-- FASE 1: ESPERA (Piedra rúnica con luz giratoria) -->
            <div id="panic-phase-1" style="height: 100%; display: flex; align-items: center; justify-content: center; position: relative; overflow: visible;">
                <div class="panic-light-wrap">
                    <div class="btn-dreamy--panic pulse-card" style="position: relative; z-index: 1;"></div>
                    <img src="src/screens/panic/assets/btn_luz_reveal.png" class="panic-magic-light" alt="Luz mágica">
                </div>
            </div>

            <!-- FASE 2 y 3: PANICO Y DEBATE -->
            <div id="panic-phase-2" class="hidden" style="text-align: center; display: flex; flex-direction: column; height: 100%; justify-content: space-around; box-sizing: border-box; padding: 2vh 0;">
                
                <!-- Contenedor Superior (Palabra centrada en caja) -->
                <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%;">
                    <div class="secret-word-box">
                        <h2 class="shamanic-glyph">${escapeHTML(state.secretWord)}</h2>
                    </div>
                </div>
                
                <!-- Contenedor Central (Cuenta atrás O Botón Votar) -->
                <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%;">
                    <div id="panic-countdown" class="panic-number" style="margin: 0;">
                        <img src="src/screens/panic/assets/cuenta_atras/5.png" alt="5">
                    </div>
                    <div id="panic-debate-ui" class="hidden" style="display: flex; align-items: center; justify-content: center; width: 100%;">
                        <button id="btn-to-vote" class="btn-confirm-votos-action">
                            <img src="src/screens/score/assets/btn_confirmar_votos.png" alt="Confirmar" style="width: 250px; max-width: 70vw;">
                        </button>
                    </div>
                </div>
            </div>
            
        </section>
    `;

    // Función interna para ajustar el tamaño de la palabra secreta (soporta refranes multilínea)
    const adjustSecretWordFontSize = () => {
        const wordEl = document.querySelector('.shamanic-glyph');
        const boxEl = document.querySelector('.secret-word-box');
        if (!wordEl || !boxEl) return;

        // Reset inicial para permitir recalcular
        wordEl.style.fontSize = ''; 
        
        let fontSize = parseFloat(window.getComputedStyle(wordEl).fontSize);
        const minFontSize = 15; 
        
        // Definimos límites de seguridad (92% del contenedor)
        const maxW = boxEl.offsetWidth * 0.92;
        const maxH = boxEl.offsetHeight * 0.92;

        const isOverflowing = () => {
            // Evaluamos tanto el ancho como el alto real del contenido
            return wordEl.scrollWidth > maxW || wordEl.scrollHeight > maxH;
        };

        // Reducimos el tamaño de la fuente iterativamente hasta que encaje
        while (isOverflowing() && fontSize > minFontSize) {
            fontSize -= 2;
            wordEl.style.fontSize = fontSize + 'px';
        }
    };

    document.getElementById('panic-phase-1').onclick = () => {
        document.getElementById('screen-panic').classList.add('revealed');
        document.getElementById('panic-phase-1').classList.add('hidden');
        document.getElementById('panic-phase-2').classList.remove('hidden');

        // Ajustar tamaño de palabra tras hacer visible el contenedor
        adjustSecretWordFontSize();

        const countdownEl = document.getElementById('panic-countdown');
        let panicTime = 5;

        countdownEl.classList.add('heartbeat'); 

        if (panicInterval) clearInterval(panicInterval);
        panicInterval = setInterval(() => {
            panicTime--;
            if (panicTime > 0) {
                countdownEl.innerHTML = `<img src="src/screens/panic/assets/cuenta_atras/${panicTime}.png" alt="${panicTime}">`;
                void countdownEl.offsetWidth;
            } else {
                clearInterval(panicInterval);
                navigateTo('screen-aciertos');
            }
        }, 1000);
    };
}

export function clearPanicTimer() {
    if (panicInterval) clearInterval(panicInterval);
}
