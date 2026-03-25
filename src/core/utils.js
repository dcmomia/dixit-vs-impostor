
import { state, PLAYER_TITLES, PRESET_PLAYERS } from './state.js';

export function getAvatarHTML(name, sizeClass = '') {
    const fallbackEmoji = state.playerAvatars[name] || '👤';
    const slug = name.toLowerCase().replace(/\s+/g, '');
    const imagePath = `src/core/assets/players/${slug}.png`;
    return `<div class="avatar-box ${sizeClass}">
                <img src="${imagePath}" alt="${name}" onerror="this.outerHTML='<span class='avatar-emoji ${sizeClass}'>${fallbackEmoji}</span>'">
            </div>`;
}

export function getSetupAvatarHTML(name) {
    const fallbackEmoji = state.playerAvatars[name] || '🐰';
    const slug = name.toLowerCase().replace(/\s+/g, '');
    const imagePath = `src/core/assets/players/${slug}.png`;
    return `
        <div class="avatar-frame">
            <img src="${imagePath}" alt="${name}" onerror="this.outerHTML='<div class='avatar-fallback-container'><span class='avatar-fallback-emoji'>${fallbackEmoji}</span></div>'">
            <div class="star-dust"></div>
        </div>
    `;
}

export function getHeroAvatarHTML(name) {
    const fallbackEmoji = state.playerAvatars[name] || '👤';
    const slug = name.toLowerCase().replace(/\s+/g, '');
    const imagePath = `src/core/assets/players/${slug}.png`;
    return `<div class="hero-avatar">
                <img src="${imagePath}" alt="Avatar de ${name}" onerror="this.outerHTML='<span class='hero-avatar-emoji'>${fallbackEmoji}</span>'">
            </div>`;
}

export function getCardImagePath(name, type = 'Inocente') {
    const filename = name.toLowerCase().replace(/\s+/g, '');
    return type === 'Impostor'
        ? `src/screens/reveal/assets/cards/impostor/${filename}_impostor.png`
        : `src/screens/reveal/assets/cards/inocente/${filename}.png`;
}

export function escapeHTML(str) {
    return str.replace(/[&<>'"]/g,
        tag => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;',
            "'": '&#39;', '"': '&quot;'
        }[tag] || tag)
    );
}

export function getRandomSecure(max) {
    if (window.crypto && window.crypto.getRandomValues) {
        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        return array[0] % max;
    }
    return Math.floor(Math.random() * max);
}

export function showConfirm(message, onConfirm) {
    const modal = document.getElementById('modal-container');
    const msg = document.getElementById('modal-message');
    const btnConfirm = document.getElementById('modal-btn-confirm');
    const btnCancel = document.getElementById('modal-btn-cancel');

    btnCancel.classList.remove('hidden');
    msg.innerText = message;
    modal.classList.remove('hidden');

    btnConfirm.onclick = () => {
        modal.classList.add('hidden');
        onConfirm();
    };
    btnCancel.onclick = () => {
        modal.classList.add('hidden');
    };
}

export function showAstralToast(message) {
    const existing = document.querySelector('.astral-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'astral-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('active'), 10);
    setTimeout(() => {
        toast.classList.remove('active');
        setTimeout(() => toast.remove(), 500);
    }, 2500);
}

export function createStarDust(x, y) {
    const container = document.getElementById('app-container') || document.body;
    let containerRect = { left: 0, top: 0 };
    if (container.id === 'app-container') containerRect = container.getBoundingClientRect();
    const localX = x - containerRect.left;
    const localY = y - containerRect.top;

    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'stardust-particle';
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${localX}px`;
        particle.style.top = `${localY}px`;

        const destinationX = (Math.random() - 0.5) * 100;
        const destinationY = (Math.random() - 0.5) * 100;

        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${destinationX}px, ${destinationY}px) scale(0)`, opacity: 0 }
        ], {
            duration: 800 + Math.random() * 400,
            easing: 'cubic-bezier(0, .9, .57, 1)',
            delay: Math.random() * 100
        }).onfinish = () => particle.remove();
        container.appendChild(particle);
    }
}
