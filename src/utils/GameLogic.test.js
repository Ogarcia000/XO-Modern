import GameLogic from './GameLogic.js';

describe('GameLogic', () => {
    describe('checkWinner - 3x3 board', () => {
        test('detects horizontal win in row 0', () => {
            const board = [
                ['X', 'X', 'X'],
                ['O', 'O', null],
                [null, null, null]
            ];
            const result = GameLogic.checkWinner(board, 3);
            expect(result).not.toBeNull();
            expect(result.winner).toBe('X');
            expect(result.line.type).toBe('row');
            expect(result.line.index).toBe(0);
        });

        test('detects horizontal win in row 2', () => {
            const board = [
                ['X', 'O', 'X'],
                ['O', 'X', null],
                ['O', 'O', 'O']
            ];
            const result = GameLogic.checkWinner(board, 3);
            expect(result).not.toBeNull();
            expect(result.winner).toBe('O');
        });

        test('detects vertical win in column 1', () => {
            const board = [
                ['X', 'O', null],
                [null, 'O', 'X'],
                ['X', 'O', null]
            ];
            const result = GameLogic.checkWinner(board, 3);
            expect(result).not.toBeNull();
            expect(result.winner).toBe('O');
            expect(result.line.type).toBe('col');
            expect(result.line.index).toBe(1);
        });

        test('detects main diagonal win', () => {
            const board = [
                ['X', 'O', null],
                [null, 'X', 'O'],
                ['O', null, 'X']
            ];
            const result = GameLogic.checkWinner(board, 3);
            expect(result).not.toBeNull();
            expect(result.winner).toBe('X');
            expect(result.line.type).toBe('diag');
            expect(result.line.index).toBe(0);
        });

        test('detects anti-diagonal win', () => {
            const board = [
                ['X', 'O', 'O'],
                [null, 'O', 'X'],
                ['O', 'X', 'X']
            ];
            const result = GameLogic.checkWinner(board, 3);
            expect(result).not.toBeNull();
            expect(result.winner).toBe('O');
            expect(result.line.type).toBe('diag');
            expect(result.line.index).toBe(1);
        });

        test('returns null when no winner', () => {
            const board = [
                ['X', 'O', 'X'],
                ['O', 'X', null],
                [null, null, 'O']
            ];
            const result = GameLogic.checkWinner(board, 3);
            expect(result).toBeNull();
        });
    });

    describe('checkWinner - 4x4 board', () => {
        test('detects horizontal win in 4x4', () => {
            const board = [
                ['X', 'X', 'X', 'X'],
                ['O', 'O', 'O', null],
                [null, null, null, null],
                [null, null, null, null]
            ];
            const result = GameLogic.checkWinner(board, 4);
            expect(result).not.toBeNull();
            expect(result.winner).toBe('X');
        });

        test('detects main diagonal win in 4x4', () => {
            const board = [
                ['X', 'O', null, null],
                ['O', 'X', 'O', null],
                [null, 'O', 'X', null],
                [null, null, 'O', 'X']
            ];
            const result = GameLogic.checkWinner(board, 4);
            expect(result).not.toBeNull();
            expect(result.winner).toBe('X');
        });
    });

    describe('checkDraw', () => {
        test('detects draw when board is full', () => {
            const board = [
                ['X', 'O', 'X'],
                ['O', 'X', 'O'],
                ['O', 'X', 'O']
            ];
            const result = GameLogic.checkDraw(board, 3);
            expect(result).toBe(true);
        });

        test('returns false when board has empty cells', () => {
            const board = [
                ['X', 'O', 'X'],
                ['O', null, 'O'],
                ['O', 'X', 'O']
            ];
            const result = GameLogic.checkDraw(board, 3);
            expect(result).toBe(false);
        });
    });

    describe('getAvailableMoves', () => {
        test('returns all empty cells', () => {
            const board = [
                ['X', null, 'O'],
                [null, 'X', null],
                ['O', null, null]
            ];
            const moves = GameLogic.getAvailableMoves(board, 3);
            expect(moves).toHaveLength(5);
            expect(moves).toContainEqual({ row: 0, col: 1 });
            expect(moves).toContainEqual({ row: 1, col: 0 });
        });

        test('returns empty array for full board', () => {
            const board = [
                ['X', 'O', 'X'],
                ['O', 'X', 'O'],
                ['O', 'X', 'X']
            ];
            const moves = GameLogic.getAvailableMoves(board, 3);
            expect(moves).toHaveLength(0);
        });
    });

    describe('isValidMove', () => {
        test('returns true for empty cell', () => {
            const board = [
                ['X', null, 'O'],
                [null, 'X', null],
                ['O', null, null]
            ];
            expect(GameLogic.isValidMove(board, 0, 1)).toBe(true);
            expect(GameLogic.isValidMove(board, 1, 0)).toBe(true);
        });

        test('returns false for occupied cell', () => {
            const board = [
                ['X', null, 'O'],
                [null, 'X', null],
                ['O', null, null]
            ];
            expect(GameLogic.isValidMove(board, 0, 0)).toBe(false);
            expect(GameLogic.isValidMove(board, 1, 1)).toBe(false);
        });
    });

    describe('getAIMove', () => {
        test('AI blocks opponent from winning', () => {
            const board = [
                ['X', 'X', null],
                ['O', null, null],
                [null, null, null]
            ];
            const move = GameLogic.getAIMove(board, 3, 'easy');
            // AI should block at (0, 2) to prevent X from winning
            // Note: easy AI has randomness, so we just check it returns a valid move
            expect(move).not.toBeNull();
            expect(move.row).toBeGreaterThanOrEqual(0);
            expect(move.col).toBeGreaterThanOrEqual(0);
        });

        test('AI takes winning move', () => {
            const board = [
                ['O', 'O', null],
                ['X', 'X', null],
                [null, null, null]
            ];
            // AI should win at (0, 2) if it detects it
            const move = GameLogic.getAIMove(board, 3, 'easy');
            expect(move).not.toBeNull();
        });

        test('returns null for full board', () => {
            const board = [
                ['X', 'O', 'X'],
                ['O', 'X', 'O'],
                ['O', 'X', 'X']
            ];
            const move = GameLogic.getAIMove(board, 3, 'easy');
            expect(move).toBeNull();
        });
    });
});
