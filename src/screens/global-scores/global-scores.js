import { state, PLAYER_TITLES } from '../../core/state.js';
import { escapeHTML } from '../../core/utils.js';

export function renderGlobalScores() {
    const list = document.getElementById('global-ranking-list');
    if (!list) return;

    const rankingArray = Object.entries(state.globalRanking).map(([name, stats]) => ({
        name,
        ...stats
    })).sort((a, b) => (b.points || 0) - (a.points || 0));

    list.innerHTML = rankingArray.map((player, index) => {
        const slug = player.name.toLowerCase().replace(/\s+/g, '');
        const imagePath = `src/core/assets/players/${slug}.png`;
        const fallbackEmoji = player.avatar || '👤';

        return `
            <div class="global-ranking-item">
                <div class="ranking-avatar-block">
                    <div class="ranking-avatar-frame" active-color="${(index % 6) + 1}">
                        <img src="${imagePath}" alt="${player.name}" onerror="this.outerHTML='<div class='avatar-fallback-container ranking-fallback'><span class='avatar-fallback-emoji'>${fallbackEmoji}</span></div>'">
                    </div>
                    <div class="ranking-player-name-container">
                        <span class="ranking-player-name">${escapeHTML(player.name)}</span>
                        <span class="ranking-player-title">${PLAYER_TITLES[player.name.toUpperCase()] || 'El Viajero'}</span>
                    </div>
                </div>

                <div class="ranking-stats-grid">
                    <div class="stat-box" data-stat="puesto">
                        <span class="stat-label">PUESTO</span>
                        <div class="stat-icon-container">
                            <img src="src/screens/global-scores/assets/icon_podio.png" class="stat-icon" alt="Podio">
                        </div>
                        <span class="stat-value">#${index + 1}</span>
                    </div>

                    <div class="stat-box" data-stat="partidas">
                        <span class="stat-label">JUGADAS</span>
                        <div class="stat-icon-container">
                            <img src="src/screens/global-scores/assets/icon_cartas.png" class="stat-icon" alt="Cartas">
                        </div>
                        <span class="stat-value">${player.played || 0}</span>
                    </div>

                    <div class="stat-box" data-stat="puntos">
                        <span class="stat-label">PUNTOS</span>
                        <div class="stat-icon-container">
                            <img src="src/screens/global-scores/assets/icon_orbe.png" class="stat-icon" alt="Orbe">
                        </div>
                        <span class="stat-value">${player.points || 0}</span>
                    </div>

                    <div class="stat-box" data-stat="ganadas">
                        <span class="stat-label">GANADAS</span>
                        <div class="stat-icon-container">
                            <img src="src/screens/score/assets/btn_corona.png" class="stat-icon" alt="Corona">
                        </div>
                        <span class="stat-value">${player.wins || 0}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    if (rankingArray.length === 0) {
        list.innerHTML = '<div class="ranking-empty-msg" style="color:#d4af37; text-align:center; padding:2rem; font-weight:bold; width:100%; font-size: 1.1rem; text-shadow: 0 2px 4px rgba(0,0,0,0.8);">El orbe de cristal aún no muestra leyendas... <br> ¡Comienza una partida para forjar tu destino!</div>';
    }
}
