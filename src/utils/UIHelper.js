// UI Helper utilities for creating consistent modern UI elements
// UPDATED: Modern design system with pill-style buttons, gradients, and animations

// Modern color palette with improved contrast for accessibility
export const MODERN_COLORS = {
    primary: 0x00b894,        // Teal
    primaryGlow: 0x00d9a3,    // Light teal
    secondary: 0x6c5ce7,      // Purple
    secondaryGlow: 0x8b7ff5,  // Light purple
    accent: 0xff006e,         // Neon pink
    accentGlow: 0xff3d8f,     // Light pink
    dark: 0x0f0f23,           // Deep dark blue
    darkAlt: 0x1a1a2e,        // Dark blue-gray
    text: 0xffffff,           // White
    textSecondary: 0xc8c8dc,  // Light gray (improved contrast)
    success: 0x00b894,        // Teal
    danger: 0xd63031,         // Red
    warning: 0xfdcb6e         // Yellow
};

// 8-point spacing system for consistent layout
export const SPACING = {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
    xxl: 64
};

// Touch target sizes (in pixels) - following mobile best practices
export const TOUCH_TARGETS = {
    minimum: 48,      // Absolute minimum for accessibility
    comfortable: 56,  // Recommended for primary actions
    large: 64         // For prominent CTAs
};

export default class UIHelper {
    // Create modern pill-style button with animations and touch optimization
    static createModernButton(scene, x, y, text, callback, options = {}) {
        const {
            width = 200,
            height = TOUCH_TARGETS.comfortable, // Default to comfortable touch target
            fontSize = '20px',
            backgroundColor = MODERN_COLORS.primary,
            hoverColor = MODERN_COLORS.primaryGlow,
            textColor = '#ffffff',
            glowIntensity = 0.3
        } = options;

        // Enforce minimum touch target size
        const finalWidth = Math.max(width, TOUCH_TARGETS.minimum);
        const finalHeight = Math.max(height, TOUCH_TARGETS.minimum);

        const container = scene.add.container(x, y);

        // Glow effect (behind button)
        const glow = scene.add.graphics();
        glow.fillStyle(backgroundColor, glowIntensity);
        glow.fillRoundedRect(-finalWidth / 2 - 4, -finalHeight / 2 - 4, finalWidth + 8, finalHeight + 8, finalHeight / 2 + 4);
        glow.setAlpha(0);

        // Button background
        const button = scene.add.graphics();
        button.fillStyle(backgroundColor, 1);
        button.fillRoundedRect(-finalWidth / 2, -finalHeight / 2, finalWidth, finalHeight, finalHeight / 2);

        // Ripple effect container (for touch feedback)
        const ripple = scene.add.graphics();
        ripple.setAlpha(0);

        // Button text
        const buttonText = scene.add.text(0, 0, text, {
            fontSize: fontSize,
            fontFamily: 'Roboto',
            fontStyle: 'bold',
            color: textColor,
            align: 'center'
        }).setOrigin(0.5);

        container.add([glow, button, ripple, buttonText]);
        container.setSize(finalWidth, finalHeight);
        container.setInteractive(
            new Phaser.Geom.Rectangle(-finalWidth / 2, -finalHeight / 2, finalWidth, finalHeight),
            Phaser.Geom.Rectangle.Contains
        );

        // Hover effects
        container.on('pointerover', () => {
            scene.tweens.add({
                targets: container,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 200,
                ease: 'Back.easeOut'
            });
            scene.tweens.add({
                targets: glow,
                alpha: 1,
                duration: 200
            });
            button.clear();
            button.fillStyle(hoverColor, 1);
            button.fillRoundedRect(-finalWidth / 2, -finalHeight / 2, finalWidth, finalHeight, finalHeight / 2);
        });

        container.on('pointerout', () => {
            scene.tweens.add({
                targets: container,
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Back.easeIn'
            });
            scene.tweens.add({
                targets: glow,
                alpha: 0,
                duration: 200
            });
            button.clear();
            button.fillStyle(backgroundColor, 1);
            button.fillRoundedRect(-finalWidth / 2, -finalHeight / 2, finalWidth, finalHeight, finalHeight / 2);
        });

        // Click effects with ripple
        container.on('pointerdown', () => {
            scene.tweens.add({
                targets: container,
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100
            });

            // Ripple effect
            ripple.clear();
            ripple.fillStyle(0xffffff, 0.3);
            ripple.fillCircle(0, 0, 10);
            ripple.setAlpha(1);

            scene.tweens.add({
                targets: ripple,
                scaleX: 3,
                scaleY: 3,
                alpha: 0,
                duration: 400,
                ease: 'Power2'
            });
        });

        container.on('pointerup', () => {
            scene.tweens.add({
                targets: container,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 100,
                onComplete: () => {
                    if (callback) callback();
                }
            });
        });

        return { container, button, text: buttonText, glow, ripple };
    }

