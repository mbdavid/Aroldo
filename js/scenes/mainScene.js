///<reference path="../libs/phaser.d.ts" />

class MainScene extends Phaser.Scene {

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
        this.background1 = this.add.image(400, 300, 'sky');
        this.background2 = this.add.image(400, 300, 'sky2');

        this.background2.visible = false;

        // Adding audio
        this.collect = this.sound.add('collect');
        this.over = this.sound.add('over');

        // Score
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
        this.levelText = this.add.text(620, 16, 'Level: 0', { fontSize: '32px', fill: '#000' });

        //  The platforms group contains the ground and the 2 ledges we can jump on
        this.platforms = this.physics.add.staticGroup();

        //  Here we create the ground.
        this.platforms.create(200, 585, 'ground'); //.setScale(2).refreshBody();
        this.platforms.create(600, 585, 'ground'); //.setScale(2).refreshBody();

        //  Now let's create some ledges
        this.platforms.create(200, 420, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 250, 'ground');

        // The player and its settings
        this.player = this.physics.add.sprite(100, 450, 'aroldo');
        this.player.fra


        //  Player physics properties. Give the little guy a slight bounce.
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.setScale(2);

        //  Our player animations, turning, walking left and walking right.
        this.anims.create({
            key: 'player_left',
            frames: this.anims.generateFrameNumbers('aroldo', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'player_right',
            frames: this.anims.generateFrameNumbers('aroldo', { start: 2, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'ghost_move',
            frames: this.anims.generateFrameNumbers('ghost', { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        });

        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();

        //  Some cherries to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
        this.cherries = this.physics.add.group({
            key: 'cherry',
            repeat: 8,
            setXY: { x: 30, y: 0, stepX: 90 }
        });

        this.cherries.children.iterate(function (child) {

            //  Give each cherry a slightly different bounce
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            child.setScale(2);

        });

        // Create ghosts group
        this.ghosts = this.physics.add.group();

        //  Collide the player and the cherry with the platforms
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.cherries, this.platforms);
        this.physics.add.collider(this.ghosts, this.platforms);

        //  Checks to see if the player overlaps with any of the cherry, if he does call the collectCherry function
        this.physics.add.overlap(this.player, this.cherries, this.collectCherry, null, this);

        this.physics.add.collider(this.player, this.ghosts, this.hitGhost, null, this);

    }

    update() {

        if (this.gameOver) return;

        if (this.cursors.left.isDown) {

            this.player.setVelocityX(-160);

            this.player.anims.play('player_left', true);
        }
        else if (this.cursors.right.isDown) {

            this.player.setVelocityX(160);

            this.player.anims.play('player_right', true);
        }
        else {

            this.player.setVelocityX(0);

            this.player.anims.stop();
            //player.anims.play('turn');
        }

        if ((this.cursors.up.isDown || this.cursors.space.isDown) && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
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
            ghost.setScale(1.5);
            ghost.setCollideWorldBounds(true);
            ghost.setVelocity(Phaser.Math.Between(-200, 200), 20);
            ghost.allowGravity = false;
            ghost.anims.play('ghost_move', true);

        }

    }

    hitGhost(player, ghost) {

        this.physics.pause();
        this.over.play();

        this.player.setTint(0xff0000);

        //player.anims.play('turn');

        this.add.text(320, 320, 'Game Over', { fontSize: '32px', fill: '#000' });

        this.gameOver = true;
    }

}