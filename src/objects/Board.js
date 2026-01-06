import Phaser from 'phaser';
import UIHelper, { MODERN_COLORS, SPACING } from '../utils/UIHelper.js';

export default class Board {
    constructor(scene, size = 3) {
        this.scene = scene;
        this.size = size;
        this.boardData = [];
        this.cells = [];
        this.cellSize = 100;
        this.gridGraphics = null;
        this.winLineGraphics = null;

        // Initialize empty board
        for (let i = 0; i < size; i++) {
            this.boardData[i] = [];
            this.cells[i] = [];
            for (let j = 0; j < size; j++) {
                this.boardData[i][j] = null;
                this.cells[i][j] = null;
            }
        }

        this.calculatePositions();
        this.createGrid();
    }

    calculatePositions() {
        const { width, height } = this.scene.cameras.main;

        // Reserve space for UI elements at top and bottom
        const topReserved = SPACING.lg + 180 + SPACING.md; // Player cards height + spacing
        const bottomReserved = SPACING.lg + 56 + SPACING.md; // Button height + margins

        // Calculate available space for board
        const availableHeight = height - topReserved - bottomReserved;
        const availableWidth = width * 0.9; // Use 90% of width

        // Calculate cell size - use 70% of available space for prominence
        const maxBoardSize = Math.min(availableWidth, availableHeight) * 0.9;
        this.cellSize = maxBoardSize / this.size;

        // Calculate board dimensions
        this.boardWidth = this.cellSize * this.size;
        this.boardHeight = this.cellSize * this.size;

        // Center board in available space
        this.startX = (width - this.boardWidth) / 2;
        this.startY = topReserved + (availableHeight - this.boardHeight) / 2;
    }

    createGrid() {
        if (this.gridGraphics) {
            this.gridGraphics.destroy();
        }

        this.gridGraphics = this.scene.add.graphics();
        const colors = UIHelper.getSkinColors(window.gameState.skin);

        // Thicker lines for better visibility
        this.gridGraphics.lineStyle(5, colors.grid, 0.85);

        // Set depth to ensure grid is visible and interactive
        this.gridGraphics.setDepth(10);

        // Draw vertical lines
        for (let i = 1; i < this.size; i++) {
            const x = this.startX + i * this.cellSize;
            this.gridGraphics.lineBetween(
                x, this.startY,
                x, this.startY + this.boardHeight
            );
        }

        // Draw horizontal lines
        for (let i = 1; i < this.size; i++) {
            const y = this.startY + i * this.cellSize;
            this.gridGraphics.lineBetween(
                this.startX, y,
                this.startX + this.boardWidth, y
            );
        }

        // Enhanced board container background for depth
        if (!this.boardBackground) {
            this.boardBackground = this.scene.add.graphics();
            this.boardBackground.setDepth(5);
        } else {
            this.boardBackground.clear();
        }

        // Outer shadow/glow
        this.boardBackground.fillStyle(0x000000, 0.4);
        this.boardBackground.fillRoundedRect(
            this.startX - 16,
            this.startY - 16,
            this.boardWidth + 32,
            this.boardHeight + 32,
            12
        );

        // Inner container
        this.boardBackground.fillStyle(0x000000, 0.25);
        this.boardBackground.fillRoundedRect(
            this.startX - 8,
            this.startY - 8,
            this.boardWidth + 16,
            this.boardHeight + 16,
            10
        );
    }

    getCellPosition(row, col) {
        return {
            x: this.startX + col * this.cellSize + this.cellSize / 2,
            y: this.startY + row * this.cellSize + this.cellSize / 2
        };
    }

    // NEW: Calculate which cell was clicked based on pointer coordinates
    // This is more reliable than per-cell zones
    getCellFromPointer(pointerX, pointerY) {
        // Check if pointer is within board bounds
        if (pointerX < this.startX || pointerX > this.startX + this.boardWidth ||
            pointerY < this.startY || pointerY > this.startY + this.boardHeight) {
            return null;
        }

        // Calculate row and column from coordinates
        const col = Math.floor((pointerX - this.startX) / this.cellSize);
        const row = Math.floor((pointerY - this.startY) / this.cellSize);

        // Validate calculated position
        if (row >= 0 && row < this.size && col >= 0 && col < this.size) {
            return { row, col };
        }

        return null;
    }

