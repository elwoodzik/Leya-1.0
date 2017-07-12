import _ObjectSettings from './_ObjectSettings';
import Body from './Body';

class Text extends _ObjectSettings {

    constructor(game, context, text, x, y, size, color, action) {
        super();

        this.initializeGlobalSettings({
            game: game,
            pooled: false,
            context: context || 'main',
            x: x || 1,
            y: y || 1,
            key: null,
            width: 1,
            height: 1
        });

        this.fontSize = size;
        this.color = color;
        this.text = text;
        this.action = action;
        this.context.font = this.fontSize + "px Forte";

        this.body = new Body(this.game, this);

        this.textSize = this.context.measureText(this.text);

        this.useStroke = false;
        this.strokeColor = '#333';
        this.strokeWidth = 2;

        this.currentWidth = this.textSize.width;
        this.currentHeight = this.fontSize;
        this.currentHalfWidth = this.textSize.width / 2;
        this.currentHalfHeight = this.fontSize / 2;
        this.zIndex = 5;
        this.toggleTime = 0;
        this.fadeIn(this.toggleTime, null)
    }

    update(dt) {
        this.moveToPointHandler();
        this.doInTimeHandler();
    }

    draw() {
        if (this.objAlfa !== 1) {
            this.game.ctx.save();
            this.game.ctx.globalAlpha = this.objAlfa;
        }

        this.context.font = this.fontSize + "px Forte";
        this.context.fillStyle = this.color;
        this.context.fillText(this.text, this.x, this.y);
        if (this.useStroke) {
            this.context.lineWidth = this.strokeWidth;
            this.context.strokeStyle = this.strokeColor;
            this.context.strokeText(this.text, this.x, this.y);
        }

        if (this.objAlfa !== 1) {
            this.game.ctx.restore();
        }
        this.fadeInHandler();
        this.fadeOutHandler();
    }

    redraw() {
        this.context.fillStyle = this.color;
        this.context.font = this.fontSize + "px Forte";
        //this.currentWidth = this.textSize.width;
        this.context.fillText(this.text, this.x, this.y);
    }

    add(count) {
        this.text += count;
    }

    rem(count) {
        this.text -= count;
    }

    use(count) {
        this.text = count;
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

            if (this.moveTo && (this.myX != this.positionToMoveX && this.myY != this.positionToMoveY)) {
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

    remove(count) {
        return this.text -= count;
    }

    get() {
        return this.text;
    }
};

export default Text;