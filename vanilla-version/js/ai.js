// Simple AI for Tic Tac Toe

// Get AI move
function getAIMove(board) {
    const size = board.length;

    // 1. Try to win
    const winMove = findWinningMove(board, 'O');
    if (winMove) return winMove;

    // 2. Block player from winning
    const blockMove = findWinningMove(board, 'X');
    if (blockMove) return blockMove;

    // 3. Take center if available (for 3x3 and 5x5)
    if (size % 2 === 1) {
        const center = Math.floor(size / 2);
        if (board[center][center] === null) {
            return { row: center, col: center };
        }
    }

    // 4. Take a corner if available
    const corners = [
        [0, 0], [0, size - 1],
        [size - 1, 0], [size - 1, size - 1]
    ];
    const availableCorners = corners.filter(([r, c]) => board[r][c] === null);
    if (availableCorners.length > 0) {
        const [row, col] = availableCorners[randomInt(0, availableCorners.length - 1)];
        return { row, col };
    }

    // 5. Take any available cell
    return getRandomMove(board);
}

// Find winning move for player
function findWinningMove(board, player) {
    const size = board.length;

    // Check each empty cell
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (board[row][col] === null) {
                // Try this move
                board[row][col] = player;

                // Check if it wins
                if (checkWin(board, player)) {
                    board[row][col] = null; // Undo
                    return { row, col };
                }

                board[row][col] = null; // Undo
            }
        }
    }

    return null;
}

// Get random valid move
function getRandomMove(board) {
    const size = board.length;
    const available = [];

    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (board[row][col] === null) {
                available.push({ row, col });
            }
        }
    }

    if (available.length === 0) return null;

    return available[randomInt(0, available.length - 1)];
}
