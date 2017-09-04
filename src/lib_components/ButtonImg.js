import _ObjectSettings from './_ObjectSettings';
import Body from './Body';

class ButtonImg extends _ObjectSettings {

    constructor(game, pooled, context, key, keyHover, x, y, width, height, action) {
        super();
        this.initializeGlobalSettings({
            game: game,
            pooled: pooled || false,
            context: context || 'main',
            x: x || 1,
            y: y || 1,
            key: key || null,
            width: width,
            height: height
        });
        //
        this.keyHover = keyHover === null ? this.key : keyHover;

        this.body = new Body(this.game, this);

        this.action = action;
        this.zIndex = 5;
        this.toggleTime = 300;
        this.hold = false;
        this.fadeIn(this.toggleTime, null)
    }

    update() {
        this.game.mouse.trigger(this, false, () => {
            if (typeof this.action === 'function') {
                this.action.call(this.game, this)
            }
        }, this.hold)

        this.game.mouse.onHover(this, null);
        this.moveToPointHandler();
        // if (!this.touchActive) {
        //     this.game.mouse.touchIntersects(this, true);
        // }
        // if (this.touchActive && typeof this.action === 'function') {
        //     this.action.call(this.game, this);
        //     this.touchActive = false;
        // } else if (!this.touchActive && this.game.mouse.updateHoverStats(this, true) && this.game.mouse.click && typeof this.action === 'function') {
        //     if (!this.hold) {
        //         this.game.mouse.click = false;
        //     }

        //     this.action.call(this.game, this);
        // }
    }

    draw(dt) {

        if (this.objAlfa !== 1 && this.game.ctx.globalAlpha === 1) {
            this.game.ctx.save();
            this.game.ctx.globalAlpha = this.objAlfa;
        }


        if (this.hovered) {
            this.image = this.AssetManager.get(this.keyHover);
        } else {
            this.image = this.AssetManager.get(this.key);
        }

        if (this.previousX) {
            this.renderX = (this.previousX + (this.x - this.previousX) * dt);  //this.x + (this.body.velocity.x * dt);
        } else {
            this.renderX = this.x;
        }
        if (this.previousY) {
            this.renderY = (this.previousY + (this.y - this.previousY) * dt); //this.y + (this.body.velocity.y * dt);
        } else {
            this.renderY = this.y;
        }
        this.context.drawImage(
            this.image,
            0,
            0,
            this.image.width,
            this.image.height,
            Math.floor(this.renderX - (!this.static ? this.game.camera.xScroll : 0)), // * this.scale
            Math.floor(this.renderY - (!this.static ? this.game.camera.yScroll : 0)),// * this.scale
            this.currentWidth,
            this.currentHeight
        )
        if (this.objAlfa !== 1) {
            this.game.ctx.restore();
        }
        this.fadeInHandler();
        this.fadeOutHandler();
    }

    changeImg(key) {
        this.key = key;
    }
    changeImgHover(key) {
        this.keyHover = key;
    }

    moveToPoint(x, y, speed, callback) {
        this.positionToMoveX = Math.floor(x);
        this.positionToMoveY = Math.floor(y);
        this.positionSpeed = speed;
        this.oldVelocityX = this.body.velocity.x;
        this.oldVelocityY = this.body.velocity.y;
        this.oldUseCollision = this.useCollision;
        this.useCollision = false;
        this.moveTo = true;

        this.positionCallback = callback;
    }

    moveToPointHandler() {
        if (this.moveTo) {

            this.myX = Math.floor(this.x);
            this.myY = Math.floor(this.y);

            if (this.moveTo && (this.myX != this.positionToMoveX || this.myY != this.positionToMoveY)) {
                this.x -= ((this.myX - this.positionToMoveX) / this.positionSpeed);
                this.y -= ((this.myY - this.positionToMoveY) / this.positionSpeed);
                this.body.velocity.x = 0;
                this.body.velocity.y = 0;
            } else if (this.moveTo) {
                this.body.velocity.x = this.oldVelocityX;
                this.body.velocity.y = this.oldVelocityY;
                this.useCollision = this.oldUseCollision;
                this.x = Math.floor(this.x);
                this.y = Math.floor(this.y);
                this.moveTo = false;
                if (typeof this.positionCallback === 'function') {
                    this.positionCallback.call(this.game, this);
                }
            }
        }
    }
};

export default ButtonImg;