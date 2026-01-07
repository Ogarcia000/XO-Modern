// Utility Functions

// Vibrate on mobile (if supported)
function vibrate(duration = 50) {
    if ('vibrate' in navigator) {
        navigator.vibrate(duration);
    }
}

// Get player display name
function getPlayerName(player) {
    if (gameState.mode === 'ai') {
        return player === 'X' ? 'Tú' : 'IA';
    }

    if (player === 'X' && gameState.playerXName) {
        return gameState.playerXName;
    }

    if (player === 'O' && gameState.playerOName) {
        return gameState.playerOName;
    }

    return `Jugador ${player}`;
}

// Delay utility
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Check if all cells in array have same value (and not null)
function allSame(arr) {
    return arr.every(cell => cell !== null && cell === arr[0]);
}

// Generate unique ID
function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Clamp number between min and max
function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

// Random number between min and max (inclusive)
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Shuffle array
function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Check if device is mobile
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Apply theme
function applyTheme() {
    document.body.setAttribute('data-skin', gameState.skin);
    document.body.classList.toggle('dark-mode', gameState.darkMode);
}
