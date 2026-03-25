
export const state = {
    players: [],
    playerAvatars: {},
    avatarPool: ['🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🦄', '🐶', '🐱', '🐹', '🐭'],
    minPlayers: 3,
    selectedCategory: null,
    gameData: null,
    roles: [],
    impostorName: null,
    secretWord: null,
    scores: {},
    roundScores: {},
    roundReasons: {},
    lastCorrectVoters: [],
    usedWords: [],
    lastImpostor: null,
    categories: [
        { id: 'conceptos', name: 'Conceptos', icon: '💡' },
        { id: 'peliculas', name: 'Películas', icon: '🎬' },
        { id: 'lugares', name: 'Lugares', icon: '📍' },
        { id: 'refranes', name: 'Refranes', icon: '🗣️' },
        { id: 'acciones', name: 'Acciones', icon: '🎭' }
    ],
    globalRanking: JSON.parse(localStorage.getItem('dixit_global_ranking')) || {},
    characters: [
        { name: 'DC', slug: 'dc', desc: 'El ingenioso. Maestro de las palabras y arquitecto de ilusiones.' },
        { name: 'JAVI', slug: 'javi', desc: 'El sensato. Su mirada atraviesa el engaño con la calma del sabio.' },
        { name: 'AG', slug: 'ag', desc: 'La energía. Un torbellino de vitalidad que ilumina cada tablero.' },
        { name: 'ELI', slug: 'eli', desc: 'La ambiciosa. No se conforma con menos que la victoria perfecta.' },
        { name: 'JUAN', slug: 'juan', desc: 'Don de gentes. Su carisma es su mejor arma en el debate.' },
        { name: 'JUANI', slug: 'juani', desc: 'La artista. Crea mundos en cada carta que pone en juego.' },
        { name: 'IRENE', slug: 'irene', desc: 'La protectora. Guardiana de la justicia en medio del caos.' },
        { name: 'TINA', slug: 'tina', desc: 'La bailarina. Esquiva las sospechas con la gracia de un cisne.' },
        { name: 'DIEGO J', slug: 'diegoj', desc: 'El vendedor. Capaz de convencer al diablo de su propia fe.' },
        { name: 'SANTI', slug: 'santi', desc: 'El feliz. El alma de la partida, incluso bajo presión.' },
        { name: 'TRINI', slug: 'trini', desc: 'La viajera. Ha visto realidades que otros solo sueñan.' }
    ],
    currentCharacterIndex: 0,
    currentRole: 'INOCENTE'
};

export const PRESET_PLAYERS = ['DC', 'JAVI', 'AG', 'ELI', 'JUAN', 'JUANI', 'IRENE', 'TINA', 'DIEGO J', 'SANTI', 'TRINI'];

export const PLAYER_TITLES = {
    'DC': 'El ingenioso', 'JAVI': 'El sensato', 'AG': 'La energía', 'ELI': 'La ambiciosa',
    'JUAN': 'Don de gentes', 'JUANI': 'La artista', 'IRENE': 'La protectora', 'TINA': 'La bailarina',
    'DIEGO J': 'El vendedor', 'SANTI': 'El feliz', 'TRINI': 'La viajera'
};

export const UI = {
    mainContent: document.getElementById('main-content'),
    dynamicContent: document.getElementById('dynamic-content'),
    btnMenuNew: document.getElementById('btn-menu-new'),
    btnMenuScores: document.getElementById('btn-menu-scores'),
    btnMenuCharacters: document.getElementById('btn-menu-characters'),
    btnMenuRules: document.getElementById('btn-menu-rules'),
    btnMenuSettings: document.getElementById('btn-menu-settings'),
    setupScreen: document.getElementById('screen-setup'),
    playerNameInput: document.getElementById('player-name'),
    addPlayerBtn: document.getElementById('add-player'),
    playerList: document.getElementById('player-list'),
    startGameBtn: document.getElementById('btn-start-game'),
    // Elementos Pantalla Personajes
    charactersScreen: document.getElementById('screen-characters'),
    btnCharactersBack: document.getElementById('btn-characters-back'),
    characterNameDisplay: document.getElementById('character-name-display'),
    mainCharImg: document.getElementById('main-char-img'),
    charDescriptionText: document.getElementById('char-description-text'),
    currentRoleLabel: document.getElementById('current-role-label'),
    charCardFlip: document.getElementById('char-card-flip'),
    btnCharPrev: document.getElementById('btn-char-prev'),
    btnCharNext: document.getElementById('btn-char-next'),
    roleThumbs: document.querySelectorAll('.role-thumb-container')
};
