/**
 * MenuStep2.js - Skin Selection Screen
 * Redesigned with colorful particle background and improved visuals
 */

import Phaser from 'phaser';
import UIHelper, { MODERN_COLORS, SPACING, TOUCH_TARGETS } from '../utils/UIHelper.js';

export default class MenuStep2 extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuStep2' });
    }

    create() {
        const { width, height } = this.cameras.main;
        const gameState = window.gameState;

        // Dotted pattern background (warm purple tones)
        UIHelper.createDottedBackground(this, 0x2C1A4A, 0x3A1F5C, 2, 35, 0.1);

        // Colorful particles matching skin colors
        this.createColorfulParticles(width, height);

        // Title - larger and more prominent
        const title = this.add.text(width / 2, height * 0.12, 'Elige tu Estilo', {
            fontSize: '56px',
            fontFamily: 'Roboto',
            fontStyle: '900',
            color: '#ffffff',
            stroke: '#ff006e',
            strokeThickness: 3
        }).setOrigin(0.5);

        title.setAlpha(0);
        this.tweens.add({
            targets: title,
            alpha: 1,
            y: height * 0.12,
            duration: 600,
            ease: 'Back.easeOut'
        });

        // Skin cards
        this.selectedSkin = gameState.skin;
        this.skinCards = [];

        const skins = [
            { key: 'classic', name: 'Clásico', color: 0xff6b6b, icon: '🎨' },
            { key: 'neon', name: 'Neón', color: 0xff006e, icon: '✨' },
            { key: 'retro', name: 'Retro', color: 0xf77f00, icon: '🎮' }
        ];

        const cardWidth = 200;
        const cardHeight = 260;
        const totalWidth = skins.length * cardWidth + (skins.length - 1) * 30;
        const startX = (width - totalWidth) / 2 + cardWidth / 2;

        skins.forEach((skin, index) => {
            const x = startX + (index * (cardWidth + 30));
            const y = height * 0.45;

            const card = UIHelper.createCard(this, x, y, cardWidth, cardHeight, {
                isSelected: this.selectedSkin === skin.key,
                onSelect: () => this.selectSkin(skin.key)
            });

            // Icon
            const icon = this.add.text(0, -95, skin.icon, {
                fontSize: '40px'
            }).setOrigin(0.5);

            // Skin name
            const nameText = this.add.text(0, -45, skin.name, {
                fontSize: '26px',
                fontFamily: 'Roboto',
                fontStyle: 'bold',
                color: '#ffffff'
            }).setOrigin(0.5);

            // Larger color preview circle with glow
            const colorGlow = this.add.circle(0, 20, 52, skin.color, 0.3);
            const colorCircle = this.add.circle(0, 20, 45, skin.color, 1);

            // Pulsing animation for glow
            this.tweens.add({
                targets: colorGlow,
                scaleX: 1.15,
                scaleY: 1.15,
                alpha: 0.5,
                duration: 1500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            // Description
            const descText = this.add.text(0, 75, skin.desc, {
                fontSize: '15px',
                fontFamily: 'Roboto',
                color: '#c8c8dc',
                align: 'center',
                lineSpacing: 5
            }).setOrigin(0.5);

            card.add([colorGlow, colorCircle, icon, nameText, descText]);
            this.skinCards.push({ container: card, key: skin.key });

            // Staggered entrance animation
            card.setAlpha(0);
            card.setScale(0.8);
            this.time.delayedCall(index * 120, () => {
                this.tweens.add({
                    targets: card,
                    alpha: 1,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 500,
                    ease: 'Elastic.easeOut'
                });
            });
        });

        // Navigation buttons with icons
        const btnY = height * 0.82;

        const backBtn = UIHelper.createModernButton(
            this,
            width / 2 - 140,
            btnY,
            '◄ ATRÁS',
            () => {
                this.cameras.main.fade(300, 0, 0, 0);
                this.time.delayedCall(300, () => {
                    this.scene.start('MenuStep1');
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
                gameState.skin = this.selectedSkin;
                this.cameras.main.fade(300, 0, 0, 0);
                this.time.delayedCall(300, () => {
                    this.scene.start('MenuStep3');
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

    createColorfulParticles(width, height) {
        // Multiple particle systems with different colors
        const colors = [
            { color: 0xff6b6b, x: width * 0.2, y: height * 0.3 },  // Red (Classic)
            { color: 0xff006e, x: width * 0.5, y: height * 0.25 }, // Pink (Neon)
            { color: 0xf77f00, x: width * 0.8, y: height * 0.35 }, // Orange (Retro)
            { color: 0x00b894, x: width * 0.3, y: height * 0.7 },  // Teal
            { color: 0x6c5ce7, x: width * 0.7, y: height * 0.65 }  // Purple
        ];

        colors.forEach((config, index) => {
            const emitter = this.add.particles(config.x, config.y, 'particle', {
                speed: { min: 10, max: 30 },
                scale: { start: 0.4, end: 0 },
                alpha: { start: 0.6, end: 0 },
                tint: config.color,
                blendMode: 'ADD',
                lifespan: 4000,
                frequency: 250,
                quantity: 1,
                rotate: { min: 0, max: 360 },
                angle: { min: 0, max: 360 }
            });

            emitter.setDepth(-1);

            // Gentle movement
            this.tweens.add({
                targets: emitter,
                x: config.x + Phaser.Math.Between(-50, 50),
                y: config.y + Phaser.Math.Between(-50, 50),
                duration: 3000 + index * 500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }

    selectSkin(skinKey) {
        this.selectedSkin = skinKey;

        // Update card selection states
        this.skinCards.forEach(card => {
            card.container.setSelected(card.key === skinKey);
        });
    }
}
