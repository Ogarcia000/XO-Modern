/**
 * MenuStep1.js - Welcome Screen
 * Redesigned with modern visual style and animated X/O symbols
 */

import Phaser from 'phaser';
import UIHelper, { MODERN_COLORS, SPACING, TOUCH_TARGETS } from '../utils/UIHelper.js';

export default class MenuStep1 extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuStep1' });
    }

    create() {
        const { width, height } = this.cameras.main;
        const gameState = window.gameState;

        // Gradient background
        UIHelper.createGradientBackground(this, gameState.darkMode);

        // Animated background particles (more intense)
        this.particles = UIHelper.createAnimatedBackground(this);

        // Large animated X and O symbols
        this.createLargeAnimatedSymbols(width, height);

        // Title with modern styling - positioned lower to make room for symbols
        const title = this.add.text(width / 2, height * 0.48, 'XO MODERN', {
            fontSize: '88px',
            fontFamily: 'Roboto',
            fontStyle: '900',
            color: '#ffffff',
            stroke: '#00b894',
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);

        title.setAlpha(0);
        title.setScale(0.8);
        this.tweens.add({
            targets: title,
            alpha: 1,
            scale: 1,
            duration: 800,
            delay: 400,
            ease: 'Back.easeOut'
        });

        // Subtitle with glow
        const subtitle = this.add.text(width / 2, height * 0.58, 'Tic Tac Toe', {
            fontSize: '26px',
            fontFamily: 'Roboto',
            fontStyle: '300',
            color: '#c8c8dc',
            align: 'center'
        }).setOrigin(0.5);

        subtitle.setAlpha(0);
        this.time.delayedCall(600, () => {
            this.tweens.add({
                targets: subtitle,
                alpha: 1,
                duration: 600,
                ease: 'Power2'
            });
        });

        // Large Start button
        const startBtn = UIHelper.createModernButton(
            this,
            width / 2,
            height * 0.75,
            '▶ COMENZAR',
            () => {
                this.cameras.main.fade(300, 0, 0, 0);
                this.time.delayedCall(300, () => {
                    this.scene.start('MenuStep2');
                });
            },
            {
                width: 320,
                height: TOUCH_TARGETS.large,
                fontSize: '30px',
                backgroundColor: MODERN_COLORS.primary,
                hoverColor: MODERN_COLORS.primaryGlow,
                glowIntensity: 0.6
            }
        );

        startBtn.container.setAlpha(0);
        startBtn.container.setScale(0.9);
        this.time.delayedCall(1000, () => {
            this.tweens.add({
                targets: startBtn.container,
                alpha: 1,
                scaleX: 1,
                scaleY: 1,
                duration: 600,
                ease: 'Elastic.easeOut'
            });
        });

        // Settings button (bottom-right) using shared UIHelper method
        const settingsBtn = UIHelper.createSettingsButton(
            this,
            width - 40,
            height - 40,
            () => this.settingsPanel.open()
        );
        settingsBtn.setDepth(20);

        // Settings panel using shared UIHelper method
        this.settingsPanel = UIHelper.createSettingsPanel(this);

        // Camera fade in
        this.cameras.main.fadeIn(600, 0, 0, 0);
    }

    createLargeAnimatedSymbols(width, height) {
        const colors = UIHelper.getSkinColors(window.gameState.skin);

        // Larger X symbol (left) - more prominent
        const xGraphics = this.add.graphics();
        xGraphics.setPosition(width / 2 - 140, height * 0.24);
        const xSize = 70;
        xGraphics.lineStyle(12, colors.x, 0.9);
        xGraphics.lineBetween(-xSize / 2, -xSize / 2, xSize / 2, xSize / 2);
        xGraphics.lineBetween(xSize / 2, -xSize / 2, -xSize / 2, xSize / 2);

        // Glow for X
        const xGlow = this.add.graphics();
        xGlow.setPosition(width / 2 - 140, height * 0.24);
        xGlow.lineStyle(18, colors.x, 0.3);
        xGlow.lineBetween(-xSize / 2, -xSize / 2, xSize / 2, xSize / 2);
        xGlow.lineBetween(xSize / 2, -xSize / 2, -xSize / 2, xSize / 2);

        // Larger O symbol (right) - more prominent
        const oGraphics = this.add.graphics();
        oGraphics.setPosition(width / 2 + 140, height * 0.24);
        const oSize = 70;
        oGraphics.lineStyle(12, colors.o, 0.9);
        oGraphics.strokeCircle(0, 0, oSize / 2);

        // Glow for O
        const oGlow = this.add.graphics();
        oGlow.setPosition(width / 2 + 140, height * 0.24);
        oGlow.lineStyle(18, colors.o, 0.3);
        oGlow.strokeCircle(0, 0, oSize / 2);

        // Entrance animations with stagger
        [xGlow, xGraphics, oGlow, oGraphics].forEach((symbol, index) => {
            symbol.setAlpha(0);
            symbol.setScale(0);
            this.time.delayedCall(index * 80, () => {
                this.tweens.add({
                    targets: symbol,
                    alpha: 1,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 800,
                    ease: 'Elastic.easeOut'
                });
            });
        });

        // Floating animation for X and its glow
        this.tweens.add({
            targets: [xGraphics, xGlow],
            y: height * 0.24 - 15,
            duration: 2500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Floating animation for O and its glow (opposite phase)
        this.tweens.add({
            targets: [oGraphics, oGlow],
            y: height * 0.24 + 15,
            duration: 2500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            delay: 1250
        });

        // Slow rotation for X
        this.tweens.add({
            targets: [xGraphics, xGlow],
            angle: 360,
            duration: 10000,
            repeat: -1,
            ease: 'Linear'
        });

        // Pulsing glow for both
        this.tweens.add({
            targets: [xGlow, oGlow],
            alpha: 0.5,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Mini animated tic-tac-toe pattern between symbols
        this.createMiniPattern(width, height, colors);
    }

    createMiniPattern(width, height, colors) {
        // Small decorative grid lines
        const miniGrid = this.add.graphics();
        miniGrid.setPosition(width / 2, height * 0.24);
        miniGrid.lineStyle(2, 0xffffff, 0.15);

        const gridSize = 60;
        const cellSize = gridSize / 3;

        // Vertical lines
        for (let i = 1; i < 3; i++) {
            miniGrid.lineBetween(
                -gridSize / 2 + i * cellSize, -gridSize / 2,
                -gridSize / 2 + i * cellSize, gridSize / 2
            );
        }

        // Horizontal lines
        for (let i = 1; i < 3; i++) {
            miniGrid.lineBetween(
                -gridSize / 2, -gridSize / 2 + i * cellSize,
                gridSize / 2, -gridSize / 2 + i * cellSize
            );
        }

        miniGrid.setAlpha(0);
        this.time.delayedCall(800, () => {
            this.tweens.add({
                targets: miniGrid,
                alpha: 1,
                duration: 600,
                ease: 'Power2'
            });
        });

        // Subtle pulsing
        this.tweens.add({
            targets: miniGrid,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }


}
