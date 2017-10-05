import _ObjectSettings from './_ObjectSettings';
import Body from './Body';
import GameAnimationFactory from './GameAnimationFactory';

class Sprite extends _ObjectSettings {

    constructor(game, pooled, context, x, y, key, width, height) {
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
        this.type = 'sprite';
        this.zIndex = 3;

        this.state = 'static';

        this.states = {
            'static': { sx: 0, sy: 0, fW: this.currentWidth, fH: this.currentHeight, f: [0] }
        };

        this.animations = new GameAnimationFactory(this);

        this.body = new Body(this.game, this);

        this.useRpgCollision = false;

        this.body.tolerance = 0;

        this.current_f = 0;
        this.change_f_delay = 0;
        this.f_max_delay = 4;
        this.playCallbackDellayCurrent = 0;
    }

    draw(dt) {
        if (this.objAlfa !== 1 && this.game.ctx.globalAlpha === 1) {
            this.game.ctx.save();
            this.game.ctx.globalAlpha = this.objAlfa;
        }


        if (this.previousX) {
            this.renderX = (this.x - this.previousX) * dt + this.previousX //this.x + (this.body.velocity.x * dt);                 
        } else {
            this.renderX = this.x;
        }
        if (this.previousY) {
            this.renderY = (this.y - this.previousY) * dt + this.previousY  //this.y + (this.body.velocity.y * dt);
        } else {
            this.renderY = this.y;
        }

        if (this.states[this.state].flip) {
            this.game.ctx.save();
            this.game.ctx.scale(-1, 1);
        }
        
        this.game.ctx.drawImage(
            this.image,
            this.states[this.state].sx + !this.states[this.state].horizontal ? this.states[this.state].f[this.current_f] * this.states[this.state].fW : 0,
            this.states[this.state].sy + this.states[this.state].horizontal ? this.states[this.state].f[this.current_f] * this.states[this.state].fH : 0,
            this.states[this.state].fW,
            this.states[this.state].fH,
            Math.floor(this.states[this.state].flip ? (-this.states[this.state].fW - this.renderX + (!this.static ? this.game.camera.xScroll : 0)) : Math.floor(this.renderX - (!this.static ? this.game.camera.xScroll : 0))), // * this.scale
            Math.floor(this.renderY - (!this.static ? this.game.camera.yScroll : 0)),// * this.scale
            this.states[this.state].fW * this.scale,
            this.states[this.state].fH * this.scale
        )

        if (this.states[this.state].flip) {
            this.game.ctx.restore();
        }

        if (this.useRpgCollision) {
            this.rowAndColumn();
        }

        if (this.objAlfa !== 1) {
            this.game.ctx.restore();
        }

        this.fadeInHandler();
        this.fadeOutHandler();
        //this.frameUpdate(dt);
    }

    redraw(dt) {
        if (this.previousX) {
            this.renderX = this.x + (this.body.velocity.x * dt);
        } else {
            this.renderX = this.x;
        }
        if (this.previousY) {
            this.renderY = this.y + (this.body.velocity.y * dt);
        } else {
            this.renderY = this.y;
        }

        if (this.states[this.state].flip) {
            this.game.ctx.save();
            this.game.ctx.scale(-1, 1);
        }

        //this.context.clearRect(this.renderX, this.renderY, this.image.width, this.image.height);
        this.frameUpdate();
        
        this.context.drawImage(
            this.image,
            this.states[this.state].sx + !this.states[this.state].horizontal ? this.states[this.state].f[this.current_f] * this.states[this.state].fW : 0,
            this.states[this.state].sy + this.states[this.state].horizontal ? this.states[this.state].f[this.current_f] * this.states[this.state].fH : 0,
            this.states[this.state].fW,
            this.states[this.state].fH,
            Math.floor(this.states[this.state].flip ? (-this.states[this.state].fW - this.renderX + (!this.static ? this.game.camera.xScroll : 0)) : Math.floor(this.renderX - (!this.static ? this.game.camera.xScroll : 0))), // * this.scale
            Math.floor(this.renderY - (!this.static ? this.game.camera.yScroll : 0)),// * this.scale
            this.states[this.state].fW * this.scale,
            this.states[this.state].fH * this.scale
        )

        if (this.states[this.state].flip) {
            this.game.ctx.restore();
        }

        if (this.useRpgCollision) {
            this.rowAndColumn();
        }
        //this.frameUpdate();
    }

