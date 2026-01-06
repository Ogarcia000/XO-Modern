import Phaser from 'phaser';
import Board from '../objects/Board.js';
import Piece from '../objects/Piece.js';
import GameLogic from '../utils/GameLogic.js';
import UIHelper, { SPACING, TOUCH_TARGETS } from '../utils/UIHelper.js';

export default class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
    }

    preload() {
        // No textures needed - pieces use Graphics rendering
        console.log('⚙️ Preload phase - pieces will be rendered as Graphics');
    }

    create() {
        const { width, height } = this.cameras.main;
        const gameState = window.gameState;

        // Background
        this.add.rectangle(0, 0, width * 2, height * 2,
            gameState.darkMode ? 0x0a0a0a : 0x1a1a2e).setOrigin(0);

        // Game state
        this.currentPlayer = 'X';
        this.gameOver = false;
        this.board = new Board(this, gameState.boardSize);
        this.pieces = [];

        // UI Elements
        this.createUI();

        // IMPROVED INPUT: Use scene-level pointer detection instead of per-cell zones
        // This is more reliable and avoids depth/layering issues
        this.input.on('pointerdown', this.handleBoardClick, this);

        // Enable pointer over/out for hover effects
        this.input.on('pointermove', this.handleBoardHover, this);

        console.log('✅ Game scene created - click detection active');
    }

    createUI() {
        const { width, height } = this.cameras.main;
        const gameState = window.gameState;

        // Get skin colors
        const colors = UIHelper.getSkinColors(gameState.skin);

        // Player X Card - Left side
        this.playerXCard = UIHelper.createPlayerCard(
            this,
            width * 0.25,
            SPACING.lg + 90,
            'X',
            {
                isActive: this.currentPlayer === 'X',
                score: gameState.scores.x,
                skinColors: colors,
                playerName: gameState.playerXName || ''
            }
        );
        this.playerXCard.setDepth(25);

        // Player O Card - Right side
        this.playerOCard = UIHelper.createPlayerCard(
            this,
            width * 0.75,
            SPACING.lg + 90,
            'O',
            {
                isActive: this.currentPlayer === 'O',
                score: gameState.scores.o,
                skinColors: colors,
                playerName: gameState.playerOName || ''
            }
        );
        this.playerOCard.setDepth(25);

        // Empates (Draws) display - Center between cards
        this.drawsCard = UIHelper.createInfoCard(
            this,
            width / 2,
            SPACING.lg + 30,
            `Empates: ${gameState.scores.draws}`,
            {
                fontSize: '16px',
                fontWeight: '400',
                padding: SPACING.sm,
                backgroundColor: 0x0f0f23,
                backgroundAlpha: 0.6,
                borderColor: 0x888888,
                borderWidth: 1
            }
        );
        this.drawsCard.setDepth(25);

        // Reset button - Bottom center with icon
        const resetBtn = UIHelper.createModernButton(
            this,
            width / 2,
            height - SPACING.lg,
            '↻ REINICIAR',
            () => this.resetGame(),
            {
                width: 200,
                height: TOUCH_TARGETS.comfortable,
                fontSize: '20px',
                backgroundColor: 0xd63031,
                hoverColor: 0xe74c3c
            }
        );
        resetBtn.container.setDepth(25);

        // Menu button - Bottom left with icon
        const menuBtn = UIHelper.createModernButton(
            this,
            SPACING.md + 70,
            height - SPACING.lg,
            '◄ MENÚ',
            () => {
                // Reset all scores when returning to menu
                window.gameState.scores.x = 0;
                window.gameState.scores.o = 0;
                window.gameState.scores.draws = 0;
                this.scene.start('MenuStep1');
            },
            {
                width: 140,
                height: TOUCH_TARGETS.comfortable,
                fontSize: '18px',
                backgroundColor: 0x636e72,
                hoverColor: 0x7c8689
            }
        );
        menuBtn.container.setDepth(25);

        // Settings button (bottom-right)
        const settingsBtn = UIHelper.createSettingsButton(
            this,
            width - SPACING.md - 70,
            height - SPACING.lg,
            () => this.settingsPanel.open()
        );
        settingsBtn.setDepth(25);

        // Settings panel
        this.settingsPanel = UIHelper.createSettingsPanel(this);
    }

    // NEW: Scene-level click detection - calculates cell from pointer position
    handleBoardClick(pointer) {
        if (this.gameOver) {
            console.log('⚠️ Game is over, ignoring click');
            return;
        }

        // Check if it's AI's turn
        if (window.gameState.mode === 'ai' && this.currentPlayer === 'O') {
            console.log('⚠️ AI turn, ignoring human click');
            return;
        }

        const cell = this.board.getCellFromPointer(pointer.x, pointer.y);

        if (cell) {
            console.log(`🎯 Click detected at cell (${cell.row}, ${cell.col})`);
            this.onCellClick(cell.row, cell.col);
        } else {
            console.log('⚠️ Click outside board area');
        }
    }

    // NEW: Hover effect for visual feedback
    handleBoardHover(pointer) {
        if (this.gameOver) return;

        const cell = this.board.getCellFromPointer(pointer.x, pointer.y);
        this.board.updateHover(cell);
    }

    onCellClick(row, col) {
        if (this.gameOver) return;

        // Check if it's AI's turn
        if (window.gameState.mode === 'ai' && this.currentPlayer === 'O') {
            return;
        }

        this.makeMove(row, col);
    }

    makeMove(row, col) {
        if (!GameLogic.isValidMove(this.board.boardData, row, col)) {
            console.log(`❌ Invalid move at (${row}, ${col}) - cell occupied or out of bounds`);
            return;
        }

        console.log(`✅ Placing ${this.currentPlayer} at (${row}, ${col})`);

        // Place piece on board
        const success = this.board.setPiece(row, col, this.currentPlayer);

        if (!success) {
            console.log('❌ Failed to set piece on board');
            return;
        }

        // Create visual piece with animation
        const pos = this.board.getCellPosition(row, col);
        const piece = new Piece(
            this,
            pos.x,
            pos.y,
            this.currentPlayer,
            window.gameState.skin,
            this.board.cellSize
        );
        this.pieces.push(piece);

        console.log(`🎨 Piece sprite created at (${pos.x}, ${pos.y})`);

        // Play sound
        if (window.gameState.soundEnabled) {
            // Sound would play here if we had actual audio files
        }

        // Check for winner
        const winInfo = GameLogic.checkWinner(this.board.boardData, this.board.size);
        if (winInfo) {
            this.handleWin(winInfo);
            return;
        }

        // Check for draw
        if (GameLogic.checkDraw(this.board.boardData, this.board.size)) {
            this.handleDraw();
            return;
        }

        // Switch player
        this.switchPlayer();

        // AI move
        if (window.gameState.mode === 'ai' && this.currentPlayer === 'O' && !this.gameOver) {
            this.time.delayedCall(500, () => this.makeAIMove());
        }
    }

    makeAIMove() {
        if (this.gameOver) return;

        const move = GameLogic.getAIMove(this.board.boardData, this.board.size, 'easy');
        if (move) {
            this.makeMove(move.row, move.col);
        }
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';

        // Update player cards
        this.playerXCard.setActive(this.currentPlayer === 'X');
        this.playerOCard.setActive(this.currentPlayer === 'O');
    }

    handleWin(winInfo) {
        this.gameOver = true;
        const winner = winInfo.winner;

        // Update scores
        if (winner === 'X') {
            window.gameState.scores.x++;
            this.playerXCard.updateScore(window.gameState.scores.x);
        } else {
            window.gameState.scores.o++;
            this.playerOCard.updateScore(window.gameState.scores.o);
        }

        // Highlight winning line
        this.board.highlightWinningLine(winInfo);

        // Create celebration particles
        const { width, height } = this.cameras.main;
        const colors = UIHelper.getSkinColors(window.gameState.skin);
        const particleColor = winner === 'X' ? colors.x : colors.o;

        for (let i = 0; i < 5; i++) {
            this.time.delayedCall(i * 100, () => {
                UIHelper.createParticles(
                    this,
                    Phaser.Math.Between(100, width - 100),
                    Phaser.Math.Between(100, height - 100),
                    particleColor,
                    30
                );
            });
        }

        // Play victory sound
        if (window.gameState.soundEnabled) {
            // Victory sound would play here
        }

        // Show game over screen
        this.time.delayedCall(2000, () => {
            this.scene.start('GameOver', { winner });
        });
    }

    handleDraw() {
        this.gameOver = true;
        window.gameState.scores.draws++;

        // Update draws display
        this.drawsCard.updateText(`Empates: ${window.gameState.scores.draws}`);

        this.time.delayedCall(1500, () => {
            this.scene.start('GameOver', { winner: null });
        });
    }

    resetGame() {
        // Clear pieces
        this.pieces.forEach(piece => piece.destroy());
        this.pieces = [];

        // Clear board
        this.board.clear();

        // Reset game state
        this.currentPlayer = 'X';
        this.gameOver = false;

        // Update player cards
        this.playerXCard.setActive(true);
        this.playerOCard.setActive(false);
    }
}
