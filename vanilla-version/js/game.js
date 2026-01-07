// Game Logic

// Check if there's a winner
function checkWin(board, player) {
    const size = board.length;

    // Check rows
    for (let row = 0; row < size; row++) {
        if (allSame(board[row]) && board[row][0] === player) {
            gameState.currentGame.winningCells = board[row].map((_, col) => ({ row, col }));
            return true;
        }
    }

    // Check columns
    for (let col = 0; col < size; col++) {
        const column = board.map(row => row[col]);
        if (allSame(column) && column[0] === player) {
            gameState.currentGame.winningCells = column.map((_, row) => ({ row, col }));
            return true;
        }
    }

    // Check main diagonal
    const diagonal1 = board.map((row, i) => row[i]);
    if (allSame(diagonal1) && diagonal1[0] === player) {
        gameState.currentGame.winningCells = diagonal1.map((_, i) => ({ row: i, col: i }));
        return true;
    }

    // Check anti-diagonal
    const diagonal2 = board.map((row, i) => row[size - 1 - i]);
    if (allSame(diagonal2) && diagonal2[0] === player) {
        gameState.currentGame.winningCells = diagonal2.map((_, i) => ({ row: i, col: size - 1 - i }));
        return true;
    }

    return false;
}

// Check if board is full
function isBoardFull(board) {
    return board.every(row => row.every(cell => cell !== null));
}

// Make a move
async function makeMove(row, col) {
    const { board, currentPlayer, gameOver } = gameState.currentGame;

    // Validate move
    if (gameOver || board[row][col] !== null) {
        return false;
    }

    // Check if it's AI turn
    if (gameState.mode === 'ai' && currentPlayer === 'O') {
        return false;
    }

    // Place piece
    board[row][col] = currentPlayer;
    updateBoard();
    vibrate();

    // Check for win
    if (checkWin(board, currentPlayer)) {
        await delay(300);
        endGame(currentPlayer);
        return true;
    }

    // Check for draw
    if (isBoardFull(board)) {
        await delay(300);
        endGame(null);
        return true;
    }

    // Switch player
    gameState.currentGame.currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updatePlayerCards();

    // AI turn
    if (gameState.mode === 'ai' && game State.currentGame.currentPlayer === 'O') {
        await delay(500);
        await makeAIMove();
    }

    return true;
}

// AI makes its move
async function makeAIMove() {
    const move = getAIMove(gameState.currentGame.board);

    if (move) {
        await makeMove(move.row, move.col);
    }
}

// End game
function endGame(winner) {
    gameState.currentGame.gameOver = true;
    gameState.currentGame.winner = winner;

    // Update scores
    if (winner === 'X') {
        gameState.scores.x++;
    } else if (winner === 'O') {
        gameState.scores.o++;
    } else {
        gameState.scores.draws++;
    }

    saveState();

    // Show game over screen after delay
    setTimeout(() => {
        showGameOver();
    }, 1000);
}

// Reset game (keep scores)
function resetGame() {
    initBoard(gameState.boardSize);
    updateBoard();
    updatePlayerCards();
}

// Reset scores
function resetScores() {
    gameState.scores = { x: 0, o: 0, draws: 0 };
    saveState();
}
