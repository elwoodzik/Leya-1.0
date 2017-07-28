import _ObjectSettings from './_ObjectSettings';

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

        this.action = action;
        this.zIndex = 5;
        this.toggleTime = 300;
        this.fadeIn(this.toggleTime, null)
    }

    update() {
        this.game.mouse.trigger(this, false, () => {
            this.action.call(this.game, this)
        }, false)
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
};

export default ButtonImg;