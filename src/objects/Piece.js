import Phaser from 'phaser';
import UIHelper from '../utils/UIHelper.js';

export default class Piece {
    constructor(scene, x, y, player, skin = 'classic', cellSize = 100) {
        this.scene = scene;
        this.player = player;
        this.skin = skin;

        console.log(`🎭 Creating ${player} piece at (${x}, ${y}) with ${skin} skin`);

        // ENHANCED: Professional Graphics with shadows and glow
        this.graphics = scene.add.graphics();
        this.graphics.setPosition(x, y);
        this.graphics.setDepth(18);

        const colors = UIHelper.getSkinColors(skin);
        const color = player === 'X' ? colors.x : colors.o;
        const size = cellSize * 0.65;
        const lineWidth = 12; // Thicker for better visibility

        if (player === 'X') {
            // Shadow layer
            this.graphics.lineStyle(lineWidth + 4, 0x000000, 0.3);
            this.graphics.lineBetween(-size / 2 + 3, -size / 2 + 3, size / 2 + 3, size / 2 + 3);
            this.graphics.lineBetween(size / 2 + 3, -size / 2 + 3, -size / 2 + 3, size / 2 + 3);

            // Outer glow
            this.graphics.lineStyle(lineWidth + 8, color, 0.2);
            this.graphics.lineBetween(-size / 2, -size / 2, size / 2, size / 2);
            this.graphics.lineBetween(size / 2, -size / 2, -size / 2, size / 2);

            // Main X with gradient effect
            this.graphics.lineStyle(lineWidth, color, 1);
            this.graphics.lineBetween(-size / 2, -size / 2, size / 2, size / 2);
            this.graphics.lineBetween(size / 2, -size / 2, -size / 2, size / 2);

            // Inner highlight
            this.graphics.lineStyle(lineWidth - 4, Phaser.Display.Color.GetColor(255, 255, 255), 0.4);
            this.graphics.lineBetween(-size / 2, -size / 2, size / 2, size / 2);
            this.graphics.lineBetween(size / 2, -size / 2, -size / 2, size / 2);

        } else {
            // Shadow layer
            this.graphics.lineStyle(lineWidth + 4, 0x000000, 0.3);
            this.graphics.strokeCircle(3, 3, size / 2);

            // Outer glow
            this.graphics.lineStyle(lineWidth + 8, color, 0.2);
            this.graphics.strokeCircle(0, 0, size / 2);

            // Main O circle
            this.graphics.lineStyle(lineWidth, color, 1);
            this.graphics.strokeCircle(0, 0, size / 2);

            // Inner highlight
            this.graphics.lineStyle(lineWidth - 4, Phaser.Display.Color.GetColor(255, 255, 255), 0.4);
            this.graphics.strokeCircle(0, 0, size / 2);
        }

        // Enhanced animation - scale + rotate
        this.graphics.setScale(0);
        this.graphics.setAlpha(0);
        scene.tweens.add({
            targets: this.graphics,
            scale: 1,
            alpha: 1,
            angle: player === 'X' ? 360 : 0,
            duration: 400,
            ease: 'Back.easeOut'
        });

        console.log(`  ✅ ${player} rendered with professional effects`);

        // Enhanced particles
        if (window.gameState.soundEnabled) {
            const particleColor = color;
            UIHelper.createParticles(scene, x, y, particleColor, 20);
        }
    }

    destroy() {
        if (this.graphics) {
            this.graphics.destroy();
        }
    }
}
