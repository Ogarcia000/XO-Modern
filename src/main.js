import Phaser from 'phaser';
import config from './config.js';

// Initialize the game
const game = new Phaser.Game(config);

// Global game state
window.gameState = {
    skin: 'classic',
    mode: 'human',
    boardSize: 3,
    darkMode: false,
    soundEnabled: true,
    playerXName: '',  // Custom name for Player X (only used in human mode)
    playerOName: '',  // Custom name for Player O (only used in human mode)
    scores: {
        x: 0,
        o: 0,
        draws: 0
    }
};

export default game;
