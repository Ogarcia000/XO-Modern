// Main App Initialization

// Initialize app
function initApp() {
    console.log('🎮 XO Modern - Vanilla JS Edition');

    // Load saved state
    loadState();
    applyTheme();

    // Setup event listeners
    setupEventListeners();

    // Navigate to menu
    navigateToView('menu');
}

// Setup all event listeners
function setupEventListeners() {
    // Action buttons (using event delegation)
    document.addEventListener('click', handleActions);

    // Skin selection
    document.querySelectorAll('[data-skin]').forEach(card => {
        card.addEventListener('click', () => {
            gameState.skin = card.dataset.skin;
            applyTheme();
            saveState();
            vibrate();
            navigateToView('mode');
        });
    });

    // Mode selection
    document.querySelectorAll('[data-mode]').forEach(card => {
        card.addEventListener('click', () => {
            gameState.mode = card.dataset.mode;
            vibrate();
            navigateToView('size');
        });
    });

    // Size selection
    document.querySelectorAll('[data-size]').forEach(card => {
        card.addEventListener('click', () => {
            gameState.boardSize = parseInt(card.dataset.size);
            vibrate();
            startNewGame();
        });
    });

    // Settings panel inputs
    const playerXInput = document.getElementById('player-x-name');
    const playerOInput = document.getElementById('player-o-name');

    if (playerXInput) {
        playerXInput.addEventListener('blur', () => {
            gameState.playerXName = playerXInput.value;
            saveState();
        });
    }

    if (playerOInput) {
        playerOInput.addEventListener('blur', () => {
            gameState.playerOName = playerOInput.value;
            saveState();
        });
    }

    // Dark mode toggle
    document.getElementById('dark-mode-toggle')?.addEventListener('click', toggleDarkMode);

    // Prevent default touch behavior on game elements
    document.querySelectorAll('.btn, .card, .cell').forEach(el => {
        el.addEventListener('touchstart', (e) => {
            // Allow touch but prevent default to avoid double-tap zoom
            e.currentTarget.style.opacity = '0.8';
        }, { passive: true });

        el.addEventListener('touchend', (e) => {
            e.currentTarget.style.opacity = '1';
        }, { passive: true });
    });
}

// Handle action buttons
function handleActions(e) {
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (!action) return;

    vibrate();

    switch (action) {
        case 'start':
            navigateToView('skin');
            break;

        case 'back':
            handleBack();
            break;

        case 'settings':
            showSettings();
            break;

        case 'close-settings':
            hideSettings();
            break;

        case 'menu':
            resetScores();
            navigateToView('menu');
            break;

        case 'play-again':
            resetGame();
            navigateToView('game');
            break;
    }
}

// Handle back navigation
function handleBack() {
    const { currentView } = gameState;

    const backMap = {
        'skin': 'menu',
        'mode': 'skin',
        'size': 'mode',
        'game': 'menu',
        'gameover': 'menu'
    };

    const targetView = backMap[currentView] || 'menu';

    if (targetView === 'menu') {
        resetScores();
    }

    navigateToView(targetView);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Handle visibility change (pause/resume)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        saveState();
    }
});

// Handle before unload
window.addEventListener('beforeunload', () => {
    saveState();
});

// Expose for debugging (development only)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.gameState = gameState;
    window.debug = {
        resetScores,
        resetGame,
        makeMove,
        checkWin,
        getAIMove
    };
}
