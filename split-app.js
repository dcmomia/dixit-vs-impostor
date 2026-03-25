const fs = require('fs');
const appJs = fs.readFileSync('src/app.js', 'utf8');

// The strategy is to extract the functions and variables using regex or substring and write them into the new module files.
// However, doing exact extraction with regex for a 1400 line file is very hard to make robust in one go.
// A simpler robust way is to provide the full new file contents exactly as they should be built.

function extractBlock(startStr, endStr) {
    const start = appJs.indexOf(startStr);
    if (start === -1) return '';
    const end = endStr ? appJs.indexOf(endStr, start) : appJs.length;
    if (end === -1) return appJs.substring(start);
    return appJs.substring(start, end);
}

// Empezamos a extraer:
const stateBlock = extractBlock('const state = {', '/**\n * Genera el HTML');
// Limpiamos const state a export const state
const stateJs = `
${stateBlock.replace('const state =', 'export const state =')
    .replace('const PRESET_PLAYERS', 'export const PRESET_PLAYERS')
    .replace('const PLAYER_TITLES', 'export const PLAYER_TITLES')}
export const UI = {
    mainContent: document.getElementById('main-content'),
    dynamicContent: document.getElementById('dynamic-content'),
    btnMenuNew: document.getElementById('btn-menu-new'),
    btnMenuScores: document.getElementById('btn-menu-scores'),
    btnMenuRules: document.getElementById('btn-menu-rules'),
    btnMenuSettings: document.getElementById('btn-menu-settings'),
    setupScreen: document.getElementById('screen-setup'),
    playerNameInput: document.getElementById('player-name'),
    addPlayerBtn: document.getElementById('add-player'),
    playerList: document.getElementById('player-list'),
    startGameBtn: document.getElementById('btn-start-game')
};
`.trim();

fs.mkdirSync('src/core', { recursive: true });
fs.writeFileSync('src/core/state.js', stateJs);
console.log('Created src/core/state.js');

// Now creating utils.js
// getAvatarHTML, getSetupAvatarHTML, getHeroAvatarHTML, getCardImagePath, escapeHTML, createStardust, showConfirm, showAstralToast
const utilsBlock1 = extractBlock('/**\n * Genera el HTML', '// Selectores');
const utilsBlock2 = extractBlock('    // Utilidad XSS', '// Lógica de selección'); // we will just match up to the end or custom
// Actually, I should just use writeFileSync manually with the content since generating via AST/Regex matching is brittle in a single script without seeing the exact output. We will just log 'Done!' and I will do it differently.
