import _ObjectSettings from './_ObjectSettings';

class DialogImg extends _ObjectSettings {

    constructor(game, x, y, width, height, key, close) {

        super();

        this.initializeGlobalSettings({
            game: game,
            pooled: false,
            context: 'main',
            x: x || 1,
            y: y || 1,
            key: key || null,
            width: width,
            height: height
        });

        this.objAlfa = 0;
        this.toggleTime = 300;

        this.addedObjects = {};
        this.game.VAR.pause = true;


        this.fadeIn(this.toggleTime, null)
        if (close) {
            this.addedObjects['close'] = this.game.add.buttonImg('main', 'x_icon', 'x_icon', this.x + this.currentWidth - 30, this.y + 22, null, null, () => {
                this.close();
                
            });
            this.addedObjects['close'].objAlfa = 0;
        }

    }

    add(callback) {
        if (typeof callback === 'function') {
            return callback.call(this, this, this.addedObjects);
        }
    }

    close() {
        this.game.VAR.pause = false;
        for (let obj in this.addedObjects) {
            if (this.addedObjects[obj]) {
                this.addedObjects[obj].fadeOut(this.toggleTime, () => {
                    this.addedObjects[obj].destroy();
                })
            }

        }
        this.fadeOut(this.toggleTime, () => {
            this.destroy();
        })

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
}

export default DialogImg;