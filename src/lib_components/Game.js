// private
import GameStateFactory from './GameStateFactory';
import GameObjectFactory from './GameObjectFactory';
import Physic from './Physic';
import Mouse from './Mouse';
import Keyboard from './Keyboard';
import Logo from './Logo';
import Mobile from './Mobile';

let elapsed = 0,
    last = 0,
    step = 1 / 60,
    that;

class Game {
    constructor(width, height, orientation, scallable, mobile, callback) {
        that = this;

        this.width = width;

        this.height = height;

        this.VAR = {};

        this.ARR = {};

        this.CLASS = {};

        this.add = new GameObjectFactory(this);

        this.state = new GameStateFactory(this);

        this.mobile = new Mobile(this, mobile);

        // this.world = new World(this);

        this.mouse = new Mouse(this);

        this.keyboard = new Keyboard(this);

        this.physic = new Physic(this);

        this.camera = {
            xScroll: 0,
            yScroll: 0
        };

        this.globalAlfa = 1;

        this.map = null;

        this.renderer = true;

        this.states = {};
        this.gameObject = [];
        this.gameSpritesPoolObject = [];
        this.gameObjectStatic = [];
        this.gameObjectOnStatic = [];
        //
        this.createCanvas(width, height, orientation);

        this.scallable(scallable);
        this.callback = callback;
        this.useFpsCounter = false;

        // this.state.add('Logo', Logo);
        // this.state.start('Logo');
        this.callback.call(this, this);

    }

    fadeOut(time, key, callback) {
        this.ctx.globalAlpha = 1;
        this.timerFade = time;
        this.currentTimerFade = time;
        this.timerCallback = callback;
        this.timerFadeOutActive = true;
        this.timerFadeInActive = false;
        this.mouse.used = false;
    }

    fadeIn(time, callback) {
        this.timerFade = time;
        this.currentTimerFade = 0;
        this.timerCallback = callback;
        this.timerFadeInActive = true;
    }

    fadeOutHandler() {
        if (this.timerFadeOutActive) {

            this.currentTimerFade -= 1 / 60 * 1000;
            this.ctx.globalAlpha = this.currentTimerFade / this.timerFade;

            if (this.currentTimerFade <= 0) {

                this.ctx.globalAlpha = 0;
                this.timerFadeOutActive = false;
                if (typeof this.timerCallback === 'function') {
                    return this.timerCallback.call();
                }
            }
        }
    }

    fadeInHandler() {
        if (this.timerFadeInActive) {

            this.currentTimerFade += 1 / 60 * 1000;
            this.ctx.globalAlpha = this.currentTimerFade / this.timerFade;

            if (this.currentTimerFade > this.timerFade) {
                this.timerFadeInActive = false;
                this.ctx.globalAlpha = 1;
                this.mouse.used = true;
                if (typeof this.timerCallback === 'function') {
                    return this.timerCallback.call();
                }
            }
        }
    }

    animationLoop(timestamp) {
        if (this.useFpsCounter) {
            this.fpsmeter.tickStart();
        }

        if (!timestamp) {
            timestamp = 0;
            last = 0;
        }

        elapsed = elapsed + Math.min(1, (timestamp - last) / 1000);

        while (elapsed >= step) {
            this.capturePreviousPositions(this.gameObject);

            this.update(step);

            elapsed -= step;
        }

        this.render(elapsed);

        last = timestamp;

        if (this.useFpsCounter) {
            this.fpsmeter.tick();
        }

        window.requestAnimationFrame(this.animationLoop.bind(this));
    }

    render(dt) {
        if (this.renderer) {
            this.clearCanvas(this.ctx);
            this.fadeOutHandler();
            this.fadeInHandler();

            for (let i = 0, iMax = this.gameObject.length; i < iMax; i++) {
                let entityRender = this.gameObject[i];
                if (entityRender && entityRender.draw && entityRender.contextType === 'main' && entityRender.used) {

                    if (!entityRender.isOutOfScreen) {
                        if (entityRender.body && entityRender.body.angle != 0) {
                            //this.ctx.save();
                            this.ctx.translate(entityRender.x + entityRender.currentWidth * entityRender.body.anchorX, entityRender.y + entityRender.currentHeight * entityRender.body.anchorY);
                            this.ctx.rotate(entityRender.body.angle * Math.PI / 180);
                            this.ctx.translate(-entityRender.x - entityRender.currentWidth * entityRender.body.anchorX, -entityRender.y - entityRender.currentHeight * entityRender.body.anchorY);
                        }

                        entityRender.draw(dt);

                        if (entityRender.body && entityRender.body.angle != 0) {
                            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
                            //this.ctx.restore();
                        }
                    }
                }
                entityRender = null;
            }
        }
    }

