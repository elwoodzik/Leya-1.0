import Sprite from './Sprite';
import Image from './Image';
import TileSprite from './TileSprite';
import Rect from './Rect';
import Text from './Text';
import Button from './Button';
import Bar from './Bar';
import Camera from './Camera';
import Dialog from './Dialog';
import DialogImg from './DialogImg';
import Particles from './Particles';
import ButtonImg from './ButtonImg';
import Grid from './Grid';
import Multiplayer from './Multiplayer';
import Map from './Map';


class GameObjectFactory {

    constructor(game) {
        this.game = game;
    }

    sprite(context, x, y, key, w, h) {
        return new Sprite(this.game, false, context, x, y, key, w, h);
    }

    image(context, x, y, key, w, h, f) {
        return new Image(this.game, false, context, x, y, key, w, h, f);
    }

    tileSprite(context, x, y, key, w, h) {
        return new TileSprite(this.game, false, context, x, y, key, w, h);
    }

    particles(x, y, options) {
        return new Particles(this.game, x, y, options);
    }

    button(text, x, y, width, height, background, backgroundHover, strokeStyle, strokeStyleHover, textColor, action) {
        return new Button(this.game, text, x, y, width, height, background, backgroundHover, strokeStyle, strokeStyleHover, textColor, action);
    }

    buttonImg(context, key, keyHover, x, y, width, height, action) {
        return new ButtonImg(this.game, false, context, key, keyHover, x, y, width, height, action);
    }

    rect(context, x, y, w, h, s, f) {
        return new Rect(this.game, false, context, x, y, w, h, s, f);
    }

    map(context, key, arr, width, height, scalled) {
        this.game.map = new Map(this.game, context, key, arr, width, height, scalled);
        return this.game.map;
    }

    grid(context, count, width) {
        return new Grid(this.game, context, count, width);
    }

    multiplayer(ip) {
        this.game.multiplayer = new Multiplayer(this.game, ip);
        return this.game.multiplayer;
    }

    text(context, text, x, y, size, color, action) {
        return new Text(this.game, context, text, x, y, size, color, action);
    }

    bar(context, x, y, w, h, s, f, min, max) {
        return new Bar(this.game, false, context, x, y, w, h, s, f, min, max);
    }

    camera(xView, yView, canvasWidth, canvasHeight, worldWidth, worldHeight) {
        this.game.camera = new Camera(this.game, xView, yView, canvasWidth, canvasHeight, worldWidth, worldHeight)
        return this.game.camera;
    }

    dialog(context, x, y, w, h, s, f) {
        return new Dialog(this.game, context, x, y, w, h, s, f);
    }

    dialogImg(x, y, width, height, key, close) {
        return new DialogImg(this.game, x, y, width, height, key, close);
    }

    sounds(sounds) {
        return this.game.sounds = sounds;
    }

    toMulti(obj) {
        let o = {
            x: obj.x,
            y: obj.y,
            vx: obj.body.velocity.x,
            vy: obj.body.velocity.y,
            key: obj.key,
            w: obj.currentWidth,
            h: obj.currentHeight,
            states: obj.states,
            state: obj.state,
            type: obj.type,
            oClass: obj.oClass,
            angle: obj.body.angle,
            arguments: obj._arguments
        }
        this.game.multiplayer.emit('add object', o, function (ID, sockID, room) {
            obj.ID = ID;
            obj.sockID = sockID;
            obj.room = room;
        });
    }

}

export default GameObjectFactory;