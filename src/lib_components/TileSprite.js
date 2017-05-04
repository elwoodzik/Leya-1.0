import _ObjectSettings from './_ObjectSettings';

class TileSprite extends _ObjectSettings {

    constructor(game, pooled, context, x, y, key, width, height) {
        super();

        this.initializeGlobalSettings({
            game: game,
            pooled: pooled || false,
            context: context || 'main',
            x: x || 1,
            y: y || 1,
            key: key,
            width: width,
            height: height
        });

        this.velocity = {
            x: 0,
            y: 0
        };

        this.zIndex = 2;

        this.width = width || this.image.width;
        this.height = height || this.image.height;
    }

    draw() {
         if (this.objAlfa !== 1) {
            this.game.ctx.save();
            this.game.ctx.globalAlpha = this.objAlfa;
        }
        
        for (var w = 0; w < this.game.canvas.width; w += this.image.width) {
            for (var h = 0; h < this.game.canvas.height; h += this.image.height) {

                this.game.ctx.drawImage(
                    this.image,
                    0,
                    0,
                    this.image.width,
                    this.image.height,
                    w + this.x - this.game.camera.xScroll, // * this.scale
                    h - this.y - this.game.camera.yScroll, // * this.scale
                    this.currentWidth,
                    this.currentHeight
                );

                this.game.ctx.drawImage(
                    this.image,
                    0,
                    0,
                    this.image.width,
                    this.image.height,
                    w + this.x + this.width - this.game.camera.xScroll, // * this.scale
                    h - this.y - this.game.camera.yScroll, // * this.scale
                    this.currentWidth,
                    this.currentHeight
                )
            }
        }
        
        if (this.objAlfa !== 1) {
            this.game.ctx.restore();
        }
    }

    update() {
        if (this.velocity.x != 0) {
            this.x += this.velocity.x;
        }
        if (this.velocity.y != 0) {
            this.y += this.velocity.y;
        }

        if (this.x + this.width < 0) {
            this.x = 0
        }
        if (this.y + this.height < 0) {
            this.y = 0
        }
        
    }
}

export default TileSprite;