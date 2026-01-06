import Phaser from 'phaser';
import UIHelper, { SPACING, TOUCH_TARGETS } from '../utils/UIHelper.js';

export default class GameOver extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOver' });
    }

    init(data) {
        this.winner = data.winner;
    }

    create() {
        const { width, height } = this.cameras.main;
        const gameState = window.gameState;

        // Background with gradient
        UIHelper.createGradientBackground(this, gameState.darkMode);

        // Animated background particles
        UIHelper.createAnimatedBackground(this);

        // Get colors
        const colors = UIHelper.getSkinColors(gameState.skin);

        // Result message and color
        let message, messageColor, resultIcon, winnerName;
        if (this.winner) {
            // Determine winner name based on game mode
            if (gameState.mode === 'human') {
                // Use custom names if available, fallback to X/O
                winnerName = this.winner === 'X'
                    ? (gameState.playerXName || 'X')
                    : (gameState.playerOName || 'O');
            } else {
                // In AI mode, always show X or O
                winnerName = this.winner;
            }

            message = `¡${winnerName} GANA!`;
            messageColor = this.winner === 'X' ? colors.x : colors.o;
            resultIcon = this.winner; // Will draw X or O symbol

            // Continuous victory particles
            for (let i = 0; i < 15; i++) {
                this.time.delayedCall(i * 100, () => {
                    UIHelper.createParticles(
                        this,
                        Phaser.Math.Between(100, width - 100),
                        Phaser.Math.Between(100, height - 100),
                        messageColor,
                        20
                    );
                });
            }
        } else {
            message = '¡EMPATE!';
            messageColor = 0xFFB800; // Warm yellow for draw
            resultIcon = null;
        }

        // Large winner symbol (if there is one)
        if (resultIcon) {
            const symbolGraphics = this.add.graphics();
            symbolGraphics.setPosition(width / 2, height * 0.2);

            const symbolSize = 80;
            symbolGraphics.lineStyle(12, messageColor, 0.8);

            if (resultIcon === 'X') {
                symbolGraphics.lineBetween(-symbolSize / 2, -symbolSize / 2, symbolSize / 2, symbolSize / 2);
                symbolGraphics.lineBetween(symbolSize / 2, -symbolSize / 2, -symbolSize / 2, symbolSize / 2);
            } else {
                symbolGraphics.strokeCircle(0, 0, symbolSize / 2);
            }

            // Glow effect
            const glow = this.add.graphics();
            glow.setPosition(width / 2, height * 0.2);
            glow.lineStyle(16, messageColor, 0.3);
            if (resultIcon === 'X') {
                glow.lineBetween(-symbolSize / 2, -symbolSize / 2, symbolSize / 2, symbolSize / 2);
                glow.lineBetween(symbolSize / 2, -symbolSize / 2, -symbolSize / 2, symbolSize / 2);
            } else {
                glow.strokeCircle(0, 0, symbolSize / 2);
            }

            // Pulsing animation
            this.tweens.add({
                targets: [symbolGraphics, glow],
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 800,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            // Rotate animation
            this.tweens.add({
                targets: [symbolGraphics, glow],
                angle: 360,
                duration: 3000,
                repeat: -1,
                ease: 'Linear'
            });
        }

        // Title with enhanced styling
        const titleY = resultIcon ? height * 0.38 : height * 0.25;
        const title = this.add.text(width / 2, titleY, message, {
            fontSize: '72px',
            fontFamily: 'Roboto',
            fontStyle: '900',
            color: '#ffffff',
            stroke: Phaser.Display.Color.RGBToString(
                Phaser.Display.Color.IntegerToRGB(messageColor).r,
                Phaser.Display.Color.IntegerToRGB(messageColor).g,
                Phaser.Display.Color.IntegerToRGB(messageColor).b
            ),
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);

        // Animate title entrance
        title.setScale(0);
        title.setAlpha(0);
        this.tweens.add({
            targets: title,
            scale: 1,
            alpha: 1,
            duration: 600,
            delay: 200,
            ease: 'Elastic.easeOut'
        });

        // Score cards in a horizontal layout
        const scoreY = titleY + 120;

        // Player X Score Card
        const xScoreCard = this.createScoreCard(
            width / 2 - 120,
            scoreY,
            'X',
            gameState.scores.x,
            colors.x,
            this.winner === 'X'
        );

        // Draw label (center)
        const drawCard = UIHelper.createInfoCard(
            this,
            width / 2,
            scoreY,
            `${gameState.scores.draws}`,
            {
                fontSize: '32px',
                fontWeight: 'bold',
                padding: SPACING.md,
                backgroundColor: 0x2C2C3E,
                backgroundAlpha: 0.9,
                borderColor: 0xFFB800,
                borderWidth: 2
            }
        );

        const drawLabel = this.add.text(width / 2, scoreY + 60, 'EMPATES', {
            fontSize: '14px',
            fontFamily: 'Roboto',
            fontStyle: 'bold',
            color: '#888888',
            align: 'center'
        }).setOrigin(0.5);

        // Player O Score Card
        const oScoreCard = this.createScoreCard(
            width / 2 + 120,
            scoreY,
            'O',
            gameState.scores.o,
            colors.o,
            this.winner === 'O'
        );

        // Stagger card entrances
        [xScoreCard, drawCard, oScoreCard].forEach((card, index) => {
            card.setAlpha(0);
            card.setY(card.y + 50);
            this.tweens.add({
                targets: card,
                alpha: 1,
                y: card.y - 50,
                duration: 400,
                delay: 300 + index * 100,
                ease: 'Back.easeOut'
            });
        });

        drawLabel.setAlpha(0);
        this.tweens.add({
            targets: drawLabel,
            alpha: 1,
            duration: 400,
            delay: 400,
            ease: 'Power2'
        });

        // Buttons with icons
        const btnY = height * 0.75;

        const playAgainBtn = UIHelper.createModernButton(
            this,
            width / 2,
            btnY,
            '▶ JUGAR DE NUEVO',
            () => {
                this.cameras.main.fade(300, 0, 0, 0);
                this.time.delayedCall(300, () => {
                    this.scene.start('Game');
                });
            },
            {
                width: 280,
                height: TOUCH_TARGETS.large,
                fontSize: '22px',
                backgroundColor: 0x00b894,
                hoverColor: 0x00d9a3
            }
        );

        const menuBtn = UIHelper.createModernButton(
            this,
            width / 2,
            btnY + 80,
            '◄ MENÚ PRINCIPAL',
            () => {
                // Reset all scores when returning to menu
                window.gameState.scores.x = 0;
                window.gameState.scores.o = 0;
                window.gameState.scores.draws = 0;
                this.cameras.main.fade(300, 0, 0, 0);
                this.time.delayedCall(300, () => {
                    this.scene.start('MenuStep1');
                });
            },
            {
                width: 280,
                height: TOUCH_TARGETS.large,
                fontSize: '22px',
                backgroundColor: 0x6c5ce7,
                hoverColor: 0x8b7ff5
            }
        );

        // Animate buttons
        [playAgainBtn.container, menuBtn.container].forEach((btn, index) => {
            btn.setAlpha(0);
            btn.setScale(0.8);
            this.tweens.add({
                targets: btn,
                alpha: 1,
                scaleX: 1,
                scaleY: 1,
                duration: 400,
                delay: 600 + index * 100,
                ease: 'Back.easeOut'
            });
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

        // Camera fade in
        this.cameras.main.fadeIn(400, 0, 0, 0);
    }

    createScoreCard(x, y, player, score, color, isWinner) {
        const container = this.add.container(x, y);
        const cardWidth = 90;
        const cardHeight = 110;

        // Background
        const bg = this.add.graphics();
        bg.fillStyle(0x2C2C3E, 0.9);
        bg.fillRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 12);

        // Winner glow
        const glow = this.add.graphics();
        if (isWinner) {
            glow.lineStyle(4, color, 0.8);
            glow.strokeRoundedRect(-cardWidth / 2 - 2, -cardHeight / 2 - 2, cardWidth + 4, cardHeight + 4, 14);

            this.tweens.add({
                targets: glow,
                alpha: 0.4,
                duration: 800,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }

        // Border
        const border = this.add.graphics();
        border.lineStyle(2, color, isWinner ? 0.8 : 0.4);
        border.strokeRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 12);

        // Symbol
        const symbol = this.add.graphics();
        const symbolSize = 30;
        symbol.lineStyle(6, color, 1);

        if (player === 'X') {
            symbol.lineBetween(-symbolSize / 2, -symbolSize / 2, symbolSize / 2, symbolSize / 2);
            symbol.lineBetween(symbolSize / 2, -symbolSize / 2, -symbolSize / 2, symbolSize / 2);
        } else {
            symbol.strokeCircle(0, 0, symbolSize / 2);
        }
        symbol.setPosition(0, -20);

        // Score
        const scoreText = this.add.text(0, 25, `${score}`, {
            fontSize: '32px',
            fontFamily: 'Roboto',
            fontStyle: 'bold',
            color: isWinner ? Phaser.Display.Color.RGBToString(
                Phaser.Display.Color.IntegerToRGB(color).r,
                Phaser.Display.Color.IntegerToRGB(color).g,
                Phaser.Display.Color.IntegerToRGB(color).b
            ) : '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        if (isWinner) {
            // Trophy/star above score
            const trophy = this.add.text(0, 5, '★', {
                fontSize: '20px',
                color: '#FFD700'
            }).setOrigin(0.5);

            this.tweens.add({
                targets: trophy,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            container.add(trophy);
        }

        container.add([bg, glow, border, symbol, scoreText]);
        return container;
    }
}
