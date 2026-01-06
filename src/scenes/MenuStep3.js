/**
 * MenuStep3.js - Game Mode Selection Screen
 * Redesigned with geometric animated background
 */

import Phaser from 'phaser';
import UIHelper, { MODERN_COLORS, SPACING, TOUCH_TARGETS } from '../utils/UIHelper.js';

export default class MenuStep3 extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuStep3' });
    }

    create() {
        const { width, height } = this.cameras.main;
        const gameState = window.gameState;

        // Hexagon pattern background (cool tones)
        UIHelper.createHexagonBackground(this, 0x1A2F3A, 0x2A3F4A, 35, 0.08);

        // Geometric animated background
        this.createGeometricBackground(width, height);

        // Title
        const title = this.add.text(width / 2, height * 0.12, 'Modo de Juego', {
            fontSize: '56px',
            fontFamily: 'Roboto',
            fontStyle: '900',
            color: '#ffffff',
            stroke: '#00b894',
            strokeThickness: 3
        }).setOrigin(0.5);

        title.setAlpha(0);
        this.tweens.add({
            targets: title,
            alpha: 1,
            duration: 600,
            ease: 'Back.easeOut'
        });

        // Mode cards
        this.selectedMode = gameState.mode || 'human';
        this.modeCards = [];

        const modes = [
            {
                key: 'human',
                name: 'VS Humano',
                desc: 'Juega contra otro\njugador local',
                color: 0x6c5ce7
            },
            {
                key: 'ai',
                name: 'VS IA Fácil',
                desc: 'Juega contra la\ninteligencia artificial',
                color: 0x00b894
            }
        ];

        const cardWidth = 250;
        const cardHeight = 280;
        const spacing = 280;
        const startX = width / 2 - spacing / 2;

        modes.forEach((mode, index) => {
            const x = startX + (index * spacing);
            const y = height * 0.48;

            const card = UIHelper.createCard(this, x, y, cardWidth, cardHeight, {
                isSelected: this.selectedMode === mode.key,
                onSelect: () => this.selectMode(mode.key)
            });

            // Custom icon graphics instead of emoji
            const iconGraphics = this.add.graphics();
            iconGraphics.setPosition(0, -80);

            if (mode.key === 'human') {
                // Draw two person silhouettes
                const personSize = 25;
                const spacing = 15;

                // Left person
                iconGraphics.fillStyle(mode.color, 0.8);
                iconGraphics.fillCircle(-spacing, -personSize, 12);
                iconGraphics.fillRoundedRect(-spacing - 10, -personSize + 12, 20, 30, 5);

                // Right person
                iconGraphics.fillCircle(spacing, -personSize, 12);
                iconGraphics.fillRoundedRect(spacing - 10, -personSize + 12, 20, 30, 5);
            } else {
                // Draw robot icon
                iconGraphics.lineStyle(4, mode.color, 1);
                iconGraphics.strokeRoundedRect(-20, -35, 40, 35, 4);
                iconGraphics.fillStyle(mode.color, 1);
                iconGraphics.fillRect(-12, -28, 8, 8);
                iconGraphics.fillRect(4, -28, 8, 8);
                iconGraphics.fillRect(-8, -12, 16, 4);
                // Antenna
                iconGraphics.lineStyle(3, mode.color, 1);
                iconGraphics.lineBetween(0, -35, 0, -45);
                iconGraphics.fillCircle(0, -47, 4);
            }

            // Mode name
            const nameText = this.add.text(0, 5, mode.name, {
                fontSize: '28px',
                fontFamily: 'Roboto',
                fontStyle: 'bold',
                color: '#ffffff'
            }).setOrigin(0.5);

            // Description
            const descText = this.add.text(0, 70, mode.desc, {
                fontSize: '16px',
                fontFamily: 'Roboto',
                color: '#c8c8dc',
                align: 'center',
                lineSpacing: 6
            }).setOrigin(0.5);

            card.add([iconGraphics, nameText, descText]);
            this.modeCards.push({ container: card, key: mode.key });

            // Entrance animation with rotation
            card.setAlpha(0);
            card.setScale(0.8);
            card.setAngle(-5 + index * 10);

            this.time.delayedCall(index * 150, () => {
                this.tweens.add({
                    targets: card,
                    alpha: 1,
                    scaleX: 1,
                    scaleY: 1,
                    angle: 0,
                    duration: 600,
                    ease: 'Elastic.easeOut'
                });
            });
        });

        // Navigation buttons
        const btnY = height * 0.82;

        const backBtn = UIHelper.createModernButton(
            this,
            width / 2 - 140,
            btnY,
            '◄ ATRÁS',
            () => {
                this.cameras.main.fade(300, 0, 0, 0);
                this.time.delayedCall(300, () => {
                    this.scene.start('MenuStep2');
                });
            },
            {
                width: 160,
                height: 55,
                fontSize: '20px',
                backgroundColor: MODERN_COLORS.secondary,
                hoverColor: MODERN_COLORS.secondaryGlow
            }
        );

        const nextBtn = UIHelper.createModernButton(
            this,
            width / 2 + 140,
            btnY,
            'SIGUIENTE ►',
            () => {
                gameState.mode = this.selectedMode;
                this.cameras.main.fade(300, 0, 0, 0);
                this.time.delayedCall(300, () => {
                    this.scene.start('MenuStep4');
                });
            },
            {
                width: 200,
                height: 55,
                fontSize: '20px',
                backgroundColor: MODERN_COLORS.primary,
                hoverColor: MODERN_COLORS.primaryGlow
            }
        );

        // Settings button (bottom-right)
        const settingsBtn = UIHelper.createSettingsButton(
            this,
            width - 40,
            height - 40,
            () => this.settingsPanel.open()
        );
        settingsBtn.setDepth(20);

        // Settings panel
        this.settingsPanel = UIHelper.createSettingsPanel(this);

        // Fade in camera
        this.cameras.main.fadeIn(400, 0, 0, 0);
    }

    createGeometricBackground(width, height) {
        // Create animated triangles
        for (let i = 0; i < 12; i++) {
            const triangle = this.add.graphics();
            const size = Phaser.Math.Between(30, 80);
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(0, height);

            triangle.lineStyle(2, 0x00b894, 0.15);
            triangle.beginPath();
            triangle.moveTo(-size / 2, size / 2);
            triangle.lineTo(0, -size / 2);
            triangle.lineTo(size / 2, size / 2);
            triangle.closePath();
            triangle.strokePath();

            triangle.setPosition(x, y);
            triangle.setDepth(-1);
            triangle.setAlpha(0);

            // Fade in
            this.tweens.add({
                targets: triangle,
                alpha: 1,
                duration: 1000 + i * 100,
                ease: 'Power2'
            });

            // Rotate slowly
            this.tweens.add({
                targets: triangle,
                angle: 360,
                duration: 20000 + i * 2000,
                repeat: -1,
                ease: 'Linear'
            });

            // Gentle floating
            this.tweens.add({
                targets: triangle,
                y: y + Phaser.Math.Between(-30, 30),
                duration: 4000 + i * 500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    selectMode(modeKey) {
        this.selectedMode = modeKey;

        // Update card selection states
        this.modeCards.forEach(card => {
            card.container.setSelected(card.key === modeKey);
        });
    }
}
