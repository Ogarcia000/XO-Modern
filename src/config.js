import Phaser from 'phaser';
import MenuStep1 from './scenes/MenuStep1.js';
import MenuStep2 from './scenes/MenuStep2.js';
import MenuStep3 from './scenes/MenuStep3.js';
import MenuStep4 from './scenes/MenuStep4.js';
import Game from './scenes/Game.js';
import GameOver from './scenes/GameOver.js';

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    backgroundColor: '#1a1a2e',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1080,
        height: 1920,
        min: {
            width: 360,
            height: 640
        },
        max: {
            width: 1080,
            height: 1920
        }
    },
    input: {
        touch: true,
        mouse: true,
        activePointers: 3,
        smoothFactor: 0
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [MenuStep1, MenuStep2, MenuStep3, MenuStep4, Game, GameOver],
    render: {
        antialias: true,
        pixelArt: false,
        roundPixels: false
    },
    fps: {
        target: 60,
        forceSetTimeOut: false
    }
};

export default config;
