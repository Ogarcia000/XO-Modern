/**
 * MenuStep4.js - Board Size Selection & Game Start
 * Redesigned with grid pattern background and 5x5 option
 */

import Phaser from 'phaser';
import UIHelper, { MODERN_COLORS, SPACING, TOUCH_TARGETS } from '../utils/UIHelper.js';

export default class MenuStep4 extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuStep4' });
    }

    create() {
        const { width, height } = this.cameras.main;
        const gameState = window.gameState;

        // Diagonal stripes pattern background (warm tones)
        UIHelper.createStripedBackground(this, 0x3A1F2E, 0x4A2F3E, 0.04);

        // Grid pattern background
        const gridOverlay = this.add.graphics();
        gridOverlay.lineStyle(1, 0xffffff, 0.04);
        gridOverlay.setDepth(-98);

        const cellSize = 80;

        // Draw vertical lines  
        for (let x = 0; x <= width; x += cellSize) {
            gridOverlay.lineBetween(x, 0, x, height);
        }

        // Draw horizontal lines
        for (let y = 0; y <= height; y += cellSize) {
            gridOverlay.lineBetween(0, y, width, y);
        }

        // Draw dots at intersections
        gridOverlay.fillStyle(0xffffff, 0.1);
        for (let x = 0; x <= width; x += cellSize) {
            for (let y = 0; y <= height; y += cellSize) {
                gridOverlay.fillCircle(x, y, 2);
            }
        }

        // Title - moved higher for better spacing
        const title = this.add.text(width / 2, height * 0.065, 'Tamaño del Tablero', {
            fontSize: '52px',
            fontFamily: 'Roboto',
            fontStyle: '900',
            color: '#ffffff',
            stroke: '#f77f00',
            strokeThickness: 3
        }).setOrigin(0.5);

        title.setAlpha(0);
        this.tweens.add({
            targets: title,
            alpha: 1,
            duration: 600,
            ease: 'Back.easeOut'
        });

        // Board size cards - now including 5x5
        this.selectedSize = gameState.boardSize || 3;
        this.sizeCards = [];

        const sizes = [
            { key: 3, name: '3×3', desc: 'Clásico\nRápido y estratégico', color: 0xff6b6b },
            { key: 4, name: '4×4', desc: 'Desafiante\nMás posibilidades', color: 0x6c5ce7 },
            { key: 5, name: '5×5', desc: 'Experto\nExtremadamente complejo', color: 0x00b894 }
        ];

        const cardWidth = 160;
        const cardHeight = 220;
        const totalWidth = sizes.length * cardWidth + (sizes.length - 1) * 25;
        const startX = (width - totalWidth) / 2 + cardWidth / 2;

        sizes.forEach((size, index) => {
            const x = startX + (index * (cardWidth + 25));
            const y = height * 0.32;

            const card = UIHelper.createCard(this, x, y, cardWidth, cardHeight, {
                isSelected: this.selectedSize === size.key,
                onSelect: () => this.selectSize(size.key)
            });

            // Size label
            const nameText = this.add.text(0, -80, size.name, {
                fontSize: '36px',
                fontFamily: 'Roboto',
                fontStyle: 'bold',
                color: '#ffffff'
            }).setOrigin(0.5);

            // Animated mini grid preview
            const gridContainer = this.add.container(0, -10);
            this.createGridPreview(gridContainer, size.key, size.color);

            // Description
            const descText = this.add.text(0, 65, size.desc, {
                fontSize: '13px',
                fontFamily: 'Roboto',
                color: '#c8c8dc',
                align: 'center',
                lineSpacing: 4
            }).setOrigin(0.5);

            card.add([nameText, gridContainer, descText]);
            this.sizeCards.push({ container: card, key: size.key, gridContainer });

            // Entrance animation
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

        // Visual summary panel with icons
        this.createVisualSummary(width, height, gameState);

        // Navigation buttons
        const btnY = height * 0.88;

        const backBtn = UIHelper.createModernButton(
            this,
            width / 2 - 160,
            btnY,
            '◄ ATRÁS',
            () => {
                this.cameras.main.fade(300, 0, 0, 0);
                this.time.delayedCall(300, () => {
                    this.scene.start('MenuStep3');
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

        // Prominent PLAY button
        const playBtn = UIHelper.createModernButton(
            this,
            width / 2 + 160,
            btnY,
            '▶ JUGAR',
            () => {
                gameState.boardSize = this.selectedSize;
                this.cameras.main.fade(500, 0, 0, 0);
                this.time.delayedCall(500, () => {
                    this.scene.start('Game');
                });
            },
            {
                width: 240,
                height: 70,
                fontSize: '28px',
                backgroundColor: MODERN_COLORS.success,
                hoverColor: MODERN_COLORS.primaryGlow,
                glowIntensity: 0.7
            }
        );

        // Pulsing glow on play button
        this.tweens.add({
            targets: playBtn.container,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

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


    createGridPreview(container, size, color) {
        const cellSize = size === 3 ? 18 : size === 4 ? 14 : 11;
        const gridSize = cellSize * size;
        const startX = -gridSize / 2;
        const startY = -gridSize / 2;

        const grid = this.add.graphics();
        grid.lineStyle(2, color, 0.7);

        // Draw grid
        for (let i = 0; i <= size; i++) {
            grid.lineBetween(startX + i * cellSize, startY, startX + i * cellSize, startY + gridSize);
            grid.lineBetween(startX, startY + i * cellSize, startX + gridSize, startY + i * cellSize);
        }

        container.add(grid);

        // Animate grid on hover
        container.setInteractive();
        container.on('pointerover', () => {
            this.tweens.add({
                targets: grid,
                scaleX: 1.1,
                scaleY: 1.1,
                alpha: 1,
                duration: 200,
                ease: 'Power2'
            });
        });

        container.on('pointerout', () => {
            this.tweens.add({
                targets: grid,
                scaleX: 1,
                scaleY: 1,
                alpha: 0.7,
                duration: 200,
                ease: 'Power2'
            });
        });
    }

    createVisualSummary(width, height, gameState) {
        const summaryY = height * 0.63;

        // Summary title with better styling
        const summaryTitle = this.add.text(width / 2, summaryY - 10, 'Resumen de Configuración', {
            fontSize: '18px',
            fontFamily: 'Roboto',
            fontStyle: '600',
            color: '#a8a8c1'
        }).setOrigin(0.5);

        // Create visual summary with cards
        const skinName = gameState.skin === 'classic' ? 'Clásico' :
            gameState.skin === 'neon' ? 'Neón' : 'Retro';
        const modeName = gameState.mode === 'human' ? 'VS Humano' : 'VS IA Fácil';

        // Create individual summary cards
        const cardSpacing = 170;
        const cardY = summaryY + 40;

        // Skin summary card
        const skinContainer = this.add.container(width / 2 - cardSpacing, cardY);

        const skinCardBg = this.add.graphics();
        skinCardBg.fillStyle(0x2C2C3E, 0.6);
        skinCardBg.lineStyle(2, 0xff6b6b, 0.5);
        skinCardBg.fillRoundedRect(-75, -30, 150, 60, 10);
        skinCardBg.strokeRoundedRect(-75, -30, 150, 60, 10);

        const skinIcon = this.add.text(-35, 0, '🎨', {
            fontSize: '18px'
        }).setOrigin(0.5);

        const skinText = this.add.text(-15, 0, skinName, {
            fontSize: '18px',
            fontFamily: 'Roboto',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0, 0.5);

        skinContainer.add([skinCardBg, skinIcon, skinText]);
        skinContainer.setDepth(10);

        // Mode summary card
        const modeContainer = this.add.container(width / 2, cardY);

        const modeCardBg = this.add.graphics();
        modeCardBg.fillStyle(0x2C2C3E, 0.6);
        modeCardBg.lineStyle(2, 0x6c5ce7, 0.5);
        modeCardBg.fillRoundedRect(-80, -30, 160, 60, 10);
        modeCardBg.strokeRoundedRect(-80, -30, 160, 60, 10);

        const modeIcon = this.add.text(-50, 0, gameState.mode === 'human' ? '👥' : '🤖', {
            fontSize: '18px'
        }).setOrigin(0.5);

        const modeText = this.add.text(-30, 0, modeName, {
            fontSize: '18px',
            fontFamily: 'Roboto',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0, 0.5);

        modeContainer.add([modeCardBg, modeIcon, modeText]);
        modeContainer.setDepth(10);

        // Size summary card (showing selected size)
        const sizeContainer = this.add.container(width / 2 + cardSpacing, cardY);

        const sizeCardBg = this.add.graphics();
        sizeCardBg.fillStyle(0x2C2C3E, 0.6);
        sizeCardBg.lineStyle(2, 0x00b894, 0.5);
        sizeCardBg.fillRoundedRect(-60, -30, 120, 60, 10);
        sizeCardBg.strokeRoundedRect(-60, -30, 120, 60, 10);

        const sizeIcon = this.add.text(-35, 0, '📐', {
            fontSize: '24px'
        }).setOrigin(0.5);

        const sizeText = this.add.text(-15, 0, `${this.selectedSize}×${this.selectedSize}`, {
            fontSize: '22px',
            fontFamily: 'Roboto',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0, 0.5);

        sizeContainer.add([sizeCardBg, sizeIcon, sizeText]);
        sizeContainer.setDepth(10);

        // Entrance animation for all elements
        const allElements = [
            summaryTitle,
            skinContainer,
            modeContainer,
            sizeContainer
        ];

        allElements.forEach((item, index) => {
            item.setAlpha(0);
            const delay = 400 + index * 100;
            this.time.delayedCall(delay, () => {
                this.tweens.add({
                    targets: item,
                    alpha: 1,
                    duration: 400,
                    ease: 'Power2'
                });
            });
        });
    }

    selectSize(sizeKey) {
        this.selectedSize = sizeKey;

        // Update card selection states
        this.sizeCards.forEach(card => {
            card.container.setSelected(card.key === sizeKey);
        });
    }
}