    // Create selection card with hover effects
    static createCard(scene, x, y, width, height, options = {}) {
        const {
            backgroundColor = MODERN_COLORS.darkAlt,
            borderColor = MODERN_COLORS.secondary,
            borderWidth = 2,
            isSelected = false,
            onSelect = null
        } = options;

        const container = scene.add.container(x, y);

        // Glow for selection state
        const glow = scene.add.graphics();
        glow.lineStyle(6, MODERN_COLORS.primaryGlow, 0.5);
        glow.strokeRoundedRect(-width / 2 - 3, -height / 2 - 3, width + 6, height + 6, 15);
        glow.setAlpha(isSelected ? 1 : 0);

        // Card background
        const bg = scene.add.graphics();
        bg.fillStyle(backgroundColor, 0.8);
        bg.fillRoundedRect(-width / 2, -height / 2, width, height, 12);

        // Border
        const border = scene.add.graphics();
        border.lineStyle(borderWidth, borderColor, 1);
        border.strokeRoundedRect(-width / 2, -height / 2, width, height, 12);

        container.add([glow, bg, border]);
        container.setSize(width, height);
        container.setInteractive(
            new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height),
            Phaser.Geom.Rectangle.Contains
        );

        // Hover effect
        container.on('pointerover', () => {
            scene.tweens.add({
                targets: container,
                scaleX: 1.03,
                scaleY: 1.03,
                duration: 200,
                ease: 'Power2'
            });
        });

        container.on('pointerout', () => {
            scene.tweens.add({
                targets: container,
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Power2'
            });
        });

        // Click effect
        container.on('pointerdown', () => {
            if (onSelect) onSelect();
            scene.tweens.add({
                targets: glow,
                alpha: 1,
                duration: 200
            });
        });

        container.glow = glow;
        container.setSelected = (selected) => {
            scene.tweens.add({
                targets: glow,
                alpha: selected ? 1 : 0,
                duration: 200
            });
        };

