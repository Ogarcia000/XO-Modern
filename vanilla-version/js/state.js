// Global Game State
const gameState = {
    // Navigation
    currentView: 'menu',

    // Settings
    skin: 'classic',
    mode: 'human',
    boardSize: 3,
    darkMode: false,
    playerXName: '',
    playerOName: '',

    // Scores
    scores: {
        x: 0,
        o: 0,
        draws: 0
    },

    // Current Game
    currentGame: {
        board: [],
        currentPlayer: 'X',
        gameOver: false,
        winner: null,
        winningCells: []
    }
};

// Initialize board
function initBoard(size) {
    gameState.currentGame.board = Array(size).fill(null).map(() => Array(size).fill(null));
    gameState.currentGame.currentPlayer = 'X';
    gameState.currentGame.gameOver = false;
    gameState.currentGame.winner = null;
    gameState.currentGame.winningCells = [];
}

// Save to localStorage
function saveState() {
    try {
        localStorage.setItem('xo-modern-state', JSON.stringify({
            skin: gameState.skin,
            darkMode: gameState.darkMode,
            playerXName: gameState.playerXName,
            playerOName: gameState.playerOName,
            scores: gameState.scores
        }));
    } catch (e) {
        console.warn('Could not save state:', e);
    }
}

// Load from localStorage
function loadState() {
    try {
        const saved = localStorage.getItem('xo-modern-state');
        if (saved) {
            const data = JSON.parse(saved);
            gameState.skin = data.skin || 'classic';
            gameState.darkMode = data.darkMode || false;
            gameState.playerXName = data.playerXName || '';
            gameState.playerOName = data.playerOName || '';
            gameState.scores = data.scores || { x: 0, o: 0, draws: 0 };
        }
    } catch (e) {
        console.warn('Could not load state:', e);
    }
}
