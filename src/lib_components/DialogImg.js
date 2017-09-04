import _ObjectSettings from './_ObjectSettings';
import Body from './Body';

class DialogImg extends _ObjectSettings {

    constructor(game, x, y, width, height, key, close = false) {

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

        this.zIndex = 3;

        this.body = new Body(this.game, this);

        this.addedObjects = {};
        this.game.VAR.pause = true;

        this.fadeIn(this.toggleTime, null)

        if (close.active) {
            close.staticX = 30;
            close.x = close.x || 0;
            close.y = close.y || 0;

            this.addedObjects['close'] = this.game.add.buttonImg('main', 'x_icon', 'x_icon', this.x + this.currentWidth - close.staticX + close.x, this.y + close.y, null, null, () => {
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

    achievement(options, callback) {
        if (typeof options !== 'object') {
            return console.error('zly typ parametru. Oczekiwano obiektu')
        }
        this.game.VAR.pause = false;
        const title = options.title;
        const desc = options.desc;
        const line = options.line || true;
        const time = options.time || false;
        const stars = options.stars || 0;
        const starsOn = options.starsOn || 3;
        const starsActive = options.starsActive || 0;
        const active = options.active;
        const index = options.index + 1 || 1;

        this.addedObjects['check'] = this.game.add.image('main', this.x + 15, this.y + 18, (active ? 'btn_check' : 'achi_btn'));
        this.addedObjects['check'].zIndex = 14;
        // this.addedObjects['check'].objAlfa = 0;
        // this.addedObjects['check'].fadeIn(1000, null);

        if (!active) {
            this.addedObjects['index'] = this.game.add.text('main', index, this.x + 37, this.y + 60, 40, 'white', null);
            this.addedObjects['index'].useStroke = true;
            this.addedObjects['index'].strokeColor = '#666';
            this.addedObjects['index'].strokeWidth = 2;
            this.addedObjects['index'].zIndex = 15;
        }

        if (title) {
            this.addedObjects['title'] = this.game.add.text('main', title, this.x + 90, this.y + 40, 30, 'white', null);
            this.addedObjects['title'].useStroke = true;
            this.addedObjects['title'].strokeColor = '#666';
            this.addedObjects['title'].strokeWidth = 2;
            this.addedObjects['title'].zIndex = 15;
        }
        if (line) {
            this.addedObjects['line'] = this.game.add.rect('main', this.x + 90, this.y + 52, this.currentWidth - 105, 1, '#444', '#444');
            this.addedObjects['line'].zIndex = 15;
        }
        if (desc) {
            this.addedObjects['desc1'] = this.game.add.text('main', desc, this.x + 90, this.y + 76, 18, '#444', null);
            this.addedObjects['desc1'].zIndex = 15;
        }

        // if (stars) {
        //     for (let i = 0; i < stars; i++) {
        //         this.addedObjects[`stars${i}`] = this.game.add.sprite('main', this.x + 35 + (i * 74), this.y + 100, 'starsAchi');
        //         this.addedObjects[`stars${i}`].animations.add('played', 0, 0, 35, 33, [0]);
        //         this.addedObjects[`stars${i}`].animations.add('idle', 35, 0, 35, 33, [0]);
        //         this.addedObjects[`stars${i}`].animations.play((starsActive > i ? 'played' : 'idle'));
        //         this.addedObjects[`stars${i}`].zIndex = 22;
        //         this.addedObjects[`stars${i}`].fadeIn(300, null);
        //         this.addedObjects[`stars${i}`].objAlfa = 0;
        //     }

        //     for (let i = 0; i < starsOn; i++) {
        //         setTimeout(() => {
        //             this.addedObjects[`stars${i}`].animations.play('played');
        //         }, (500 * i) + 500)
        //     }
        // }

        if (time) {
            this.doInTime(time, () => {
                this.close();
            })
        }

        if (callback && typeof callback === 'function') {
            return callback.call(this, this, this.addedObjects);
        }
    }

    close(now) {
        this.game.VAR.pause = false;

        for (let obj in this.addedObjects) {
            if (this.addedObjects[obj]) {
                if (now) {
                    this.addedObjects[obj].destroy();
                } else {
                    this.addedObjects[obj].fadeOut(300, () => {
                        //this.addedObjects[obj].used = false;
                        setTimeout(() => {
                            this.addedObjects[obj].destroy();
                        }, 100)
                        //
                    })
                }
            }
        }
        if (now) {
            this.destroy();
        } else {
            this.fadeOut(300, () => {
                //this.used = false;
                setTimeout(() => {
                    this.destroy();
                }, 100)
                //
            })
        }
    }

    hide(time) {
        this.game.VAR.pause = false;

        for (let obj in this.addedObjects) {
            if (this.addedObjects[obj]) {
                this.addedObjects[obj].fadeOut(time || this.toggleTime, () => {
                    this.addedObjects[obj].used = false;
                })
            }

        }
        this.fadeOut(time || this.toggleTime, () => {
            this.used = false;
        })
    }

    show(time) {
        this.game.VAR.pause = false;

        for (let obj in this.addedObjects) {
            if (this.addedObjects[obj]) {
                this.addedObjects[obj].fadeOut(time || this.toggleTime, () => {
                    this.addedObjects[obj].used = true;
                })
            }

        }
        this.fadeOut(time || this.toggleTime, () => {
            this.used = true;
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

    update(dt) {
        this.doInTimeHandler();
        this.moveToPointHandler();

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
}

export default DialogImg;