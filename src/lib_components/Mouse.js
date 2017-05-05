
class Mouse{

    constructor(game) {
        this.game = game;
        //
        this.used = true;
        this.click = false;
        this.hover = false;
        this.down = false;
        this.trig = false;
        this.sellectedObj = false;
        this.mouseX = null;
        this.mouseY = null;
        this.currentTouches = [];
        this.touchesIntersects = [];
        this.currentTouchesActive = [];
    }

    initialize() {
        this.game.canvas.addEventListener("mousemove", (e) => { this.mouseMove(e) }, false);
        this.game.canvas.addEventListener("mousedown", (e) => { this.mouseDown(e) }, false);
        this.game.canvas.addEventListener("touchstart", (e) => { this.touchStart(e) }, false);
       // this.game.canvas.addEventListener("touchmove", (e) => { this.touchMove(e) }, false);
        this.game.canvas.addEventListener("touchend", (e) => { this.touchEnded(e) }, false);
        this.game.canvas.addEventListener("mouseup", (e) => { this.mouseUp(e) }, false);
    }

    findCurrentActiveTouchIndex(id) {
        for (let i = 0; i < this.currentTouchesActive.length; i++) {
            if (this.currentTouchesActive[i].id === id) {
                return i;
            }
        }
        // Touch not found! Return -1.
        return -1;
    }

    findCurrentTouchIndex(id) {
        for (let i = 0; i < this.currentTouches.length; i++) {
            if (this.currentTouches[i].id === id) {
                return i;
            }
        }
        // Touch not found! Return -1.
        return -1;
    }

    mouseMove(e) {
        e.preventDefault();
        this.mouseX = e.offsetX / this.game.scale1;
        this.mouseY = e.offsetY / this.game.scale1;
    }

    touchStart(e) {
        e.preventDefault();
        const touches = event.changedTouches;
        // let touch = e.changedTouches[0];

        for (let i = 0; i < touches.length; i++) {
            let touch = touches[i];

            this.currentTouches.push({
                id: touch.identifier,
                pageX: touch.pageX,
                pageY: touch.pageY,
                interactive: false,
                obj: null
            });
        }
    }

    touchEnded(e) {
        const touches = event.changedTouches;

        for (let i = 0; i < touches.length; i++) {
            let touch = touches[i];
            let currentTouchActiveIndex = this.findCurrentActiveTouchIndex(touch.identifier);

            if (currentTouchActiveIndex >= 0) {
                let currentActiveTouch = this.currentTouchesActive[currentTouchActiveIndex];
                if (currentActiveTouch.obj) {
                    currentActiveTouch.obj.touchActive = false;
                    currentActiveTouch.obj.hovered = false;
                }

                this.currentTouchesActive.splice(currentTouchActiveIndex, 1);
            } else {
                console.log('Touch active was not found!');
            }

            let currentTouchIndex = this.findCurrentTouchIndex(touch.identifier);

            if (currentTouchIndex >= 0) {
                //let currentTouch = this.currentTouches[currentTouchIndex];

                this.currentTouches.splice(currentTouchIndex, 1);
            } else {
                console.log('Touch was not found!');
            }
        }
    }

    mouseDown(e) {
        e.preventDefault();
        //
        this.click =  this.used ? true : false;
        this.down = true;
        this.trig = false;
    }

    mouseUp(e) {
        e.preventDefault();
        //
        this.down = false;
        this.click = false;
    }

    intersects(obj, immovable) {
        const t = 2; //tolerance
        let tempMouseY = this.mouseY;
        let tempMouseX = this.mouseX;

        if (!immovable) {
            tempMouseX = tempMouseX + (this.game.camera.xScroll);
            tempMouseY = tempMouseY + (this.game.camera.yScroll);
        }

        let xIntersect = (tempMouseX + t) >= obj.x && (tempMouseX + t) <= obj.x + obj.currentWidth;
        let yIntersect = (tempMouseY + t) >= obj.y && (tempMouseY - t) <= obj.y + obj.currentHeight;

        return xIntersect && yIntersect;
    }

    touchIntersects(obj, immovable, callback) {
        const t = 2; //tolerance
        if (Array.isArray(obj)) {
            for (let i = 0; i < this.currentTouches.length; i++) {
                for (let j = 0; j < obj.length; j++) {

                    if (!obj[j].touchActive && !obj[j].hovered) {
                        let tempMouseY = this.currentTouches[i].pageY / this.game.scale1;
                        let tempMouseX = (this.currentTouches[i].pageX - this.game.canvas.offsetLeft) / this.game.scale1;

                        if (!immovable) {
                            tempMouseX = tempMouseX + (this.game.camera.xScroll);
                            tempMouseY = tempMouseY + (this.game.camera.yScroll);
                        }

                        let xIntersect = (tempMouseX + t) >= obj[j].x && (tempMouseX + t) <= obj[j].x + obj[j].currentWidth;
                        let yIntersect = (tempMouseY + t) >= obj[j].y && (tempMouseY - t) <= obj[j].y + obj[j].currentHeight;

                        this.currentTouches[i].interactive = xIntersect && yIntersect;

                        if (this.currentTouches[i].interactive) {
                            obj[j].touchActive = true;
                            obj[j].hovered = true;

                            this.currentTouchesActive.push({
                                id: this.currentTouches[i].id,
                                obj: obj[j]
                            });

                            callback.call(this, obj[j]);
                        }
                    }
                }
            }
        } else {
            for (let i = 0; i < this.currentTouches.length; i++) {

                if (!obj.touchActive && !obj.hovered) {
                    let tempMouseY = this.currentTouches[i].pageY / this.game.scale1;
                    let tempMouseX = (this.currentTouches[i].pageX - this.game.canvas.offsetLeft) / this.game.scale1;

                    if (!immovable) {
                        tempMouseX = tempMouseX + (this.game.camera.xScroll);
                        tempMouseY = tempMouseY + (this.game.camera.yScroll);
                    }

                    let xIntersect = (tempMouseX + t) >= obj.x && (tempMouseX + t) <= obj.x + obj.currentWidth;
                    let yIntersect = (tempMouseY + t) >= obj.y && (tempMouseY - t) <= obj.y + obj.currentHeight;

                    this.currentTouches[i].interactive = xIntersect && yIntersect;

                    if (this.currentTouches[i].interactive) {

                        obj.touchActive = true;
                        obj.hovered = true;

                        this.currentTouchesActive.push({
                            id: this.currentTouches[i].id,
                            obj: obj
                        });

                        this.currentTouches.splice(i, 1);
                        //return false; 
                    }
                }
            }
        }
    }

