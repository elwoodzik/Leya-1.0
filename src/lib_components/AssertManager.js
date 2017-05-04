
class AssetManager {

    constructor(placeholderDataUri) {
        this._assets = {};

        if (placeholderDataUri) {
            this._placeholder = new Image();
            this._placeholder.src = placeholderDataUri;
        }

        this.sounds = true;
    }

    load(images, onDone, onProgress) {
        // Kolejka obrazków
        let queue = [];
        for (let im in images) {
            queue.push({
                key: im,
                path: images[im]
            });
        }

        if (queue.length === 0) {
            onProgress && onProgress(0, 0, null, null, true);
            onDone && onDone();
            return;
        }

        let itemCounter = {
            loaded: 0,
            total: queue.length
        };

        for (let i = 0; i < queue.length; i++) {
            this._loadItem(queue[i], itemCounter, onDone, onProgress);
        }
    }

    _loadItem(queueItem, itemCounter, onDone, onProgress) {

        if (queueItem.path.slice(-3) === "jpg" || queueItem.path.slice(-3) === "png" || queueItem.path.slice(-4) === "jpeg"
            || queueItem.path.slice(-3) === "gif" || queueItem.path.slice(-3) === "JPG" || queueItem.path.slice(-3) === "PNG"
            || queueItem.path.slice(-3) === "GIF") {

            let img = new Image();

            img.onload = () => {
                this._assets[queueItem.key] = img;
                this._onItemLoaded(queueItem, itemCounter, onDone, onProgress, true);
            };

            img.onerror = () => {
                this._assets[queueItem.key] = this._placeholder ? this._placeholder : null;
                this._onItemLoaded(queueItem, itemCounter, onDone, onProgress, false);
            };

            img.src = queueItem.path;
        }
        else if (queueItem.path.slice(-3) === "mp3" || queueItem.path.slice(-3) === "ogg" || queueItem.path.slice(-3) === "wav") {
            createjs.Sound.registerSound(queueItem.path, queueItem.key, 0);
            this._onItemLoaded(queueItem, itemCounter, onDone, onProgress, true);
        }
        else {
            console.error('plik ' + queueItem.path + ' nie zostal zaladowany!')
        }
    }

    _onItemLoaded(queueItem, itemCounter, onDone, onProgress, success) {
        itemCounter.loaded++;
        onProgress && onProgress(itemCounter.loaded, itemCounter.total, queueItem.key, queueItem.path, success);
        if (itemCounter.loaded == itemCounter.total) {
            onDone && onDone();
        }
    }

    get(key) {
        return this._assets[key];
	}

	getSrc(key) {
        return this._assets[key].src;
	}

	play(key) {
        if(this.sounds){
            createjs.Sound.play(key);
        }
	}
    
    stop(key) {
        this._assets[key].pause();
     	this._assets[key].currentTime = 0;	
        createjs.Sound.stop(key);
	}

    useSounds(bool){
        if(typeof bool !== 'boolean'){
            return console.error('Metoda "useSounds" wymaga podania argumentu: True / False');
        }

        this.sounds = bool;
        return this.sounds;
    }

    preload(){
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");        
        this.canvas.width =  500;
        this.canvas.height =  300;
        this.canvas.id = 'preload';

        this.canvas.style.position = 'absolute';
        this.canvas.style.left = '50%';
        this.canvas.style.marginLeft = -this.canvas.width/2 + "px";

        document.body.style.overflow = 'hidden';
            
        document.body.appendChild(this.canvas);
    }

    preloadOnProgress(loaded, total){
        if(this.canvas){
            let currentProgress = loaded / total * 400;
            if(loaded === 1){
                this.ctx.font = "30px Arial";
                this.ctx.fillStyle = 'orange';
                this.ctx.fillText("Ładowanie", 180, 60);
            }
            this.ctx.beginPath();
            this.ctx.strokeStyle = 'orange';
            this.ctx.rect(50,80,400,30);
            this.ctx.stroke();
            this.ctx.closePath();
            
            this.ctx.fillStyle = 'green';
            this.ctx.fillRect(51, 81, currentProgress-1, 28);
            //
            
            this.ctx.clearRect(200,120,500,300);
            this.ctx.font = "30px Arial";
            this.ctx.fillStyle = 'orange';
            this.ctx.fillText(Math.floor(currentProgress/4) + "%", 230, 150);
            
            if(loaded === total){
                const child = document.getElementById("preload");
                document.body.removeChild(child);
            }
        }
    }
}

export default new AssetManager();