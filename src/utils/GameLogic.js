// Game logic for win detection, AI, and move validation

export default class GameLogic {
    static checkWinner(board, size = 3) {
        // Check rows
        for (let row = 0; row < size; row++) {
            let first = board[row][0];
            if (first === null) continue;

            let win = true;
            for (let col = 1; col < size; col++) {
                if (board[row][col] !== first) {
                    win = false;
                    break;
                }
            }
            if (win) {
                return {
                    winner: first,
                    line: { type: 'row', index: row }
                };
            }
        }

        // Check columns
        for (let col = 0; col < size; col++) {
            let first = board[0][col];
            if (first === null) continue;

            let win = true;
            for (let row = 1; row < size; row++) {
                if (board[row][col] !== first) {
                    win = false;
                    break;
                }
            }
            if (win) {
                return {
                    winner: first,
                    line: { type: 'col', index: col }
                };
            }
        }

        // Check main diagonal (top-left to bottom-right)
        let first = board[0][0];
        if (first !== null) {
            let win = true;
            for (let i = 1; i < size; i++) {
                if (board[i][i] !== first) {
                    win = false;
                    break;
                }
            }
            if (win) {
                return {
                    winner: first,
                    line: { type: 'diag', index: 0 }
                };
            }
        }

        // Check anti-diagonal (top-right to bottom-left)
        first = board[0][size - 1];
        if (first !== null) {
            let win = true;
            for (let i = 1; i < size; i++) {
                if (board[i][size - 1 - i] !== first) {
                    win = false;
                    break;
                }
            }
            if (win) {
                return {
                    winner: first,
                    line: { type: 'diag', index: 1 }
                };
            }
        }

        return null;
    }

    static checkDraw(board, size = 3) {
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                if (board[row][col] === null) {
                    return false;
                }
            }
        }
        return true;
    }

    static getAvailableMoves(board, size = 3) {
        const moves = [];
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                if (board[row][col] === null) {
                    moves.push({ row, col });
                }
            }
        }
        return moves;
    }

    static getAIMove(board, size = 3, difficulty = 'easy') {
        const availableMoves = this.getAvailableMoves(board, size);

        if (availableMoves.length === 0) {
            return null;
        }

        if (difficulty === 'easy') {
            // Easy AI: 70% random, 30% try to win or block
            if (Math.random() < 0.7) {
                // Random move
                return availableMoves[Math.floor(Math.random() * availableMoves.length)];
            }
        }

        // Try to win
        for (let move of availableMoves) {
            const testBoard = JSON.parse(JSON.stringify(board));
            testBoard[move.row][move.col] = 'O';
            if (this.checkWinner(testBoard, size)?.winner === 'O') {
                return move;
            }
        }

        // Try to block opponent
        for (let move of availableMoves) {
            const testBoard = JSON.parse(JSON.stringify(board));
            testBoard[move.row][move.col] = 'X';
            if (this.checkWinner(testBoard, size)?.winner === 'X') {
                return move;
            }
        }

        // Take center if available
        const center = Math.floor(size / 2);
        if (board[center][center] === null) {
            return { row: center, col: center };
        }

        // Take corners
        const corners = [
            { row: 0, col: 0 },
            { row: 0, col: size - 1 },
            { row: size - 1, col: 0 },
            { row: size - 1, col: size - 1 }
        ];

        for (let corner of corners) {
            if (board[corner.row][corner.col] === null) {
                return corner;
            }
        }

        // Random move as fallback
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    static isValidMove(board, row, col) {
        return board[row] && board[row][col] === null;
    }
}
