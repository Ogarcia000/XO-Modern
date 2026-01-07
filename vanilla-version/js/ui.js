// UI Controller

// Navigate to view
function navigate ToView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });

    // Show target view
    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) {
        targetView.classList.add('active');
        gameState.currentView = viewName;
    }
}

// Update board display
function updateBoard() {
    const boardEl = document.getElementById('board');
    const { board } = gameState.currentGame;
    const size = board.length;

    // Set CSS variable for grid size
    boardEl.style.setProperty('--board-size', size);

    // Clear board
    boardEl.innerHTML = '';

    // Create cells
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;

            const value = board[row][col];
            if (value) {
                cell.textContent = value;
                cell.classList.add('filled', `cell-${value.toLowerCase()}`);
            }

            // Check if winning cell
            const isWinningCell = gameState.currentGame.winningCells.some(
                c => c.row === row && c.col === col
            );
            if (isWinningCell) {
                cell.classList.add('winner');
            }

            // Add click listener
            cell.addEventListener('click', () => {
                makeMove(row, col);
            });

            // Add touch listener for better mobile support
            cell.addEventListener('touchend', (e) => {
                e.preventDefault();
                makeMove(row, col);
            }, { passive: false });

            boardEl.appendChild(cell);

            // Animate cell appearance
            cell.style.animation = `scaleIn ${150 + (row * size + col) * 30}ms ease forwards`;
        }
    }
}

// Update player cards
function updatePlayerCards() {
    const xCard = document.getElementById('player-x-card');
    const oCard = document.getElementById('player-o-card');
    const { currentPlayer } = gameState.currentGame;

    // Update active state
    xCard.classList.toggle('active', currentPlayer === 'X');
    oCard.classList.toggle('active', currentPlayer === 'O');

    // Update symbols
    xCard.querySelector('.player-symbol').textContent = 'X';
    oCard.querySelector('.player-symbol').textContent = 'O';

    // Update colors
    xCard.style.color = 'var(--color-x)';
    oCard.style.color = 'var(--color-o)';

    // Update names
    xCard.querySelector('.player-name').textContent = getPlayerName('X');
    oCard.querySelector('.player-name').textContent = getPlayerName('O');

    // Update scores
    xCard.querySelector('.player-score').textContent = `★ ${gameState.scores.x}`;
    oCard.querySelector('.player-score').textContent = `★ ${gameState.scores.o}`;

    // Update draws
    const drawsEl = document.querySelector('.draws-count');
    if (drawsEl) {
        drawsEl.textContent = `Empates: ${gameState.scores.draws}`;
    }
}

// Show game over screen
function showGameOver() {
    const { winner } = gameState.currentGame;
    const messageEl = document.getElementById('winner-message');

    if (winner) {
        const winnerName = getPlayerName(winner);
        messageEl.textContent = `¡${winnerName} Gana!`;
        messageEl.style.color = winner === 'X' ? 'var(--color-x)' : 'var(--color-o)';
    } else {
        messageEl.textContent = '¡Empate!';
        messageEl.style.color = 'var(--text-secondary)';
    }

    // Update scores display
    document.getElementById('final-score-x').textContent = gameState.scores.x;
    document.getElementById('final-score-o').textContent = gameState.scores.o;
    document.getElementById('final-score-draws').textContent = gameState.scores.draws;

    navigateToView('gameover');
}

// Show settings panel
function showSettings() {
    const panel = document.getElementById('settings-panel');
    panel.classList.add('active');

    // Update values
    document.getElementById('player-x-name').value = gameState.playerXName;
    document.getElementById('player-o-name').value = gameState.playerOName;
    updateDarkModeButton();
}

// Hide settings panel
function hideSettings() {
    const panel = document.getElementById('settings-panel');
    panel.classList.remove('active');

    // Save names
    gameState.playerXName = document.getElementById('player-x-name').value;
    gameState.playerOName = document.getElementById('player-o-name').value;
    saveState();

    // Update if in game
    if (gameState.currentView === 'game') {
        updatePlayerCards();
    }
}

// Toggle dark mode
function toggleDarkMode() {
    gameState.darkMode = !gameState.darkMode;
    applyTheme();
    updateDarkModeButton();
    saveState();
    vibrate();
}

// Update dark mode button
function updateDarkModeButton() {
    const btn = document.getElementById('dark-mode-toggle');
    const icon = btn.querySelector('.toggle-icon');
    const text = btn.querySelector('.toggle-text');

    if (gameState.darkMode) {
        icon.textContent = '☀️';
        text.textContent = 'Modo Claro';
    } else {
        icon.textContent = '🌙';
        text.textContent = 'Modo Oscuro';
    }
}

// Start new game
function startNewGame() {
    initBoard(gameState.boardSize);
    navigateToView('game');
    updateBoard();
    updatePlayerCards();
}
