import { state, UI } from '../../core/state.js';
import { getSetupAvatarHTML, escapeHTML } from '../../core/utils.js';
import { navigateTo } from '../../core/router.js';

export function showAciertosScreen() {
    const playersExceptImpostor = state.players.filter(p => !state.roles.find(r => r.name === p)?.isImpostor);

    UI.dynamicContent.innerHTML = `
        <section id="screen-aciertos" class="screen score-setup-screen active">
            <div class="aciertos-header">
                <img src="src/screens/score/assets/btn_acertarimpostor.png" alt="Acierta al Impostor" class="img-header-aciertos">
            </div>

            <div class="aciertos-grid-container">
                <div class="aciertos-grid grid-count-${playersExceptImpostor.length}">
                    ${playersExceptImpostor.map(name => `
                        <div class="vote-avatar-card" data-name="${escapeHTML(name)}" role="button" aria-pressed="false" tabindex="0">
                            <div class="vote-avatar-frame-wrapper">
                                ${getSetupAvatarHTML(name)}
                            </div>
                            <div class="vote-player-name">${escapeHTML(name)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="aciertos-footer">
                <button id="btn-confirm-aciertos" class="btn-confirm-votos-action">
                    <img src="src/screens/score/assets/btn_confirmar_votos.png" alt="Confirmar">
                </button>
            </div>
        </section>
    `;

    const cards = document.querySelectorAll('.vote-avatar-card');
    cards.forEach(card => {
        card.onclick = () => {
            const isSelected = card.classList.toggle('is-selected');
            card.setAttribute('aria-pressed', isSelected);
        };
    });

    document.getElementById('btn-confirm-aciertos').onclick = () => {
        const selectedCards = document.querySelectorAll('.vote-avatar-card.is-selected');
        const correctVoters = [];
        selectedCards.forEach(card => {
            correctVoters.push(card.dataset.name);
        });

        state.lastCorrectVoters = correctVoters;
        handleRoundEnd({
            impostorFound: true,
            correctVoters: state.lastCorrectVoters
        });
        navigateTo('screen-score');
    };
}

export function handleRoundEnd({ impostorFound, correctVoters = [] }) {
    state.roundScores = {};
    state.roundReasons = {};

    state.players.forEach(p => {
        if (!state.scores[p]) state.scores[p] = 0;
        state.roundScores[p] = 0;
        state.roundReasons[p] = "";
    });

    const totalPlayers = state.players.length;
    const innocentCount = totalPlayers - 1;
    const numAcertantes = correctVoters.length;

    if (!impostorFound || numAcertantes === 0) {
        state.scores[state.impostorName] += 6;
        state.roundScores[state.impostorName] = 6;
        state.roundReasons[state.impostorName] = "Invicto (Nadie acierta)";
    } else {
        if (numAcertantes === 1) {
            state.scores[state.impostorName] += 4;
            state.roundScores[state.impostorName] = 4;
            state.roundReasons[state.impostorName] = "Descubierto por 1";

            state.scores[correctVoters[0]] += 6;
            state.roundScores[correctVoters[0]] = 6;
            state.roundReasons[correctVoters[0]] = "Único Acertante";
        } else if (numAcertantes < innocentCount / 2) {
            state.scores[state.impostorName] += 2;
            state.roundScores[state.impostorName] = 2;
            state.roundReasons[state.impostorName] = "Descubierto por minoría";

            correctVoters.forEach(name => {
                state.scores[name] += 4;
                state.roundScores[name] = 4;
                state.roundReasons[name] = "Acierto (Minoría)";
            });
        } else if (numAcertantes === innocentCount / 2) {
            state.scores[state.impostorName] += 1;
            state.roundScores[state.impostorName] = 1;
            state.roundReasons[state.impostorName] = "Descubierto por la mitad";

            correctVoters.forEach(name => {
                state.scores[name] += 3;
                state.roundScores[name] = 3;
                state.roundReasons[name] = "Acierto (Empate)";
            });
        } else if (numAcertantes > innocentCount / 2 && numAcertantes < innocentCount) {
            state.scores[state.impostorName] += 0;
            state.roundScores[state.impostorName] = 0;
            state.roundReasons[state.impostorName] = "Descubierto por mayoría";

            correctVoters.forEach(name => {
                state.scores[name] += 2;
                state.roundScores[name] = 2;
                state.roundReasons[name] = "Acierto (Mayoría)";
            });
        } else if (numAcertantes === innocentCount) {
            state.scores[state.impostorName] -= 1;
            state.roundScores[state.impostorName] = -1;
            state.roundReasons[state.impostorName] = "Pillado por TODOS";

            correctVoters.forEach(name => {
                state.scores[name] += 2;
                state.roundScores[name] = 2;
                state.roundReasons[name] = "Acierto Unánime";
            });
        }
    }
}
