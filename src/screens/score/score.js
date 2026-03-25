import { state, UI, PLAYER_TITLES } from '../../core/state.js';
import { getAvatarHTML, escapeHTML, showAstralToast, showConfirm } from '../../core/utils.js';
import { navigateTo } from '../../core/router.js';

export function showScoreScreen() {
    const sortedPlayers = [...state.players].sort((a, b) => (state.scores[b] || 0) - (state.scores[a] || 0));

    const getPlayerRoleText = (name) => {
        const playerRoleObj = state.roles.find(r => r.name === name);
        if (playerRoleObj && playerRoleObj.isImpostor) return 'El Impostor';
        return PLAYER_TITLES[name.toUpperCase()] || 'Participante Astral';
    };

    UI.dynamicContent.innerHTML = `
        <section id="screen-score" class="screen score-screen astral-score-screen active">
            
            <header class="astral-header">
                <img src="src/screens/score/assets/btn_marcadores.png" alt="Marcadores" class="astral-title-img">
            </header>

            <div class="astral-score-list">
                ${sortedPlayers.map((name, index) => {
        const delta = state.roundScores[name] || 0;
        const deltaText = delta > 0 ? `+${delta}` : `+0`;
        const slugId = name.toLowerCase().replace(/s+/g, '-');
        const roleText = getPlayerRoleText(name);
        
        let rankClass = "astral-rank-base";
        let rankIcon = "";
        let borderClass = "astral-item-base";
        let isLast = index === sortedPlayers.length - 1;
        
        if (index === 0) {
            rankClass = "astral-rank-1";
            borderClass = "astral-item-gold";
        } else if (index === 1) {
            rankClass = "astral-rank-2";
            borderClass = "astral-item-silver";
        } else if (index === 2 && !isLast) {
            rankClass = "astral-rank-3";
            borderClass = "astral-item-bronze";
        }

        if (isLast && index > 0) {
            rankClass = "astral-rank-last";
            borderClass = "astral-item-red";
        }

        const isFirst = index === 0;
        const isImpostor = !!(state.roles.find(r => r.name === name && r.isImpostor));
        
        let extraIcons = "";
        if (isFirst) extraIcons += `<img src="src/screens/score/assets/btn_corona.png" class="astral-crown-badge" alt="Corona">`;
        if (isImpostor) extraIcons += `<img src="src/screens/score/assets/btn_daga.png" class="astral-dagger-badge" alt="Daga">`;

        if (isImpostor) {
            borderClass = "astral-item-impostor";
        }

        return `
                    <div class="astral-score-item ${borderClass}">
                        <div class="astral-rank-number ${rankClass}">
                            ${extraIcons}
                            ${(rankClass === "astral-rank-1")
                                ? `<img src="src/screens/score/assets/btn_pos_1.svg" class="astral-rank-img" alt="1">
                                   <span class="rank-number-overlay rank-1-blue">1</span>`
                                : (rankClass === "astral-rank-2")
                                    ? `<img src="src/screens/score/assets/btn_pos_2.svg" class="astral-rank-img" alt="2">
                                       <span class="rank-number-overlay rank-2-silver">2</span>`
                                    : (rankClass === "astral-rank-3" && !isLast)
                                        ? `<img src="src/screens/score/assets/btn_pos_3.svg" class="astral-rank-img" alt="3">
                                           <span class="rank-number-overlay rank-3-bronze">3</span>`
                                        : (rankClass === "astral-rank-last")
                                            ? `<img src="src/screens/score/assets/btn_pos_last.svg" class="astral-rank-img" alt="Último">
                                               <span class="rank-number-overlay rank-last-ruby">${index + 1}</span>`
                                        : (rankClass === "astral-rank-base")
                                            ? `<img src="src/screens/score/assets/btn_pos_cualquiera.svg" class="astral-rank-img" alt="Medalla">
                                               <span class="rank-number-overlay">${index + 1}</span>`
                                            : (index + 1)}
                        </div>
                        
                        <div class="astral-avatar-wrapper">
                            ${getAvatarHTML(name, 'astral-avatar')}
                        </div>
                        
                        <div class="astral-player-info">
                            <span class="astral-player-name">${escapeHTML(name)}</span>
                            <span class="astral-player-role">${roleText}</span>
                        </div>
                        
                        <div class="astral-delta-pts ${delta > 0 ? 'delta-positive' : ''}" 
                             data-reason="${escapeHTML(state.roundReasons[name] || '')}" 
                             title="Click para ver razón">
                            ${deltaText}
                        </div>
                        
                        <div class="astral-score-controls">
                            <button class="btn-score-mod astral-mod" data-action="minus" data-player="${escapeHTML(name)}">-</button>
                            
                            <div class="astral-total-pts">
                                <span id="score-val-${slugId}">${state.scores[name] || 0}</span>
                            </div>
                            
                            <button class="btn-score-mod astral-mod" data-action="plus" data-player="${escapeHTML(name)}">+</button>
                        </div>
                    </div>
                `}).join('')}
            </div>

            <div class="astral-footer-actions">
                <button id="btn-exit-game" class="btn-astral-action" aria-label="Finalizar Partida"><span>FINALIZAR PARTIDA</span></button>
                <button id="btn-next-round" class="btn-astral-action primary-astral" aria-label="Nueva Ronda"><span>NUEVA RONDA</span></button>
                <button id="btn-reset-scores" class="btn-astral-action" aria-label="Resetear Puntos"><span>RESETEAR MARCADORES</span></button>
            </div>
        </section>
    `;

    const settingsBtn = document.getElementById('btn-menu-settings');
    if (settingsBtn) settingsBtn.style.display = 'none';

    document.querySelectorAll('.btn-score-mod').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const player = e.target.dataset.player;
            const action = e.target.dataset.action;
            const playerSlug = player.toLowerCase().replace(/s+/g, '-');
            let currentScore = state.scores[player] || 0;

            if (action === 'plus') currentScore++;
            else if (action === 'minus') currentScore--;

            state.scores[player] = currentScore;
            document.getElementById('score-val-' + playerSlug).textContent = currentScore;
        });
    });

    document.querySelectorAll('.astral-delta-pts').forEach(delta => {
        delta.style.cursor = 'pointer';
        delta.addEventListener('click', (e) => {
            const reason = e.target.dataset.reason;
            if (reason) {
                showAstralToast(reason);
            }
        });
    });

    document.getElementById('btn-next-round').onclick = () => {
        navigateTo('screen-categories');
    };

    document.getElementById('btn-reset-scores').onclick = () => {
        showConfirm("¿Seguro que quieres resetear todos los puntos?", () => {
            state.players.forEach(p => state.scores[p] = 0);
            showScoreScreen();
        });
    };

    document.getElementById('btn-exit-game').onclick = () => {
        showConfirm("¿Volver al menú principal? Se guardarán los puntos de esta partida.", () => {
            const sortedPlayers = [...state.players].sort((a, b) => (state.scores[b] || 0) - (state.scores[a] || 0));
            state.players.forEach(name => {
                if (!state.globalRanking[name]) {
                    state.globalRanking[name] = { played: 0, points: 0, wins: 0, avatar: state.playerAvatars[name] || '👤' };
                }
                state.globalRanking[name].played += 1;
            });
            const podium = sortedPlayers.slice(0, 3);
            podium.forEach((name, idx) => {
                const bonus = [5, 3, 1][idx];
                state.globalRanking[name].points += bonus;
                if (idx === 0) state.globalRanking[name].wins += 1;
            });
            localStorage.setItem('dixit_global_ranking', JSON.stringify(state.globalRanking));

            UI.dynamicContent.innerHTML = '';
            
            // Note: Mutating state object directly in ES6 modules may require using an exposed modifier function,
            // but since 'state' is exported as a const object, mutating its properties is allowed.
            state.gameData = null;
            state.scores = {};
            state.players = [];
            state.playerAvatars = {};
            state.avatarPool = ['🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🦄', '🐶', '🐱', '🐹', '🐭'];

            navigateTo('screen-main-menu');
        });
    };
}
