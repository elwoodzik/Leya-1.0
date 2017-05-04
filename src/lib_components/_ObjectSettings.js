import AssetManager from './AssertManager';

class _ObjectSettings {

    initializeGlobalSettings(options) {

        this.AssetManager = AssetManager;

        this.game = options.game;
        this.pooled = options.pooled;
        this.contextType = options.context;
        this.x = options.x;
        this.y = options.y;
        this.key = options.key;
        this.isOutOfScreen = false;
        this.updateOfScreen = true;
        this.used = true;
        this.static = false;
        this.scale = 1;
        this.timeLocal = 0;
        this.hovered = false;
        this.touchActive = false;
        this.objAlfa = 1;
        this.playerControlled = true;
        this._arguments = this.setArguments(arguments[0]);
        
        if (this.key) {
            this.image = AssetManager.get(this.key);
        }

        this.currentWidth = options.width || (this.image ? this.image.width : 10);
        this.currentHeight = options.height || (this.image ? this.image.height : 10);

        this.currentHalfWidth = this.currentWidth / 2;
        this.currentHalfHeight = this.currentHeight / 2;

        this.useCollision = true;

        if (!this.pooled) {
            this.setContext(this.contextType);
        }
    }

    setArguments(_arguments){
        let _arg = [];
        Object.keys(_arguments).forEach( (ttt) => {
            if(ttt !== 'game'){
               _arg.push(_arguments[ttt]);
            }
           
        });
       return _arg;
    }

    worldBounce() {
        if (this.body.colideWorldSide) {
            if (this.body.colideWorldSideBottom && this.y + this.currentHeight > this.game.portViewHeight) {
                this.body.velocity.y = this.body.worldBounds ? this.body.velocity.y * -1 : 0;
                this.y = this.game.portViewHeight - this.currentHeight;
            }
            else if (this.body.colideWorldSideTop && this.y < 0) {
                this.body.velocity.y = this.body.worldBounds ? this.body.velocity.y * -1 : 0;
                this.y = 0;
            }
            if (this.body.colideWorldSideRight && this.x + this.currentWidth > this.game.portViewWidth) {
                this.body.velocity.x = this.body.worldBounds ? this.body.velocity.x * -1 : 0;
                this.x = this.game.portViewWidth - this.currentWidth;
            }
            else if (this.body.colideWorldSideLeft && this.x < 0) {
                this.body.velocity.x = this.body.worldBounds ? this.body.velocity.x * -1 : 0;
                this.x = 0;
            }
        }
    }

    changeContext(context, array) {
        if (this.contextType != context) {
            this.destroy(array);
            this.setContext(context);
        }
        return this;
    }

    setContext(context) {
        if (context) {
            if (context === 'main') {
                this.context = this.game.ctx;
                this.contextType = context;
                this.gameObjectLength = this.game.gameObject.length;
                this.game.gameObject[this.gameObjectLength] = this;
            } else if (context === 'background') {
                this.context = this.game.bgctx;
                this.contextType = context;
                this.gameObjectStaticLength = this.game.gameObjectStatic.length;
                this.game.gameObjectStatic[this.gameObjectStaticLength] = this;
                //this.redraw(); 
            }
            else if (context === 'onbackground') {
                this.context = this.game.onbgctx;
                this.contextType = context;
                this.gameObjectOnStaticLength = this.game.gameObjectOnStatic.length;
                this.game.gameObjectOnStatic[this.gameObjectOnStaticLength] = this;
                //this.redraw();
            } else {
                return console.error("Niepoprawna nazwa Contextu. Dostępne nazwy to: \n1. background \n2. onbackground \n3. main")
            }
        }
    }

    setIndex(index) {
        this.zIndex = index;
        this.game.gameObject.sort((obj1, obj2) => {
            if (obj1.zIndex > obj2.zIndex)
                return 1;
            else if (obj1.zIndex < obj2.zIndex) {
                return -1;
            } else {
                return 0;
            }
        });
    }

    setScale(scale) {
        this.scale = scale;
    }

    scaleUp(too, speed, callback) {
        this.scaleUpTrig = true;
        this.scaleSpeed = speed;
        this.scaleToo = too;
        this.scallUpCallback = callback;
    }

    scaleDown(too, speed, callback) {
        this.scaleDownTrig = true;
        this.scaleSpeed = speed;
        this.scaleToo = too;
        this.scallDownCallback = callback;
    }

    scaleUpDownHandler() {
        if (this.scaleUpTrig) {
            if (this.scale < this.scaleToo) {
                this.scale += this.scaleSpeed;
                if(this.scale > this.scaleToo){
                    this.scale = this.scaleToo;
                }
            } else {
                this.scaleUpTrig = false;
                if (typeof this.scallUpCallback === 'function') {
                    this.scallUpCallback();
                }

            }
        } else if (this.scaleDownTrig) {
            if (this.scale > this.scaleToo) {
                this.scale -= this.scaleSpeed;
            } else {
                this.scaleDownTrig = false;
                this.scale = 1;
                if (typeof this.scallDownCallback === 'function') {
                    this.scallDownCallback();
                }
            }
        }
    }

    destroy(array) {
        if (Array.isArray(array)) {
            array.splice(array.indexOf(this), 1);
        }
        this.x = -500;
        this.y = -500;
        return this.game.gameObject.splice(this.game.gameObject.indexOf(this), 1);
    }

    kill(array) {
        if (Array.isArray(array)) {
            array.splice(array.indexOf(this), 1);
        }
    }

    doInTime(time, callback) {
        this.timeLocal = 0;
        this.timeMax = time;
        this.timeCallback = callback;
        this.inTime = true;
    }

    doInTimeHandler() {
        if (this.inTime) {
            this.timeLocal += 1 / 60 * 1000;
            
            if (this.timeLocal > this.timeMax) {
                this.timeLocal = 0;
                this.inTime = false;
                this.timeCallback.call(this, this);
            }
        }
    }

    stop(){
        this.inTime = false;
    }

    fadeOut(time, callback){
        this.timerFade = time;
        this.currentTimerFade = time;
        this.timerFadeMin = 0;
        this.timerCallback = callback;
        this.timerFadeOutActive = true; 
    }

    fadeIn(time, callback){
        this.timerFade = time;
        this.currentTimerFade = 0;
        this.timerFadeMin = 0;
        this.timerCallback = callback;
        this.timerFadeInActive = true; 
    }

    fadeOutHandler(){
        if (this.timerFadeOutActive) {

            this.currentTimerFade -= 1 / 60 * 1000;
            this.objAlfa = this.currentTimerFade / this.timerFade;
            
            if(this.currentTimerFade < 0){
                this.objAlfa = 0;
                this.timerFadeOutActive = false;
                if(typeof this.timerCallback === 'function'){
                    return this.timerCallback.call();
                } 
            }
        }
    }

    fadeInHandler(){
        if (this.timerFadeInActive) {

            this.currentTimerFade += 1 / 60 * 1000;
            this.objAlfa = this.currentTimerFade / this.timerFade;
            
            if(this.currentTimerFade > this.timerFade){
                this.timerFadeInActive = false;
                this.objAlfa = 1;
                if(typeof this.timerCallback === 'function'){
                    return this.timerCallback.call();
                } 
            }
        }
    }
}

export default _ObjectSettings;