    // Update hover effect based on pointer position with piece preview
    updateHover(cell) {
        // Create hover rectangle on first use
        if (!this.hoverRect) {
            this.hoverRect = this.scene.add.rectangle(
                0, 0,
                this.cellSize - 10,
                this.cellSize - 10,
                0xffffff,
                0
            );
            this.hoverRect.setDepth(12);
            this.hoverRect.setStrokeStyle(2, 0xffffff, 0.3);
        }

        // Create preview piece graphic
        if (!this.hoverPiece) {
            this.hoverPiece = this.scene.add.graphics();
            this.hoverPiece.setDepth(13);
            this.hoverPiece.setAlpha(0);
        }

        // Show hover on empty cells only
        if (cell && this.boardData[cell.row][cell.col] === null) {
            const pos = this.getCellPosition(cell.row, cell.col);
            this.hoverRect.setPosition(pos.x, pos.y);

            // Get current player from game scene
            const currentPlayer = this.scene.currentPlayer;
            const colors = UIHelper.getSkinColors(window.gameState.skin);
            const playerColor = currentPlayer === 'X' ? colors.x : colors.o;

            // Clear and draw preview piece
            this.hoverPiece.clear();
            this.hoverPiece.setPosition(pos.x, pos.y);

            const previewSize = this.cellSize * 0.5;

            if (currentPlayer === 'X') {
                // Draw X preview
                this.hoverPiece.lineStyle(6, playerColor, 0.4);
                this.hoverPiece.lineBetween(-previewSize / 2, -previewSize / 2, previewSize / 2, previewSize / 2);
                this.hoverPiece.lineBetween(previewSize / 2, -previewSize / 2, -previewSize / 2, previewSize / 2);
            } else {
                // Draw O preview
                this.hoverPiece.lineStyle(6, playerColor, 0.4);
                this.hoverPiece.strokeCircle(0, 0, previewSize / 2);
            }

            // Smooth fade in with subtle scale
            this.scene.tweens.add({
                targets: this.hoverRect,
                alpha: 0.15,
                scaleX: 1.02,
                scaleY: 1.02,
                duration: 150,
                ease: 'Power2'
            });

            this.scene.tweens.add({
                targets: this.hoverPiece,
                alpha: 1,
                duration: 150,
                ease: 'Power2'
            });
        } else {
            // Fade out
            this.scene.tweens.add({
                targets: this.hoverRect,
                alpha: 0,
                scaleX: 1,
                scaleY: 1,
                duration: 150,
                ease: 'Power2'
            });

            this.scene.tweens.add({
                targets: this.hoverPiece,
                alpha: 0,
                duration: 150,
                ease: 'Power2'
            });
        }
    }

    setPiece(row, col, player) {
        if (this.boardData[row][col] !== null) {
            return false;
        }

        this.boardData[row][col] = player;
        return true;
    }

    highlightWinningLine(winInfo) {
        if (this.winLineGraphics) {
            this.winLineGraphics.destroy();
        }

        this.winLineGraphics = this.scene.add.graphics();
        this.winLineGraphics.lineStyle(8, 0xff0000, 0.8);
        this.winLineGraphics.setDepth(20); // Above all board elements

        const { type, index } = winInfo.line;
        let startPos, endPos;

        if (type === 'row') {
            startPos = this.getCellPosition(index, 0);
            endPos = this.getCellPosition(index, this.size - 1);
        } else if (type === 'col') {
            startPos = this.getCellPosition(0, index);
            endPos = this.getCellPosition(this.size - 1, index);
        } else if (type === 'diag') {
            if (index === 0) {
                // Main diagonal
                startPos = this.getCellPosition(0, 0);
                endPos = this.getCellPosition(this.size - 1, this.size - 1);
            } else {
                // Anti-diagonal
                startPos = this.getCellPosition(0, this.size - 1);
                endPos = this.getCellPosition(this.size - 1, 0);
            }
        }

        if (startPos && endPos) {
            this.winLineGraphics.lineBetween(startPos.x, startPos.y, endPos.x, endPos.y);

            // Animate the line
            this.winLineGraphics.setAlpha(0);
            this.scene.tweens.add({
                targets: this.winLineGraphics,
                alpha: 1,
                duration: 500,
                ease: 'Power2'
            });
        }
    }

    clear() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                this.boardData[i][j] = null;
            }
        }

        if (this.winLineGraphics) {
            this.winLineGraphics.destroy();
            this.winLineGraphics = null;
        }
    }

    destroy() {
        if (this.gridGraphics) {
            this.gridGraphics.destroy();
        }
        if (this.winLineGraphics) {
            this.winLineGraphics.destroy();
        }
        if (this.hoverRect) {
            this.hoverRect.destroy();
        }
        if (this.hoverPiece) {
            this.hoverPiece.destroy();
        }
        if (this.hoverGlow) {
            this.hoverGlow.destroy();
        }
        if (this.boardBackground) {
            this.boardBackground.destroy();
        }
    }
}
