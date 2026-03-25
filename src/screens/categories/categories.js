import { state, UI } from '../../core/state.js';
import { getRandomSecure } from '../../core/utils.js';
import { navigateTo } from '../../core/router.js';

let isStartingRound = false;

export function renderCategories() {
    const grid = document.getElementById('category-grid');
    if (!grid) return;
    grid.innerHTML = '';

    state.categories.forEach(cat => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.style.backgroundImage = `url('src/screens/categories/assets/cat_${cat.id}.png')`;
        card.setAttribute('aria-label', cat.name);
        card.onclick = () => selectCategory(cat.id);
        grid.appendChild(card);
    });
}

export async function selectCategory(catId) {
    if (isStartingRound) return;
    isStartingRound = true;

    state.selectedCategory = catId;
    const errorToast = document.getElementById('category-error');

    if (!state.gameData) {
        try {
            const response = await fetch('data/words.json');
            if (!response.ok) throw new Error("No se pudo cargar la base de datos.");
            state.gameData = await response.json();
            if (errorToast) errorToast.classList.add('hidden');
        } catch (e) {
            console.error("Error cargando palabras:", e);
            if (errorToast) {
                errorToast.textContent = "Error: Verifica que words.json existe en /data. Usa un servidor local.";
                errorToast.classList.remove('hidden');
            }
            isStartingRound = false;
            return;
        }
    }

    startRoleAssignment();
    isStartingRound = false;
}

export function startRoleAssignment() {
    const errorToast = document.getElementById('category-error');
    if (errorToast) errorToast.classList.add('hidden');

    const words = state.gameData[state.selectedCategory];
    let availableWords = words.filter(w => !state.usedWords.includes(w));

    if (availableWords.length === 0) {
        if (errorToast) {
            errorToast.textContent = "¡Se han agotado las palabras de esta categoría! Reseteando base interna...";
            errorToast.classList.remove('hidden');
        }
        state.usedWords = [];
        availableWords = words;
    }

    const wordIndex = getRandomSecure(availableWords.length);
    state.secretWord = availableWords[wordIndex];
    state.usedWords.push(state.secretWord);

    let impostorIndex = getRandomSecure(state.players.length);
    let chosenImpostor = state.players[impostorIndex];

    if (chosenImpostor === state.lastImpostor && state.players.length > 3) {
        impostorIndex = getRandomSecure(state.players.length);
        chosenImpostor = state.players[impostorIndex];
    }

    state.impostorName = chosenImpostor;
    state.lastImpostor = state.impostorName;

    state.roles = state.players.map((name) => ({
        name,
        isImpostor: name === state.impostorName,
        word: name === state.impostorName ? "¡ERES EL IMPOSTOR!" : state.secretWord
    }));

    navigateTo('screen-reveal', { player: state.players[0], index: 0 });
}

export function pickRandomCategory() {
    const random = state.categories[Math.floor(Math.random() * state.categories.length)];
    selectCategory(random.id);
}