        return container;
    }

    // Create gradient background
    static createGradientBackground(scene, darkMode = false) {
        const { width, height } = scene.cameras.main;

        const colors = darkMode
            ? [MODERN_COLORS.dark, MODERN_COLORS.darkAlt, MODERN_COLORS.dark]
            : [MODERN_COLORS.darkAlt, 0x16213e, MODERN_COLORS.darkAlt];

        const bg = scene.add.graphics();

        // Create gradient effect with overlapping rectangles
        const steps = 20;
        for (let i = 0; i < steps; i++) {
            const alpha = 1 - (i / steps) * 0.5;
            const color = Phaser.Display.Color.Interpolate.ColorWithColor(
                Phaser.Display.Color.ValueToColor(colors[0]),
                Phaser.Display.Color.ValueToColor(colors[1]),
                steps,
                i
            );
            const colorValue = Phaser.Display.Color.GetColor(color.r, color.g, color.b);

            bg.fillStyle(colorValue, alpha);
            bg.fillRect(0, i * (height / steps), width, height / steps);
        }

        bg.setDepth(-100);
        return bg;
    }

    // Create background with diagonal stripes pattern
    static createStripedBackground(scene, baseColor1, baseColor2, stripeOpacity = 0.05) {
        const { width, height } = scene.cameras.main;

        // Base gradient
        const bg = scene.add.graphics();
        bg.fillGradientStyle(baseColor1, baseColor2, baseColor1, baseColor2, 1);
        bg.fillRect(0, 0, width, height);
        bg.setDepth(-100);

        // Diagonal stripes overlay
        const stripes = scene.add.graphics();
        stripes.setDepth(-99);

        const stripeWidth = 60;
        const stripeColor = 0xffffff;

        for (let i = -height; i < width + height; i += stripeWidth * 2) {
            stripes.fillStyle(stripeColor, stripeOpacity);
            stripes.fillRect(i, 0, stripeWidth, height, {
                rotation: Math.PI / 4
            });

            // Draw rotated stripe
            stripes.beginPath();
            stripes.moveTo(i, 0);
            stripes.lineTo(i + height, height);
            stripes.lineTo(i + height + stripeWidth, height);
            stripes.lineTo(i + stripeWidth, 0);
            stripes.closePath();
            stripes.fillPath();
        }

        return { bg, pattern: stripes };
    }

    // Create background with dots pattern
    static createDottedBackground(scene, baseColor1, baseColor2, dotSize = 2, dotSpacing = 30, dotOpacity = 0.08) {
        const { width, height } = scene.cameras.main;

        // Base gradient
        const bg = scene.add.graphics();
        bg.fillGradientStyle(baseColor1, baseColor2, baseColor1, baseColor2, 1);
        bg.fillRect(0, 0, width, height);
        bg.setDepth(-100);

        // Dots overlay
        const dots = scene.add.graphics();
        dots.fillStyle(0xffffff, dotOpacity);
        dots.setDepth(-99);

        for (let x = 0; x <= width; x += dotSpacing) {
            for (let y = 0; y <= height; y += dotSpacing) {
                dots.fillCircle(x, y, dotSize);
            }
        }

        return { bg, pattern: dots };
    }

    // Create background with hexagon pattern
    static createHexagonBackground(scene, baseColor1, baseColor2, hexSize = 30, hexOpacity = 0.06) {
        const { width, height } = scene.cameras.main;

        // Base gradient
        const bg = scene.add.graphics();
        bg.fillGradientStyle(baseColor1, baseColor2, baseColor1, baseColor2, 1);
        bg.fillRect(0, 0, width, height);
        bg.setDepth(-100);

        // Hexagon pattern overlay
        const hexagons = scene.add.graphics();
        hexagons.lineStyle(1, 0xffffff, hexOpacity);
        hexagons.setDepth(-99);

        const hexHeight = hexSize * Math.sqrt(3);
        const hexWidth = hexSize * 2;

        for (let row = 0; row <= height / hexHeight + 2; row++) {
            for (let col = 0; col <= width / hexWidth + 2; col++) {
                const x = col * hexWidth * 0.75;
                const y = row * hexHeight + (col % 2) * hexHeight / 2;

                // Draw hexagon
                hexagons.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (Math.PI / 3) * i;
                    const hx = x + hexSize * Math.cos(angle);
                    const hy = y + hexSize * Math.sin(angle);
                    if (i === 0) {
                        hexagons.moveTo(hx, hy);
                    } else {
                        hexagons.lineTo(hx, hy);
                    }
                }
                hexagons.closePath();
                hexagons.strokePath();
            }
        }

        return { bg, pattern: hexagons };
    }

    // Create background with wave pattern
    static createWaveBackground(scene, baseColor1, baseColor2, waveOpacity = 0.07) {
        const { width, height } = scene.cameras.main;

        // Base gradient
        const bg = scene.add.graphics();
        bg.fillGradientStyle(baseColor1, baseColor2, baseColor1, baseColor2, 1);
        bg.fillRect(0, 0, width, height);
        bg.setDepth(-100);

        // Wave pattern overlay
        const waves = scene.add.graphics();
        waves.lineStyle(2, 0xffffff, waveOpacity);
        waves.setDepth(-99);

        const waveCount = 5;
        const waveHeight = height / waveCount;

        for (let i = 0; i < waveCount; i++) {
            const yOffset = i * waveHeight;
            waves.beginPath();
            waves.moveTo(0, yOffset + waveHeight / 2);

            for (let x = 0; x <= width; x += 20) {
                const y = yOffset + waveHeight / 2 + Math.sin(x / 50 + i) * 15;
                waves.lineTo(x, y);
            }
            waves.strokePath();
        }

        return { bg, pattern: waves };
    }

    // Create animated background particles
    static createAnimatedBackground(scene) {
        const { width, height } = scene.cameras.main;
        const particleCount = 30;
        const particles = [];

        for (let i = 0; i < particleCount; i++) {
            const size = Phaser.Math.Between(2, 4);
            const particle = scene.add.circle(
                Phaser.Math.Between(0, width),
                Phaser.Math.Between(0, height),
                size,
                MODERN_COLORS.secondary,
                0.3
            );
            particle.setDepth(-50);

            // Slow floating animation
            scene.tweens.add({
                targets: particle,
                y: particle.y + Phaser.Math.Between(-100, 100),
                x: particle.x + Phaser.Math.Between(-50, 50),
                alpha: Phaser.Math.FloatBetween(0.1, 0.4),
                duration: Phaser.Math.Between(3000, 6000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            particles.push(particle);
        }

        return particles;
    }

    // Create title with glow effect
    static createTitle(scene, x, y, text, fontSize = '56px') {
        const title = scene.add.text(x, y, text, {
            fontSize: fontSize,
            fontFamily: 'Roboto',
            fontStyle: '900',
            color: '#ffffff',
            stroke: MODERN_COLORS.primary,
            strokeThickness: 2,
            align: 'center'
        }).setOrigin(0.5);

        // Subtle pulsing glow
        scene.tweens.add({
            targets: title,
            alpha: 0.9,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        return title;
    }

    // Create label/subtitle
    static createLabel(scene, x, y, text, fontSize = '24px', color = '#ffffff') {
        return scene.add.text(x, y, text, {
            fontSize: fontSize,
            fontFamily: 'Roboto',
            fontStyle: '400',
            color: color,
            align: 'center'
        }).setOrigin(0.5);
    }

    // Create info card with background for better readability
    static createInfoCard(scene, x, y, text, options = {}) {
        const {
            fontSize = '18px',
            fontWeight = '400',
            padding = SPACING.sm,
            backgroundColor = MODERN_COLORS.darkAlt,
            backgroundAlpha = 0.85,
            borderColor = MODERN_COLORS.secondary,
            borderWidth = 2,
            textColor = '#ffffff'
        } = options;

        const container = scene.add.container(x, y);

        // Create temporary text to measure size
        const tempText = scene.add.text(0, 0, text, {
            fontSize: fontSize,
            fontFamily: 'Roboto',
            fontStyle: fontWeight
        });
        const textWidth = tempText.width;
        const textHeight = tempText.height;
        tempText.destroy();

        // Background with padding
        const cardWidth = textWidth + padding * 2;
        const cardHeight = textHeight + padding * 2;

        const bg = scene.add.graphics();
        bg.fillStyle(backgroundColor, backgroundAlpha);
        bg.fillRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 12);

        // Border
        const border = scene.add.graphics();
        border.lineStyle(borderWidth, borderColor, 0.5);
        border.strokeRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 12);

        // Text
        const cardText = scene.add.text(0, 0, text, {
            fontSize: fontSize,
            fontFamily: 'Roboto',
            fontStyle: fontWeight,
            color: textColor,
            align: 'center'
        }).setOrigin(0.5);

        container.add([bg, border, cardText]);

        // Method to update text
        container.updateText = (newText) => {
            cardText.setText(newText);
            const newWidth = cardText.width + padding * 2;
            const newHeight = cardText.height + padding * 2;

            bg.clear();
            bg.fillStyle(backgroundColor, backgroundAlpha);
            bg.fillRoundedRect(-newWidth / 2, -newHeight / 2, newWidth, newHeight, 12);

            border.clear();
            border.lineStyle(borderWidth, borderColor, 0.5);
            border.strokeRoundedRect(-newWidth / 2, -newHeight / 2, newWidth, newHeight, 12);
        };

        return container;
    }

    // Create player card with symbol, state and score
    static createPlayerCard(scene, x, y, player, options = {}) {
        const {
            isActive = false,
            score = 0,
            skinColors = null,
            playerName = '' // Custom player name
        } = options;

        const container = scene.add.container(x, y);
        const cardWidth = 140;
        const cardHeight = 180;

        // Get player color
        const colors = skinColors || UIHelper.getSkinColors(window.gameState?.skin || 'classic');
        const playerColor = player === 'X' ? colors.x : colors.o;

        // Background card
        const bg = scene.add.graphics();
        bg.fillStyle(MODERN_COLORS.darkAlt, 0.85);
        bg.fillRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 16);

        // Active player glow
        const glow = scene.add.graphics();
        glow.lineStyle(4, playerColor, 0.8);
        glow.strokeRoundedRect(-cardWidth / 2 - 2, -cardHeight / 2 - 2, cardWidth + 4, cardHeight + 4, 18);
        glow.setAlpha(isActive ? 1 : 0);

        // Border
        const border = scene.add.graphics();
        border.lineStyle(2, playerColor, isActive ? 0.6 : 0.3);
        border.strokeRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 16);

        // Draw large symbol (X or O)
        const symbol = scene.add.graphics();
        const symbolSize = 50;

        if (player === 'X') {
            // Draw X
            symbol.lineStyle(8, playerColor, 1);
            symbol.lineBetween(-symbolSize / 2, -symbolSize / 2, symbolSize / 2, symbolSize / 2);
            symbol.lineBetween(symbolSize / 2, -symbolSize / 2, -symbolSize / 2, symbolSize / 2);
        } else {
            // Draw O
            symbol.lineStyle(8, playerColor, 1);
            symbol.strokeCircle(0, 0, symbolSize / 2);
        }
        symbol.setPosition(0, -35);

        // Status text - show player name if available in human mode
        const getStatusText = (active) => {
            if (!active) return '';
            const gameState = window.gameState;
            // Show name in human mode if available
            if (gameState.mode === 'human' && playerName) {
                return playerName;
            }
            return 'JUGANDO';
        };

        const statusText = scene.add.text(0, 25, getStatusText(isActive), {
            fontSize: playerName && isActive ? '12px' : '14px', // Smaller font for names
            fontFamily: 'Roboto',
            fontStyle: 'bold',
            color: isActive ? Phaser.Display.Color.RGBToString(
                Phaser.Display.Color.IntegerToRGB(playerColor).r,
                Phaser.Display.Color.IntegerToRGB(playerColor).g,
                Phaser.Display.Color.IntegerToRGB(playerColor).b
            ) : '#888888',
            align: 'center'
        }).setOrigin(0.5);

        // Divider line
        const divider = scene.add.graphics();
        divider.lineStyle(1, 0xffffff, 0.2);
        divider.lineBetween(-cardWidth / 2 + 20, 45, cardWidth / 2 - 20, 45);

        // Score with star icon
        const scoreText = scene.add.text(0, 65, `★ ${score}`, {
            fontSize: '20px',
            fontFamily: 'Roboto',
            fontStyle: 'bold',
            color: '#FFD700',
            align: 'center'
        }).setOrigin(0.5);

        container.add([bg, glow, border, symbol, statusText, divider, scoreText]);

        // Methods to update card
        container.setActive = (active) => {
            const gameState = window.gameState;
            let displayText = '';
            let fontSize = '14px';

            if (active) {
                // Show name in human mode if available
                if (gameState.mode === 'human' && playerName) {
                    displayText = playerName;
                    fontSize = '12px';
                } else {
                    displayText = 'JUGANDO';
                    fontSize = '14px';
                }
            }

            statusText.setText(displayText);
            statusText.setFontSize(fontSize);
            statusText.setColor(active ? Phaser.Display.Color.RGBToString(
                Phaser.Display.Color.IntegerToRGB(playerColor).r,
                Phaser.Display.Color.IntegerToRGB(playerColor).g,
                Phaser.Display.Color.IntegerToRGB(playerColor).b
            ) : '#888888');

            border.clear();
            border.lineStyle(2, playerColor, active ? 0.6 : 0.3);
            border.strokeRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 16);

            scene.tweens.add({
                targets: glow,
                alpha: active ? 1 : 0,
                duration: 300,
                ease: 'Power2'
            });
        };

        container.updateScore = (newScore) => {
            scoreText.setText(`★ ${newScore}`);

            // Bounce animation on score update
            scene.tweens.add({
                targets: scoreText,
                scaleX: 1.3,
                scaleY: 1.3,
                duration: 200,
                yoyo: true,
                ease: 'Back.easeOut'
            });
        };

        // Pulsing animation when active
        if (isActive) {
            scene.tweens.add({
                targets: glow,
                alpha: 0.5,
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }

        container.glow = glow;
        container.statusText = statusText;
        container.scoreText = scoreText;
        container.border = border;

        return container;
    }

    // Create small settings button
    static createSettingsButton(scene, x, y, callback) {
        const container = scene.add.container(x, y);

        const size = 50;
        const bg = scene.add.circle(0, 0, size / 2, MODERN_COLORS.darkAlt, 0.8);

        // Gear icon (simplified)
        const gear = scene.add.text(0, 0, '⚙️', {
            fontSize: '28px',
            align: 'center'
        }).setOrigin(0.5);

        container.add([bg, gear]);
        container.setSize(size, size);
        container.setInteractive(
            new Phaser.Geom.Circle(0, 0, size / 2),
            Phaser.Geom.Circle.Contains
        );

        container.on('pointerover', () => {
            scene.tweens.add({
                targets: gear,
                angle: 180,
                duration: 400,
                ease: 'Power2'
            });
            bg.setFillStyle(MODERN_COLORS.secondary, 0.9);
        });

        container.on('pointerout', () => {
            gear.setAngle(0);
            bg.setFillStyle(MODERN_COLORS.darkAlt, 0.8);
        });

        container.on('pointerdown', () => {
            if (callback) callback();
        });

        return container;
    }

    // Create score display
    static createScoreDisplay(scene, x, y) {
        const gameState = window.gameState;

        const container = scene.add.container(x, y);

        // Background card
        const bg = scene.add.graphics();
        bg.fillStyle(MODERN_COLORS.darkAlt, 0.7);
        bg.lineStyle(2, MODERN_COLORS.secondary, 0.5);
        bg.fillRoundedRect(-80, -20, 160, 40, 10);
        bg.strokeRoundedRect(-80, -20, 160, 40, 10);

        const scoreText = scene.add.text(0, 0,
            `X:${gameState.scores.x} | O:${gameState.scores.o} | E:${gameState.scores.draws}`, {
            fontSize: '16px',
            fontFamily: 'Roboto',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        container.add([bg, scoreText]);
        container.setAlpha(0.8);

        return container;
    }

    // Get skin colors (kept from original)
    static getSkinColors(skin) {
        const skins = {
            classic: {
                x: 0xff6b6b,
                o: 0x4ecdc4,
                grid: 0xf7f1e3,
                bg: 0x1a1a2e,
                highlight: 0xffd93d
            },
            neon: {
                x: 0xff006e,
                o: 0x00f5ff,
                grid: 0x7209b7,
                bg: 0x0a0a0a,
                highlight: 0xfbf500
            },
            retro: {
                x: 0xf77f00,
                o: 0x06ffa5,
                grid: 0xeae2b7,
                bg: 0x003049,
                highlight: 0xfcbf49
            }
        };

        return skins[skin] || skins.classic;
    }

    // Create particles - FIXED FOR PHASER 3.60+
    static createParticles(scene, x, y, color, count = 20) {
        // Skip particles if texture creation fails
        try {
            // Create or reuse particle texture
            const texKey = `particle_${color}`;
            if (!scene.textures.exists(texKey)) {
                const graphics = scene.add.graphics();
                graphics.fillStyle(color, 1);
                graphics.fillCircle(4, 4, 4);
                graphics.generateTexture(texKey, 8, 8);
                graphics.destroy();
            }

            // Use modern Phaser 3 particle API
            const particles = scene.add.particles(x, y, texKey, {
                speed: { min: 100, max: 300 },
                angle: { min: 0, max: 360 },
                scale: { start: 1, end: 0 },
                blendMode: 'ADD',
                lifespan: 1000,
                gravityY: 200,
                quantity: 1,
                frequency: 50,
                maxAliveParticles: count
            });

            // Stop  and destroy after animation
            scene.time.delayedCall(count * 50 + 500, () => {
                particles.stop();
            });

            scene.time.delayedCall(count * 50 + 1500, () => {
                particles.destroy();
            });

            return particles;
        } catch (error) {
            console.warn('Particle creation failed:', error);
            return null;
        }
    }

    // Create settings panel with player name inputs
    static createSettingsPanel(scene) {
        const { width, height } = scene.cameras.main;
        const gameState = window.gameState;

        const panel = scene.add.container(width / 2, height / 2);
        panel.setAlpha(0);
        panel.setVisible(false);
        panel.setDepth(1000);

        // Overlay background
        const overlay = scene.add.rectangle(0, 0, width * 2, height * 2, 0x000000, 0.75);
        overlay.setOrigin(0.5);
        overlay.setInteractive();

        // Panel background - responsive sizing
        const panelWidth = Math.min(400, width * 0.9);  // 90% of width, max 400px
        const panelHeight = Math.min(500, height * 0.8); // 80% of height, max 500px
        const panelBg = scene.add.graphics();
        panelBg.fillStyle(0x1a1a2e, 0.98);
        panelBg.lineStyle(3, MODERN_COLORS.secondary, 0.8);
        panelBg.fillRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, 16);
        panelBg.strokeRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, 16);

        // Calculate responsive positions
        const titleY = -panelHeight / 2 + 30;
        const sectionSpacing = 60;


        // Title
        const panelTitle = scene.add.text(0, titleY, 'CONFIGURACIÓN', {
            fontSize: '24px',
            fontFamily: 'Roboto',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Player names section
        const namesLabel = scene.add.text(0, titleY + 40, 'Nombres de Jugadores', {
            fontSize: '14px',
            fontFamily: 'Roboto',
            fontStyle: '600',
            color: '#c8c8dc'
        }).setOrigin(0.5);

        // We'll store references to DOM inputs for cleanup
        panel.domInputs = [];

        // Player X name input
        const labelX = panelWidth * 0.4;
        const inputY1 = titleY + 80;
        const playerXLabel = scene.add.text(-labelX, inputY1, 'Jugador X:', {
            fontSize: '13px',
            fontFamily: 'Roboto',
            color: '#ff6b6b'
        }).setOrigin(0, 0.5);

        const playerXInput = document.createElement('input');
        playerXInput.type = 'text';
        playerXInput.value = gameState.playerXName || '';
        playerXInput.placeholder = 'Nombre X';
        playerXInput.maxLength = 15;
        playerXInput.style.cssText = `
            position: absolute;
            width: ${panelWidth * 0.55}px;
            height: 36px;
            font-size: 13px;
            font-family: Roboto, sans-serif;
            padding: 4px 8px;
            border: 2px solid #ff6b6b;
            border-radius: 8px;
            background: rgba(44, 44, 62, 0.95);
            color: #ffffff;
            outline: none;
            z-index: 10001;
        `;
        playerXInput.addEventListener('focus', () => {
            playerXInput.style.borderColor = '#ff8f8f';
            playerXInput.style.background = 'rgba(44, 44, 62, 1)';
        });
        playerXInput.addEventListener('blur', () => {
            playerXInput.style.borderColor = '#ff6b6b';
            playerXInput.style.background = 'rgba(44, 44, 62, 0.95)';
            gameState.playerXName = playerXInput.value;
        });
        // Prevent clicks on input from closing the panel
        playerXInput.addEventListener('mousedown', (e) => {
            e.stopPropagation();
        });
        playerXInput.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        document.body.appendChild(playerXInput);
        panel.domInputs.push(playerXInput);

        // Player O name input
        const inputY2 = titleY + 125;
        const playerOLabel = scene.add.text(-labelX, inputY2, 'Jugador O:', {
            fontSize: '13px',
            fontFamily: 'Roboto',
            color: '#4ecdc4'
        }).setOrigin(0, 0.5);

        const playerOInput = document.createElement('input');
        playerOInput.type = 'text';
        playerOInput.value = gameState.playerOName || '';
        playerOInput.placeholder = 'Nombre O';
        playerOInput.maxLength = 15;
        playerOInput.style.cssText = `
            position: absolute;
            width: ${panelWidth * 0.55}px;
            height: 36px;
            font-size: 13px;
            font-family: Roboto, sans-serif;
            padding: 4px 8px;
            border: 2px solid #4ecdc4;
            border-radius: 8px;
            background: rgba(44, 44, 62, 0.95);
            color: #ffffff;
            outline: none;
            z-index: 10001;
        `;
        playerOInput.addEventListener('focus', () => {
            playerOInput.style.borderColor = '#6ee7e0';
            playerOInput.style.background = 'rgba(44, 44, 62, 1)';
        });
        playerOInput.addEventListener('blur', () => {
            playerOInput.style.borderColor = '#4ecdc4';
            playerOInput.style.background = 'rgba(44, 44, 62, 0.95)';
            gameState.playerOName = playerOInput.value;
        });
        // Prevent clicks on input from closing the panel
        playerOInput.addEventListener('mousedown', (e) => {
            e.stopPropagation();
        });
        playerOInput.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        document.body.appendChild(playerOInput);
        panel.domInputs.push(playerOInput);

        // Note about player names
        const noteY = titleY + 165;
        const nameNote = scene.add.text(0, noteY, '(Solo para modo VS Humano)', {
            fontSize: '10px',
            fontFamily: 'Roboto',
            fontStyle: 'italic',
            color: '#888888'
        }).setOrigin(0.5);

        // Dark mode toggle button
        const btnWidth = Math.min(260, panelWidth * 0.8);
        const btnY1 = noteY + 40;
        const darkModeBtn = UIHelper.createModernButton(
            scene,
            0,
            btnY1,
            gameState.darkMode ? '☀️ Modo Luz' : '🌙 Modo Oscuro',
            () => {
                gameState.darkMode = !gameState.darkMode;
                scene.scene.restart();
            },
            {
                width: btnWidth,
                height: 48,
                fontSize: '15px',
                backgroundColor: 0x2C2C3E,
                hoverColor: 0x3C3C4E
            }
        );

        // Sound toggle button
        const btnY2 = btnY1 + 60;
        const soundBtn = UIHelper.createModernButton(
            scene,
            0,
            btnY2,
            gameState.soundEnabled ? '🔊 Sonido On' : '🔇 Sonido Off',
            () => {
                gameState.soundEnabled = !gameState.soundEnabled;
                soundBtn.text.setText(gameState.soundEnabled ? '🔊 Sonido On' : '🔇 Sonido Off');
            },
            {
                width: btnWidth,
                height: 48,
                fontSize: '15px',
                backgroundColor: 0x2C2C3E,
                hoverColor: 0x3C3C4E
            }
        );

        // Close button
        const btnY3 = btnY2 + 60;
        const closeBtn = UIHelper.createModernButton(
            scene,
            0,
            btnY3,
            '✕ Cerrar',
            () => {
                panel.close();
            },
            {
                width: btnWidth,
                height: 48,
                fontSize: '16px',
                backgroundColor: 0xd63031,
                hoverColor: 0xe74c3c
            }
        );

        panel.add([
            overlay,
            panelBg,
            panelTitle,
            namesLabel,
            playerXLabel,
            playerOLabel,
            nameNote,
            darkModeBtn.container,
            soundBtn.container,
            closeBtn.container
        ]);

        // Function to position DOM inputs
        const updateInputPositions = () => {
            const canvas = scene.sys.game.canvas;
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;

            // Player X input position
            const xInputScreenX = rect.left + (width / 2 - 70) / scaleX;
            const xInputScreenY = rect.top + (height / 2 - 95) / scaleY;
            playerXInput.style.left = `${xInputScreenX}px`;
            playerXInput.style.top = `${xInputScreenY}px`;

            // Player O input position
            const oInputScreenX = rect.left + (width / 2 - 70) / scaleX;
            const oInputScreenY = rect.top + (height / 2 - 50) / scaleY;
            playerOInput.style.left = `${oInputScreenX}px`;
            playerOInput.style.top = `${oInputScreenY}px`;
        };

        // Panel open/close methods
        panel.open = () => {
            panel.setVisible(true);
            panel.setScale(0.95);
            updateInputPositions();

            // Show inputs
            panel.domInputs.forEach(input => {
                input.style.display = 'block';
            });

            scene.tweens.add({
                targets: panel,
                alpha: 1,
                scaleX: 1,
                scaleY: 1,
                duration: 250,
                ease: 'Back.easeOut'
            });
        };

        panel.close = () => {
            // Save input values before closing
            gameState.playerXName = playerXInput.value;
            gameState.playerOName = playerOInput.value;

            scene.tweens.add({
                targets: panel,
                alpha: 0,
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 250,
                ease: 'Power2',
                onComplete: () => {
                    panel.setVisible(false);
                    // Hide inputs
                    panel.domInputs.forEach(input => {
                        input.style.display = 'none';
                    });
                }
            });
        };

        // Close when clicking overlay
        overlay.on('pointerdown', () => {
            panel.close();
        });

        // Update positions on resize
        scene.scale.on('resize', updateInputPositions);

        // Initial hide
        panel.domInputs.forEach(input => {
            input.style.display = 'none';
        });

        // Cleanup on scene shutdown
        scene.events.on('shutdown', () => {
            panel.domInputs.forEach(input => {
                if (input.parentNode) {
                    input.parentNode.removeChild(input);
                }
            });
        });

        return panel;
    }

    // Fade transition between scenes
    static fadeTransition(scene, targetScene, duration = 300) {
        scene.cameras.main.fadeOut(duration);
        scene.time.delayedCall(duration, () => {
            scene.scene.start(targetScene);
        });
    }

    // Slide transition between scenes
    static slideTransition(scene, targetScene, direction = 'right', duration = 400) {
        const { width } = scene.cameras.main;
        const slideX = direction === 'right' ? -width : width;

        scene.cameras.main.pan(slideX, 0, duration, 'Power2');
        scene.cameras.main.fadeOut(duration / 2);

        scene.time.delayedCall(duration, () => {
            scene.scene.start(targetScene);
        });

    }
}
