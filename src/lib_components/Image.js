import _ObjectSettings from './_ObjectSettings';
import Body from './Body';

class Image extends _ObjectSettings {

    constructor(game, pooled, context, x, y, key, width, height, fullscreen) {
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

        this.type = "image";
        this.body = new Body(this.game, this);
        this.zIndex = 4;
    }

    draw(lag) {
        //this.useRotate();
        if (this.objAlfa !== 1 && this.game.ctx.globalAlpha === 1) {
            this.game.ctx.save();
            this.game.ctx.globalAlpha = this.objAlfa;
        }


        if (this.previousX) {
            this.renderX = (this.x - this.previousX) * lag + this.previousX;
        } else {
            this.renderX = this.x;
        }
        if (this.previousY) {
            this.renderY = (this.y - this.previousY) * lag + this.previousY;
        } else {
            this.renderY = this.y;
        }

        this.game.ctx.drawImage(
            this.image,
            0,
            0,
            this.image.width,
            this.image.height,
            this.renderX - this.game.camera.xScroll, // * this.scale
            this.renderY - this.game.camera.yScroll, // * this.scale
            this.currentWidth,
            this.currentHeight
        )
        if (this.objAlfa !== 1) {
            this.game.ctx.restore();
        }

        this.fadeInHandler();
        this.fadeOutHandler();
    }

    update(dt) {
        // this.worldBounce();
        this.moveToPointHandler();


        if (this.body.velocity.x != 0 || this.body.velocity.y != 0) {
            this.x = Math.floor(this.x + (dt * this.body.velocity.x));
            this.y = Math.floor(this.y + (dt * this.body.velocity.y));
        }
    }

    updateWhenPositionChange(x, y, callback) {
        console.log(x, this.x)
        if ((this.previousX !== this.x || this.previousY !== this.y)) {
            if (typeof _callback === 'function') {
                _callback(this)
            }
        }
    }

    multiUpdate() {
        if ((this.previousX !== this.x || this.previousY !== this.y) && this.ID) {
            this.game.multiplayer.emit("update obj", { x: this.x, y: this.y, ID: this.ID, room: this.room });
        }
    }

    useRotate() {
        this.body.angle += this.body.angleSpeed;
    }

    moveByLine(_mouseX, _mouseY, _speed, _maxDistance, _callback) {
        if (!_mouseX || !_mouseY) {
            return false;
        }
        let dx = (_mouseX - this.x - this.currentHalfWidth);
        let dy = (_mouseY - this.y - this.currentHalfHeight);
        let distance = Math.sqrt(dx * dx + dy * dy);
        let maxDistance = _maxDistance || 10;
        let speed = _speed || 4;

        if (distance > maxDistance) {
            if (Math.abs(dx) > 1 && Math.abs(dy) > 1) {
                let angle = Math.atan2(dy, dx);
                this.body.rotate(angle * (180 / Math.PI));

                this.body.velocity.x = Math.cos(angle) * speed;
                this.body.velocity.y = Math.sin(angle) * speed;
            }
        } else {
            this.body.velocity.x = 0;//Math.cos(angle) * speed;
            this.body.velocity.y = 0;//Math.sin(angle) * speed;
            if (typeof _callback === 'function') {
                this._callback.call(this.game, this);
            }
        }
    }

    moveToPoint(x, y, speed, callback) {
        //if(!this.moveTo){
        this.positionToMoveX = Math.floor(x);
        this.positionToMoveY = Math.floor(y);
        this.positionSpeed = speed;
        this.oldVelocityX = this.body.velocity.x;
        this.oldVelocityY = this.body.velocity.y;
        this.oldUseCollision = this.useCollision;
        this.useCollision = false;
        this.moveTo = true;

        this.positionCallback = callback;
        //}
    }

    moveToPointHandler() {
        if (this.moveTo) {
            this.myX = Math.floor(this.x);
            this.myY = Math.floor(this.y);

            if (this.moveTo && (this.myX != this.positionToMoveX || this.myY != this.positionToMoveY)) {
                this.x -= (((this.myX - this.positionToMoveX) / this.positionSpeed));
                this.y -= (((this.myY - this.positionToMoveY) / this.positionSpeed));
                this.body.velocity.x = 0;
                this.body.velocity.y = 0;

            } else if (this.moveTo) {
                this.body.velocity.x = this.oldVelocityX;
                this.body.velocity.y = this.oldVelocityY;
                this.useCollision = this.oldUseCollision;
                this.x = Math.floor(this.x)
                this.y = Math.floor(this.y)
                this.moveTo = false;

                if (typeof this.positionCallback === 'function') {
                    this.positionCallback.call(this.game, this);
                }
            }
        }

        // if (this.moveTo) {
        //     this.myX = Math.floor(this.x);
        //     this.myY = Math.floor(this.y);

        //     if (this.moveTo && (this.myX != this.positionToMoveX || this.myY != this.positionToMoveY)) {
        //         this.x -= ((this.myX - this.positionToMoveX) / this.positionSpeed);
        //         this.y -= ((this.myY - this.positionToMoveY) / this.positionSpeed);
        //         this.body.velocity.x = 0;
        //         this.body.velocity.y = 0;
        //     } else if (this.moveTo) {
        //         this.body.velocity.x = this.oldVelocityX;
        //         this.body.velocity.y = this.oldVelocityY;
        //         this.useCollision = this.oldUseCollision;
        //         this.x = Math.floor(this.x);
        //         this.y = Math.floor(this.y);
        //         this.moveTo = false;
        //         if (typeof this.positionCallback === 'function') {
        //             this.positionCallback.call(this.game, this);
        //         }
        //     }
        // }
    }
}

export default Image;