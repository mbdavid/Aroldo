///<reference path="../libs/phaser.d.ts" />

export class PlayerObject extends Phaser.GameObjects.GameObjectFactory {

    constructor(scene, options) {

        // execute super
        super(scene);

        // pre-load images
        this.scene.load.spritesheet('aroldo', 'images/aroldo.png', { frameWidth: 32, frameHeight: 37 });

        this.sprite = this.scene.physics.add.sprite(100, 250, 'aroldo', 2);

        //  sprite physics properties: give the little a slight bounce.
        this.sprite.setBounce(0.2);
        this.sprite.setCollideWorldBounds(true);

        //  our player animations: left/right
        this.scene.anims.create({
            key: 'player-walk-left',
            frames: this.scene.anims.generateFrameNumbers('aroldo', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'player-walk-right',
            frames: this.scene.anims.generateFrameNumbers('aroldo', { start: 2, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

    }

    moveLeft() {
        this.sprite.setVelocityX(-110);
        this.sprite.anims.play('player-walk-left', true);
    }

    moveRight() {
        this.sprite.setVelocityX(110);
        this.sprite.anims.play('player-walk-right', true);
    }

    stopMoving() {
        this.sprite.setVelocityX(0);
        this.sprite.anims.stop();
    }

    jump() {
        this.sprite.setVelocityY(-270);
    }

    die() {
        this.sprite.setTint(0xff0000);
    }

}
