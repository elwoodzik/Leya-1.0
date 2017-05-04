import _ObjectSettings from './_ObjectSettings';

class Particles extends _ObjectSettings {

    constructor(game, x, y, options) {
        super();

        this.options = options || {};

        this.initializeGlobalSettings({
            game: game,
            pooled: false,
            context: 'main',
            x: x || 1,
            y: y || 1,
            key: null,
            width: 1,
            height: 1
        });

        this.zIndex = 7;

        this.repeatX = x;
        this.repeatY = y;
        //
        this.speed = this.options.speed || { x: -3 + Math.random() * 5, y: -4 + Math.random() * 5 };

        this.velocity = {
            x: this.speed.x,
            y: this.speed.y
        }

        //
        if (this.options.radius) {
            this.radius = this.game.rand(this.options.radius.min, this.options.radius.max) + this.options.radius.static;
        } else {
            this.radius = this.game.rand(0, 10) + 5;
        }

        //
        this.life = this.options.life || this.game.rand(10, 40);
        this.remaining_life = this.life;
        //
        this.colors = this.options.colors || {
            r: this.game.rand(188, 255),
            g: this.game.rand(0, 200),
            b: 0
        }
        //
        this.composite = this.options.composite || "screen";
    }

    draw() {
        if (this.objAlfa !== 1) {
            this.game.ctx.save();
            this.game.ctx.globalAlpha = this.objAlfa;
        }
       // this.game.ctx.globalAlpha = this.game.ctx.globalAlpha === 1 ? this.objAlfa : this.game.ctx.globalAlpha;
        this.game.ctx.globalCompositeOperation = this.composite;

        this.opacity = Math.round(this.remaining_life / this.life * 100) / 100;

        this.game.ctx.beginPath();

        var gradient = this.game.ctx.createRadialGradient(this.x - this.game.camera.xScroll, this.y - this.game.camera.yScroll, 0, this.x - this.game.camera.xScroll, this.y - this.game.camera.yScroll, this.radius);
        gradient.addColorStop(0, "rgba(" + this.colors.r + ", " + this.colors.g + ", " + this.colors.b + ", " + this.opacity + ")");
        gradient.addColorStop(0.5, "rgba(" + this.colors.r + ", " + this.colors.g + ", " + this.colors.b + ", " + this.opacity + ")");
        gradient.addColorStop(1, "rgba(" + this.colors.r + ", " + this.colors.g + ", " + this.colors.b + ", 0)");
        this.game.ctx.fillStyle = gradient;
        this.game.ctx.arc(this.x - this.game.camera.xScroll, this.y - this.game.camera.yScroll, this.radius, Math.PI * 2, false);
        this.game.ctx.fill();
        this.game.ctx.closePath();
        if (this.objAlfa !== 1) {
            this.game.ctx.restore();
        }
        this.game.ctx.globalCompositeOperation = "source-over";

        
    }

    update(dt) {
        this.x = (this.x + (dt * this.velocity.x));
        this.y = (this.y + (dt * this.velocity.y));
        this.remaining_life--;
        this.radius -= 0.6;

        if (this.remaining_life < 0 || this.radius < 0) {
            //a brand new particle replacing the dead one
            if (this.options.radius) {
                this.radius = this.game.rand(this.options.radius.min, this.options.radius.max) + this.options.radius.static;
            } else {
                this.radius = this.game.rand(0, 10) + 5;
            }

            this.speed = this.options.speed || { x: -50 + (Math.random() * 100), y: -250 };
            this.velocity = {
                x: this.speed.x,
                y: this.speed.y
            }
            this.life = this.options.life || this.game.rand(10, 30);
            this.remaining_life = this.life;

            this.x = this.repeatX;
            this.y = this.repeatY;
        }
    }
};

export default Particles;