    update(dt) {
        //this.body.useGravity(this);
        this.worldBounce();
        this.moveToPointHandler();
        this.useThereAndBack();
        this.scaleUpDownHandler();
        this.doInTimeHandler();
        this.moveToPointLinearHandler();

        if (this.body.velocity.x != 0 || this.body.velocity.y != 0) {
            this.x += (dt * this.body.velocity.x);
            this.y += (dt * this.body.velocity.y);
        }

        this.frameUpdate(dt);
    }

    updateWhenPositionChange(callback) {
        if ((this.previousX !== this.x || this.previousY !== this.y)) {
            if (typeof _callback === 'function') {
                _callback(this)
            }
        }
    }

    frameUpdate(dt) {
        if (!this.once) {
            if (this.change_f_delay < this.f_max_delay) {
                this.change_f_delay += (1) * (dt * 100);
            } else {
                this.change_f_delay = 0;
                this.current_f = this.current_f + 1 >= this.states[this.state].f.length ? 0 : this.current_f + 1;

                if (this.current_f === this.states[this.state].f.length - 1 && typeof this.playCallback === 'function') {
                    this.playCallbackDellayCurrent++;
                    if (this.playCallbackDellay === this.playCallbackDellayCurrent) {
                        this.playCallbackDellayCurrent = 0;
                        this.playCallback.call(this.game, this);
                    }
                }
            }
        } else {
            if (this.change_f_delay < this.f_max_delay) {
                this.change_f_delay++;
            } else {
                this.change_f_delay = 0;
                this.current_f = this.current_f + 1 >= this.states[this.state].f.length ? this.states[this.state].f.length - 1 : this.current_f + 1;

                if (this.current_f === this.states[this.state].f.length - 1 && typeof this.onceCallback === 'function') {
                    return this.onceCallback.call(this.game, this);
                }
            }
        }
    }

    rpgCollision() {
        this.useRpgCollision = this.useRpgCollision ? false : true;
    }

    thereAndBack(_dis, _dir, _speed) {
        this.thereAndBack_startX = this.x;
        this.thereAndBack_startY = this.y;
        if (_dir === 'right' || _dir === 'left') {
            this.thereAndBack_dis = _dir === 'right' ? this.x + _dis : this.x - _dis;
        } else {
            this.thereAndBack_dis = _dir === 'down' ? this.y + _dis : this.y - _dis;
        }

        this.thereAndBack_dir = _dir;
        this.thereAndBack_speed = _speed;
        this.thereAndBack_site = true;
        this.thereAndBackUsed = true;
    }

    useThereAndBack() {
        if (this.thereAndBackUsed) {
            if (this.thereAndBack_dir === 'right') {
                if (this.x < this.thereAndBack_dis && this.thereAndBack_site) {
                    this.body.velocity.x = this.thereAndBack_speed;
                } else if (this.x > this.thereAndBack_startX) {
                    this.thereAndBack_site = false;
                    this.body.velocity.x = -this.thereAndBack_speed / 2;
                } else {
                    this.thereAndBack_site = true;
                    this.body.velocity.x = this.body.velocity.x * (-1);
                }
            } else if (this.thereAndBack_dir === 'left') {
                if (this.x > this.thereAndBack_dis && this.thereAndBack_site) {
                    this.body.velocity.x = -this.thereAndBack_speed / 2;
                } else if (this.x < this.thereAndBack_startX) {
                    this.thereAndBack_site = false;
                    this.body.velocity.x = this.thereAndBack_speed;
                } else {
                    this.thereAndBack_site = true;
                    this.body.velocity.x = this.body.velocity.x * (-1);
                }
            }
            else if (this.thereAndBack_dir === 'up') {
                if (this.y > this.thereAndBack_dis && this.thereAndBack_site) {
                    this.body.velocity.y = -this.thereAndBack_speed / 2;
                } else if (this.y < this.thereAndBack_startY) {
                    this.thereAndBack_site = false;
                    this.body.velocity.y = this.thereAndBack_speed;
                } else {
                    this.thereAndBack_site = true;
                    this.body.velocity.y = this.body.velocity.y * (-1);
                }
            }
            else if (this.thereAndBack_dir === 'down') {
                if (this.y < this.thereAndBack_dis && this.thereAndBack_site) {
                    this.body.velocity.y = this.thereAndBack_speed;
                } else if (this.y > this.thereAndBack_startY) {
                    this.thereAndBack_site = false;
                    this.body.velocity.y = -this.thereAndBack_speed / 2;
                } else {
                    this.thereAndBack_site = true;
                    this.body.velocity.y = this.body.velocity.y * (-1);
                }
            }
        } else {
            return false;
        }
    }

