
class Body {
    constructor(game, sprite) {
        this.game = game;
        this.sprite = sprite;

        this.velocity = {
            x: 0,
            y: 0
        };
        this.gravity = {
            x: 0,
            y: 0
        }
        //
        this.angle = 0;
        this.angleSpeed = 0;
        this.anchorX = 0;
        this.anchorY = 0;
        this.pushed = false;
        //
        this.colideWorldSide = false;
        this.colideWorldSideLeft = true;
        this.colideWorldSideRight = true;
        this.colideWorldSideBottom = true;
        this.colideWorldSideTop = true;

        this.isGround = false;

        this.worldBounds = false;
        this.isOutOfScreen = false;
    }

    useGravity(obj) {
        // !obj.body.isGround && 
        if (obj.y + obj.states[obj.state].fH < obj.game.canvas.height && !obj.body.ground) {
            obj.body.velocity.y += obj.body.gravity.y / 1000;
        } else {
            obj.body.velocity.y = 0;
            obj.body.ground = false;
        }
    }

    rotate(val) {
        return this.angle = val;
    }

    setAnchor(x, y) {
        this.anchorX = x;
        this.anchorY = y;
    }

    rotateByMouse(spritePosition) {
        let dir = 0;

        
        // var _ang = Math.atan2(this.game.mouse.mouseY - this.sprite.y - this.sprite.currentHalfWidth, this.game.mouse.mouseX - this.sprite.x - this.sprite.currentHalfHeight) * (180 / Math.PI);
        // if (min && max) {
        //     if (_ang <= max && _ang >= min) {
        //         this.angle = Math.atan2(this.game.mouse.mouseY - this.sprite.y - this.sprite.currentHalfWidth, this.game.mouse.mouseX - this.sprite.x - this.sprite.currentHalfHeight) * (180 / Math.PI);
        //     }
        // } else {
        //     this.angle = Math.atan2(this.game.mouse.mouseY - this.sprite.y - this.sprite.currentHalfWidth, this.game.mouse.mouseX - this.sprite.x - this.sprite.currentHalfHeight) * (180 / Math.PI);
        // }
        const disX = Math.abs(this.game.mouse.mouseX - this.sprite.x - this.sprite.currentHalfWidth);
        const disY = Math.abs(this.game.mouse.mouseY - this.sprite.y - this.sprite.currentHalfHeight);
        if (disX > 20 || disY > 20) {
            this.angle = Math.atan2(this.game.mouse.mouseY - this.sprite.y - this.sprite.currentHalfWidth, this.game.mouse.mouseX - this.sprite.x - this.sprite.currentHalfHeight) * (180 / Math.PI) - spritePosition;
            return this.angle;
        }
    }
}

export default Body;