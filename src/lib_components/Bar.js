import _ObjectSettings from './_ObjectSettings'

class Bar extends _ObjectSettings {

    constructor(game, pooled, context, x, y, width, height, strokeStyle, fillStyle, min, max) {
        super();

        this.initializeGlobalSettings({
            game: game,
            pooled: pooled || false,
            context: context || 'main',
            x: x || 1,
            y: y || 1,
            key: null,
            width: width,
            height: height
        });

        this.max = max;
        this.min = min > this.max ? this.error() : min;

        this.currentStatusX = this.min;

        this.statusX = this.currentStatusX / this.max * width;

        this.zIndex = 4;

        this.lineWidth = 1;

        this.strokeStyle = strokeStyle;
        this.fillStyle = fillStyle;
    }

    draw(lag) {
        if (this.objAlfa !== 1) {
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

        this.game.ctx.fillStyle = this.fillStyle;

        if (this.strokeStyle) {
            this.game.ctx.beginPath();
            this.game.ctx.strokeStyle = this.strokeStyle;
            this.game.ctx.lineWidth = this.lineWidth;

            this.game.ctx.rect(this.renderX, this.renderY, this.currentWidth, this.currentHeight);
            this.game.ctx.stroke();
            //this.game.ctx.fill();
            this.game.ctx.closePath();
        }
        if (this.fillStyle) {
            this.game.ctx.fillRect(this.renderX + this.lineWidth, this.renderY + this.lineWidth, this.statusX - this.lineWidth * 2, this.currentHeight - this.lineWidth * 2);
        }

        if (this.objAlfa !== 1) {
            this.game.ctx.restore();
        }
    }

    setStatusX(statusX) {
        this.statusX = statusX / this.max * this.currentWidth;
    }

    error() {
        throw "BAR --> Minimalna wartosc nie moze byc wieksza od maksymalnej";
    }
}

export default Bar;