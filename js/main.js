///<reference path="libs/phaser.d.ts" />

var DEBUG = location.href.toLowerCase().indexOf('debug') > 0;
var MOBILE = navigator.userAgent.indexOf('Mobile') > 0;

var game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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
        mouse: false,
        touch: false,
        gamepad: true
    },
    render: {
        pixelArt: true,
        antialias: false
    },
    scene: [MainScene]
});