    moveByLineToEnd(_mouseX, _mouseY, _speed, _maxDistance, type, _callback) {
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
                if (type === 'up') {
                    this.body.velocity.x = Math.cos((this.body.angle) / (180 / Math.PI)) * speed;
                    this.body.velocity.y = Math.sin((this.body.angle) / (180 / Math.PI)) * speed;
                }
                else if (type === 'down') {
                    this.body.velocity.x = Math.cos((this.body.angle) - 180 / (180 / Math.PI)) * speed;
                    this.body.velocity.y = Math.sin((this.body.angle) - 180 / (180 / Math.PI)) * speed;
                }
                if (type === 'left') {
                    this.body.velocity.x = Math.cos((this.body.angle - 90) / (180 / Math.PI)) * speed;
                    this.body.velocity.y = Math.sin((this.body.angle - 90) / (180 / Math.PI)) * speed;
                }
                else if (type === 'right') {
                    this.body.velocity.x = Math.cos((this.body.angle + 90) / (180 / Math.PI)) * speed;
                    this.body.velocity.y = Math.sin((this.body.angle + 90) / (180 / Math.PI)) * speed;
                }
            }
        } else {
            this.body.velocity.x = 0;//Math.cos(angle) * speed;
            this.body.velocity.y = 0;//Math.sin(angle) * speed;w

            if (typeof _callback === 'function') {
                this._callback.call(this.game, this);
            }
        }
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

    moveToPointLinear(x, y, speed, type, callback) {
        this.positionToLinearMoveX = Math.floor(x);
        this.positionToLinearMoveY = Math.floor(y);
        this.linearSpeed = speed;
        this.linearType = type;
        this.moveLinearTo = true;
        this.positionLinearCallback = callback;
    }

    moveToPointLinearHandler() {
        if (this.moveLinearTo) {
            if (this.linearType === 'down') {
                if (this.y <= this.positionToLinearMoveY) {
                    this.body.velocity.y = +this.linearSpeed;
                } else {
                    this.moveLinearTo = false;
                    this.positionLinearCallback.call(this.game, this);
                }
            } else if (this.linearType === 'up') {
                if (this.y >= this.positionToLinearMoveY) {
                    this.body.velocity.y = -this.linearSpeed;
                } else {
                    this.moveLinearTo = false;
                    this.positionLinearCallback.call(this.game, this);
                }
            } else if (this.linearType === 'right') {
                if (this.x <= this.positionToLinearMoveX) {
                    this.body.velocity.x = +this.linearSpeed;
                } else {
                    this.moveLinearTo = false;
                    this.positionLinearCallback.call(this.game, this);
                }
            } else if (this.linearType === 'left') {
                if (this.x >= this.positionToLinearMoveX) {
                    this.body.velocity.x = -this.linearSpeed;
                } else {
                    this.moveLinearTo = false;
                    this.positionLinearCallback.call(this.game, this);
                }
            }

        }
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

    setAtributes(options) {
        for (var i = 0; i < Object.keys(options).length; i++) {
            this[Object.keys(options)[i]] = options[Object.keys(options)[i]];
        }
    }
};

export default Sprite;