    intersectsSprite(obj, immovable) {
        const t = 2; //tolerance

        const xIntersect = (this.mouseX + t) >= obj.x && (this.mouseX + t) <= obj.x + obj.states[obj.state].fW;
        const yIntersect = (this.mouseY + t) >= obj.y && (this.mouseY - t) <= obj.y + obj.states[obj.state].fH;

        return xIntersect && yIntersect;
    }

    updateHoverStats(obj) {
        if (this.intersects(obj)) {
            obj.hovered = true;
            return true;
        } else {
            obj.hovered = false;
        }
    }

    updateStats(obj, immovable, hold) {
        if (this.intersects(obj, immovable)) {
            obj.hovered = true;
            if(!hold){
                this.click = false;
            }
            return true;
        } else {
            obj.hovered = false;
            return false;
        }
    }

    touchtrigger(obj, immovable, callback, hold) {
        if (this.click) {
            //  console.log('aaa')
            if (!this.trig) {
                this.trig = hold ? true : false;

                if (Array.isArray(obj)) {
                    for (let u = obj.length - 1; u >= 0; u--) {
                        if (this.updateTouchStats(obj[u], immovable, hold)[u]) {
                            callback.call(this, obj[u]);
                        }
                    }
                    this.trig = false;
                    return false
                }
                else if (typeof obj === 'object' && obj != null) {
                    let tab = this.updateTouchStats(obj, immovable, hold);

                    for (let i = 0; i < tab.length; i++) {
                        if (tab[i]) {
                            callback.call(this, obj);
                        }
                    }
                    this.trig = false;
                    return false
                }
                else if (obj === null) {
                    if (typeof callback === 'function') {
                        this.click = false;
                        this.trig = false;
                        this.down = false;
                        callback.call(this);
                    }
                }
            }
        }
    }

    trigger(obj, immovable, callback, hold) {
        if (this.click) {
            if (!this.trig) {

                this.trig = hold ? true : false;

                if (Array.isArray(obj)) {
                    for (let u = obj.length - 1; u >= 0; u--) {
                        if (this.updateStats(obj[u], immovable, hold)) {
                            callback.call(this, this, obj[u]);
                        }
                    }
                    this.trig = false;
                }
                else if (typeof obj === 'object' && obj != null) {
                    if (this.updateStats(obj, immovable, hold)) {
                        callback.call(this, this, obj);
                    }
                    this.trig = false;
                }
                else if (obj === null) {
                    if (typeof callback === 'function') {
                        //this.click = false;
                        this.trig = false;
                        this.down = false;
                        callback.call(this, this,);
                    }
                }
            }
        }
    }

    sellect(obj, immovable, callback, hold) {
        if (this.click) {
            if (!this.trig) {

                this.trig = hold ? true : false;
                if(this.sellectedObj === obj){
                    console.log('a')
                    return;
                }
                if (Array.isArray(obj)) {
                    for (let u = obj.length - 1; u >= 0; u--) {
                        if (this.updateStats(obj[u], immovable, hold)) {
                            if(this.sellectedObj){
                                this.sellectedObj.sellectedObj = false;
                            }
                            this.sellectedObj = obj;
                            this.sellectedObj.sellected = true;
                            callback.call(this, obj[u]);
                        }
                    }
                    this.trig = false;
                }
                else if (typeof obj === 'object' && obj != null) {
                    if (this.updateStats(obj, immovable, hold)) {
                        if(this.sellectedObj){
                            this.sellectedObj.sellected = false;
                        }
                        this.sellectedObj = obj;
                        this.sellectedObj.sellected = true;
                        callback.call(this, obj);
                    }
                    this.trig = false;
                }
                else if (obj === null) {
                    if (typeof callback === 'function') {
                        this.click = false;
                        this.trig = false;
                        this.down = false;
                        if(this.sellectedObj){
                            this.sellectedObj.sellected = false;
                        }
                        this.sellectedObj = obj;
                        this.sellectedObj.sellected = true;
                        callback.call(this);
                    }
                }
            }
        }
    }

    onHover(obj, callback, hold) {
        if (Array.isArray(obj)) {
            for (let u = 0, uMax = obj.length; u < uMax; u++) {
                if (this.updateHoverStats(obj[u], hold)) {
                    return callback.call(this, obj[u]);
                }
            }
        }
        else if (typeof obj === 'object' && obj != null) {
            if (this.updateHoverStats(obj, hold)) {
                return callback.call(this, obj);
            }
        }
        else if (obj === null) {
            if (typeof callback === 'function') {
                return callback.call(this);
            }
        }
    }
}

export default Mouse;