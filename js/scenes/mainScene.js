///<reference path="../libs/phaser.d.ts" />

import { PlayerObject } from '../objects/playerObject.js';

export class MainScene extends Phaser.Scene {

    constructor() {
        super('MainScene');
    }

    preload() {
        this.load.image('sky', 'images/sky.png');
        this.load.image('sky2', 'images/sky2.png');
        this.load.image('ground', 'images/platform.png');
        this.load.image('cherry', 'images/cherry.png');
        this.load.spritesheet('ghost', 'images/ghost.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('aroldo', 'images/aroldo.png', { frameWidth: 32, frameHeight: 37 });

        this.load.audio('collect', ['audio/collect.ogg']);
        this.load.audio('over', ['audio/game-over.ogg']);
    }

    create() {

        // Game model variables
        this.gameOver = false;
        this.score = 0;
        this.level = 0;

        // Load both backgrounds
        this.background1 = this.add.image(200, 150, 'sky');
        this.background2 = this.add.image(200, 150, 'sky2');

        this.background2.visible = false;

        // Adding audio
        this.collect = this.sound.add('collect');
        this.over = this.sound.add('over');

        // Adding player
        this.player = new PlayerObject(this);

        // Score/Level
        this.scoreText = this.add.text(8, 8, 'Score: 0', { fontSize: '16px', fill: '#000' });
        this.levelText = this.add.text(410, 8, 'Level: 0', { fontSize: '16px', fill: '#000' });

        //  The platforms group contains the ground and the 2 ledges we can jump on
        this.platforms = this.physics.add.staticGroup();

        //  Here we create the ground.
        this.platforms.create(250, 400 - 8, 'ground');

        //  Now let's create some ledges
        this.platforms.create(-100, 170, 'ground');
        this.platforms.create(0, 280, 'ground');
        this.platforms.create(580, 190, 'ground');

        this.anims.create({
            key: 'ghost_move',
            frames: this.anims.generateFrameNumbers('ghost', { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        });

        //  Some cherries to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
        this.cherries = this.physics.add.group({
            key: 'cherry',
            repeat: 6,
            setXY: { x: 30, y: 0, stepX: 70 }
        });

        this.cherries.children.iterate(function (child) {

            //  Give each cherry a slightly different bounce
            child.setBounceY(Phaser.Math.FloatBetween(0.3, 0.6));

        });

        // Create ghosts group
        this.ghosts = this.physics.add.group();

        //  Collide the player and the cherry with the platforms
        this.physics.add.collider(this.player.sprite, this.platforms);
        this.physics.add.collider(this.cherries, this.platforms);
        this.physics.add.collider(this.ghosts, this.platforms);

        //  Checks to see if the player overlaps with any of the cherry, if he does call the collectCherry function
        this.physics.add.overlap(this.player.sprite, this.cherries, this.collectCherry, null, this);

        this.physics.add.collider(this.player.sprite, this.ghosts, this.hitGhost, null, this);

        // create cursor listener
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {

        if (this.gameOver) return;

        if (this.cursors.left.isDown) {
            this.player.moveLeft();
        }
        else if (this.cursors.right.isDown) {
            this.player.moveRight();
        }
        else {
            this.player.stopMoving();
        }

        if ((this.cursors.up.isDown || this.cursors.space.isDown) && this.player.sprite.body.touching.down) {
            this.player.jump();
        }

    }

    collectCherry(player, cherry) {

        cherry.disableBody(true, true);

        this.collect.play();

        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        if (this.cherries.countActive(true) === 0) {

            this.level++;

            this.background2.visible = this.level % 2 !== 0;

            this.levelText.setText('Level: ' + this.level);

            //  A new batch of cherries to collect
            this.cherries.children.iterate(function (child) {

                child.enableBody(true, child.x, 0, true, true);

            });

            var x = this.player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            var ghost = this.ghosts.create(x, 16, 'ghost');
            ghost.setBounce(1);
            ghost.setCollideWorldBounds(true);
            ghost.setVelocity(Phaser.Math.Between(-200, 200), 20);
            ghost.allowGravity = false;
            ghost.anims.play('ghost_move', true);
        }

    }

    hitGhost(player, ghost) {

        this.physics.pause();

        this.over.play();
        this.player.die();

        this.add.text(180, 180, 'Game Over', { fontSize: '32px', fill: '#000' });

        this.gameOver = true;
    }

}