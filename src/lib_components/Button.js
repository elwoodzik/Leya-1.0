import _ObjectSettings from './_ObjectSettings';

class Button extends _ObjectSettings {

    constructor(game, text, x, y, width, height, background, backgroundHover, strokeStyle, strokeStyleHover, textColor, action) {
        super();

        this.initializeGlobalSettings({
            game: game,
            pooled: false,
            context: 'main',
            x: x || 1,
            y: y || 1,
            key: null,
            width: width,
            height: height
        });

        this.fontSize = 42;
        this.fillStyle = background;
        this.fillStyleHover = backgroundHover;
        this.strokeStyle = strokeStyle;
        this.strokeStyleHover = strokeStyleHover;
        this.textColor = textColor;
        this.borderWidth = 2;

        this.textMarginX = 0;
        this.textMarginY = 0

        this.hold = false;

        this.text = text;
        this.action = action;
        this.zIndex = 5;
        this.hold = false;

        this.colors = ["#FFABAB", "#FFDAAB", "#DDFFAB", "#ABE4FF", "#D9ABFF"];
    }

    update() {
        // if (!this.touchActive) {
        //     this.game.mouse.touchIntersects(this, true);
        // }
        this.game.mouse.trigger(this, false, () => {
            if (typeof this.action === 'function') {
                this.action.call(this.game, this)
            }
        }, this.hold)

        this.game.mouse.onHover(this, null);
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

    draw() {
        if (this.objAlfa !== 1 && this.game.ctx.globalAlpha === 1) {
            this.game.ctx.save();
            this.game.ctx.globalAlpha = this.objAlfa;
        }

        if (this.hovered) {
            this.game.ctx.fillStyle = this.backgroundHover;
            this.fillCol = this.fillStyleHover ? this.fillStyleHover : 'transparent';
            this.strokeCol = this.strokeStyleHover;
        } else {
            this.game.ctx.fillStyle = this.background;
            this.fillCol = this.fillStyle ? this.fillStyle : 'transparent';;
            this.strokeCol = this.strokeStyle;
        }

        //draw button
        this.game.ctx.strokeStyle = this.strokeCol;
        this.game.ctx.fillStyle = this.fillCol;

        if (this.strokeStyle === null) {
            this.game.ctx.fillRect(this.x, this.y, this.currentWidth, this.currentHeight);
        } else if (this.fillStyle === null && this.fillStyleHover === null) {
            this.game.ctx.beginPath();
            this.game.ctx.rect(this.x, this.y, this.currentWidth, this.currentHeight);
            this.game.ctx.lineWidth = this.borderWidth;
            this.game.ctx.stroke();
            this.game.ctx.closePath();
        } else {

            this.game.ctx.beginPath();
            this.game.ctx.rect(this.x, this.y, this.currentWidth, this.currentHeight);
            this.game.ctx.lineWidth = this.borderWidth;
            this.game.ctx.stroke();
            this.game.ctx.fill();
            this.game.ctx.closePath();
        }
        //text options
        this.game.ctx.fillStyle = this.textColor;
        this.game.ctx.font = this.fontSize + "px Forte";
        this.textSize = this.game.ctx.measureText(this.text);
        //text position
        let textX = this.x + (this.currentWidth / 2) - (this.textSize.width / 2);
        let textY = this.y + this.currentHeight - this.currentHeight / 4;

        //draw the text
        this.game.ctx.fillText(this.text, textX + this.textMarginX, textY + this.textMarginY);
        // this.game.ctx.fillText(this.text, textX - this.game.camera.xScroll, textY - this.game.camera.yScroll);
        if (this.objAlfa !== 1) {
            this.game.ctx.restore();
        }
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

    get() {
        return this.text;
    }
};

export default Button;