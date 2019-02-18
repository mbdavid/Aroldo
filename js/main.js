///<reference path="libs/phaser.d.ts" />

import { MainScene } from '../js/scenes/mainScene.js';

var DEBUG = location.href.toLowerCase().indexOf('debug') > 0;
var MOBILE = navigator.userAgent.indexOf('Mobile') > 0;

var game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 500,
    height: 400,
    parent: 'game',
    backgroundColor: "#000000",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: DEBUG
        }
    },
    input: {
        keyboard: true,
        gamepad: true,
        mouse: true,
        touch: true
    },
    render: {
        pixelArt: true,
        antialias: false
    },
    zoom: 2, // Since we're working with 16x16 pixel tiles, let's scale up the canvas by 3x
    // pixelArt: true,
    scene: [MainScene]
});