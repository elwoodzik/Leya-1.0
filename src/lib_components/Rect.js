import _ObjectSettings from './_ObjectSettings';
import Body from './Body';

class Rect extends _ObjectSettings {

    constructor(game, pooled, context, x, y, width, height, strokeStyle, fillStyle) {
        super();

        this.initializeGlobalSettings({
            game: game,
            pooled: pooled || false,
            context: context || 'main',
            x: x || 0,
            y: y || 0,
            key: null,
            width: width,
            height: height
        });

        this.alfa = 1;

        this.body = new Body(this.game, this);
        this.zIndex = 2;

        this.strokeStyle = strokeStyle;
        this.fillStyle = fillStyle;

        this.borderWidth = 1;
    }

    draw(lag) {
        if (this.objAlfa !== 1 && this.game.ctx.globalAlpha === 1) {
            this.game.ctx.save();
            this.game.ctx.globalAlpha = this.objAlfa;
        }

        //this.useRotate();
        // if (this.alfa !== 1) {
        //     this.game.ctx.globalAlpha = this.alfa;
        // }

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
        this.game.ctx.strokeStyle = this.strokeStyle;
        this.game.ctx.lineWidth = this.borderWidth;
        this.game.ctx.fillStyle = this.fillStyle;

        if (this.strokeStyle === null) {
            this.game.ctx.fillRect(this.renderX - (!this.static ? this.game.camera.xScroll : 0), this.renderY - (!this.static ? this.game.camera.yScroll : 0), this.currentWidth * this.scale, this.currentHeight * this.scale);
        } else if (this.fillStyle === null) {
            this.game.ctx.beginPath();
            this.game.ctx.rect(this.renderX - (!this.static ? this.game.camera.xScroll : 0), this.renderY - (!this.static ? this.game.camera.yScroll : 0), this.currentWidth * this.scale, this.currentHeight * this.scale);
            this.game.ctx.stroke();
            //this.game.ctx.fill();
            this.game.ctx.closePath();
        } else {
            this.game.ctx.beginPath();
            this.game.ctx.rect(this.renderX - (!this.static ? this.game.camera.xScroll : 0), this.renderY - (!this.static ? this.game.camera.yScroll : 0), this.currentWidth * this.scale, this.currentHeight * this.scale);
            this.game.ctx.stroke();
            this.game.ctx.fill();
            this.game.ctx.closePath();
        }

        if (this.objAlfa !== 1) {
            this.game.ctx.restore();
        }
        this.fadeInHandler();
        this.fadeOutHandler();
    }

    update(dt) {
        this.worldBounce();
        this.scaleUpDownHandler();
        this.moveToPointHandler();

        this.x = (this.x + (dt * this.body.velocity.x));
        this.y = (this.y + (dt * this.body.velocity.y));
    }

    setBorderWidth(width) {
        this.borderWidth = width;
    }

    setAlfa(alfa) {
        this.alfa = alfa;
    }

    moveByLine(_mouseX, _mouseY, _speed, _maxDistance, _callback) {
        if (!_mouseX || !_mouseY) {
            return false;
        }
        let dx = (_mouseX - this.x - this.currentHalfWidth);
        let dy = (_mouseY - this.y - this.currentHalfHeight);
        let distance = Math.sqrt(dx * dx + dy * dy);
        let maxDistance = _maxDistance || 4;
        let speed = _speed || 4;
        this.body.angle = Math.atan2(dy, dx) * (180 / Math.PI);
        //this.body.rotate(this.body.angle / (180 / Math.PI));

        if (distance > maxDistance) {
            // if (Math.abs(dx) > 1 && Math.abs(dy) > 1) {

            this.body.velocity.x = Math.cos(this.body.angle / (180 / Math.PI)) * speed;
            this.body.velocity.y = Math.sin(this.body.angle / (180 / Math.PI)) * speed;
            //}
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
    }
};

export default Rect;