    update(dt) {
        for (let u = 0, uMax = this.gameObject.length; u < uMax; u++) {
            let entityUpdate = this.gameObject[u];
            //if(!entityUpdate.isOutOfScreen && entityUpdate.used){            
            if (entityUpdate && entityUpdate.update && entityUpdate.used) {
                if (entityUpdate.updateOfScreen) {

                    entityUpdate.update(dt);
                } else if (!entityUpdate.updateOfScreen && !entityUpdate.isOutOfScreen) {
                    entityUpdate.update(dt);
                }
            }
            entityUpdate = null;
            //}
        }
        if (this.currentState && typeof this.currentState.update === 'function') {
            this.currentState.update.call(this, dt);
        }
    }

    createCanvas(width, height, orientation) {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext("2d");
        this.screenWidth = width || 960;
        this.screenHeight = height || 540;
        this.portViewWidth = width;
        this.portViewHeight = height;
        this.orientation = orientation || false;
        this.canvas.style.zIndex = 5;
        this.canvas.id = "main";
        this.canvas.width = ((this.screenWidth));
        this.canvas.height = ((this.screenHeight));

        this.canvas.style.width = this.canvas.width + "px";
        this.canvas.style.height = this.canvas.height + "px";

        if (!this.mobile.active) {
            this.canvas.style.position = 'absolute';
            this.canvas.style.left = '50%';
            this.canvas.style.marginLeft = -this.canvas.width / 2 + "px";
            this.scale1 = 1;
        }

        document.body.style.overflow = 'hidden';

        document.body.appendChild(this.canvas);

        this.animationLoop();
    }

    createBgCanvas(index) {
        this.bgcanvas = document.createElement('canvas');
        this.bgctx = this.bgcanvas.getContext("2d");

        this.bgcanvas.style.zIndex = index || 3;
        this.bgcanvas.id = "background";
        this.bgcanvas.width = ((this.screenWidth));
        this.bgcanvas.height = ((this.screenHeight));

        if (!this.mobile.active) {
            this.bgcanvas.style.position = 'absolute';
            this.bgcanvas.style.left = '50%';
            this.bgcanvas.style.marginLeft = -this.screenWidth / 2 + "px";
        }

        document.body.appendChild(this.bgcanvas);
    }

    createOnBgCanvas(index) {
        this.onbgcanvas = document.createElement('canvas');
        this.onbgctx = this.onbgcanvas.getContext("2d");

        this.onbgcanvas.style.zIndex = index || 4;
        this.onbgcanvas.id = "onbackground";
        this.onbgcanvas.width = ((this.screenWidth));
        this.onbgcanvas.height = ((this.screenHeight));

        if (!this.mobile.active) {
            this.onbgcanvas.style.position = 'absolute';
            this.onbgcanvas.style.left = '50%';
            this.onbgcanvas.style.marginLeft = -this.onbgcanvas.width / 2 + "px";
        }

        document.body.appendChild(this.onbgcanvas);
    }

    resizeCanvas(canvas, orientation) {
        if (!orientation) {
            const w = window.innerWidth;
            const h = window.innerHeight;

            this.portViewWidth = this.portViewWidth;
            this.portViewHeight = this.portViewHeight;

            if (this.scaleUsed) {
                this.scale1 = Math.max(0.2, Math.min(
                    (Math.min(w, w) / this.screenWidth),
                    (Math.min(h, h) / this.screenHeight)
                ));

                let width = Math.min(Math.floor(this.screenWidth * this.scale1), w);
                let height = Math.min(Math.floor(this.screenHeight * this.scale1), h);

                canvas.style.width = width + "px";
                canvas.style.height = height + "px";
              
                if (!this.mobile.active) {
                    canvas.style.position = 'absolute';
                    canvas.style.left = '50%';
                    canvas.style.marginLeft = -width / 2 + "px";
                }
            } else {
                this.scale1 = 1;
                canvas.style.width = this.portViewWidth + "px";
                canvas.style.height = this.portViewHeight + "px";
                if (!this.mobile.active) {
                    canvas.style.position = 'absolute';
                    canvas.style.left = '50%';
                    canvas.style.marginLeft = -this.screenWidth / 2 + "px";
                }
            }
        } else {
            const w = window.innerHeight;
            const h = window.innerWidth;

            this.portViewWidth = this.portViewHeight;
            this.portViewHeight = this.portViewWidth;

            this.scale1 = Math.max(0.2, Math.min(
                (w / this.screenWidth),
                (h / this.screenHeight)
            ));

            let width = Math.floor(this.screenWidth * this.scale1);
            let height = Math.floor(this.screenHeight * this.scale1);

            canvas.style.width = height + "px";
            canvas.style.height = width + "px";
        }
    }

    scallable(bool) {
        this.scaleUsed = bool;
        this.resizeCanvas(this.canvas, this.orientation);

        if (this.bgcanvas) {
            this.resizeCanvas(this.bgcanvas, this.orientation);
        }
        if (this.onbgcanvas) {
            this.resizeCanvas(this.onbgcanvas, this.orientation);
        }
        window.removeEventListener("resize", () => this.scallableFunction());
        if (bool) {
            window.addEventListener("resize", () => this.scallableFunction());
        }
    }

    scallableFunction() {
        this.resizeCanvas(this.canvas, this.orientation);

        if (this.bgcanvas) {
            this.resizeCanvas(this.bgcanvas, this.orientation);
        }
        if (this.onbgcanvas) {
            this.resizeCanvas(this.onbgcanvas, this.orientation);
        }
    }

    sortByIndex() {
        this.gameObject.sort((obj1, obj2) => {
            if (!obj1.zIndex) {
                obj1.zIndex = 1;
            }

            if (obj1.zIndex > obj2.zIndex)
                return 1;
            else if (obj1.zIndex < obj2.zIndex) {
                return -1;
            } else {
                return 0;
            }
        });
    }

    clearCanvas(context) {
        context.clearRect(0, 0, this.width, this.height);
    }

    rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    randF(min, max) {
        return (Math.random() * (max - min + 1)) + min;
    }

    saveData(name, data) {
        localStorage.setItem(name, JSON.stringify(data));
    }

    saveDataAd(name, data) {
        let oldItems = this.loadData(name) || [];
        oldItems.push(data);

        localStorage.setItem(name, JSON.stringify(oldItems));
    }

    loadData(name) {
        const data = localStorage.getItem(name);
        //
        if (data) {
            return JSON.parse(data);
        }
        else {
            return false;
        }
    }

    removeData(name) {
        localStorage.removeItem(name);
    }

    capturePreviousPositions(entities) {
        for (let u = 0, uMax = entities.length; u < uMax; u++) {
            let entityCapture = entities[u];
            if (entityCapture.used) {
                entityCapture.previousX = entityCapture.x;
                entityCapture.previousY = entityCapture.y;
            }
            entityCapture = null;
        }
    }

    shuffle(arr) {
        let counter = arr.length;
        let tmp;
        let index;
        while (counter > 0) {
            counter--;
            index = Math.floor(Math.random() * counter);
            //
            tmp = arr[counter];
            //
            arr[counter] = arr[index];
            //
            arr[index] = tmp;
        }
        return arr;
    }

    showFPS() {
        this.fpsmeter = new FPSMeter({ decimals: 0, graph: false, theme: 'dark', left: '5px' });
        this.useFpsCounter = true;
    }

    mobile() {

    }


}
export default Game;

Object.defineProperty(Function.prototype, 'setupPool', { value: setupPool });

function setupPool(initialPoolSize, context) {
    if (!initialPoolSize || !isFinite(initialPoolSize)) throw ('setupPool takes a size > 0 as argument.');
    this.pool = [];
    this.pollActive = [];
    this.poolSize = 0;
    this.poolActiveSize = 0;
    this.pnew = pnew;
    this.getActivePool = getActivePool;
    this.getId = getId;
    Object.defineProperty(this.prototype, 'pdispose', { value: pdispose });
    // pre-fill the pool.
    while (initialPoolSize-- > 0) {
        (new this(that, false, context)).pdispose();
        this.pollActive[initialPoolSize] = null;
    }
    //console.log(this.pollActive)
    return this.pool;
}

function getActivePool() {
    return this.pollActive;
}

function pnew() {

    var pnewObj = null;
    if (this.poolSize !== 0) {
        // the pool contains objects : grab one
        this.poolSize--;
        pnewObj = this.pool[this.poolSize];

        this.pool[this.poolSize] = null;
        this.poolActiveSize++;

        this.pollActive[this.getId()] = pnewObj;
    } else {
        // the pool is empty : create new object
        pnewObj = new this();
        this.pollActive[this.poolSize] = pnewObj;
    }

    this.apply(pnewObj, arguments);           // initialize object
    return pnewObj;
}

function getId() {
    for (var i = 0; i < this.pollActive.length; i++) {
        if (this.pollActive[i] === null) {
            return i;
        }
    }
    return this.pollActive.length;
}

function pdispose() {
    var thisCttr = this.constructor;
    this.used = false;
    this.pooled = true;

    if (this.dispose) this.dispose(); // Call dispose if defined
    // throw the object back in the pool
    if (thisCttr.poolActiveSize !== 0) {
        var id = thisCttr.pollActive.indexOf(this)
        thisCttr.poolActiveSize--;
        thisCttr.pollActive[id] = null;
    }
    this.x = -1000;
    this.y = -1000;
    this.renderX = -1000;
    this.renderY = -1000;
    this.previousX = -1000;
    this.previousY = -1000;
    thisCttr.pool[thisCttr.poolSize++] = this;
}