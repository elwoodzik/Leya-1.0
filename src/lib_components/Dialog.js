import _ObjectSettings from './_ObjectSettings';

class Dialog extends _ObjectSettings {

    constructor(game, context, x, y, width, height, strokeColor, fillColor) {
        super();

        this.initializeGlobalSettings({
            game: game,
            pooled: false,
            context: context || 'main',
            x: x || 1,
            y: y || 1,
            key: null,
            width: width,
            height: height
        });

        this.objAlfa = 0;
        this.toggleTime = 1000;

        this.obj = [];

        this.zIndex = 10;
        this.strokeColor = strokeColor;
        this.fillColor = fillColor;

        this.border = this.game.add.rect('main', this.x, this.y, this.currentWidth, this.currentHeight, this.strokeColor, this.fillColor);
        this.border.static = true;
        this.border.objAlfa = 0;
        this.border.zIndex = 10;

        this.button1 = this.game.add.button('Menu', this.x + 110, this.y + this.currentHeight - 80, 180, 60, null, null, 'black', 'green', '#333', () => this.buttonDefaultAction());
        this.button1.static = true;
        this.button1.objAlfa = 0;
        this.button1.zIndex = 11;

        this.button2 = this.game.add.button('Ok', this.x + this.currentWidth - 290, this.y + this.currentHeight - 80, 180, 60, null, null, 'black', 'green', '#333', () => this.buttonDefaultAction());
        this.button2.static = true;
        this.button2.objAlfa = 0;
        this.button2.zIndex = 11;

        this.headline = this.game.add.text('main', 'Jestem tytułem', this.x + 200, this.y + 60, 44, '#333', null);
        this.headline.static = true;
        this.headline.objAlfa = 0;
        this.headline.zIndex = 11;
    }

    draw(dt) {
        if (this.objAlfa < 1.1 && this.game.ctx.globalAlpha === 1) {
            this.border.objAlfa = this.objAlfa;
            this.button1.objAlfa = this.objAlfa;
            this.button2.objAlfa = this.objAlfa;
            this.headline.objAlfa = this.objAlfa;
            if (this.closeButton) {
                this.closeButton.objAlfa = this.objAlfa;
            }
            for (var i = 0; i < this.obj.length; i++) {
                this.obj[i].objAlfa = this.objAlfa;
            }
            this.objAlfa = 1.1

            this.fadeInHandler();
        }

        this.fadeOutHandler();
    }

    toggle(bool) {
        if (!bool) {
            this.border.used = false;
            this.button1.used = false;
            this.button2.used = false;
        } else {
            this.border.used = true;
            this.button1.used = true;
            this.button2.used = true;
        }
    }

    buttonDefaultAction() {
        alert('dodaj akcje do tego przycisku przy konfiguracji. action: function')
    }

    configure(options = {}) {
        this.toggleTime = options.toggleTime || 400;



        //let alfa = options.alfa || 1;
        let borderWidth = options.borderWidth || 1;
        this.used = options.used === false ? false : true;
        this.toggle(this.used);
        this.main = options.main || null;


        if (options.close) {
            this.closeButton = this.game.add.button('X', this.x + this.currentWidth - 45, this.y, 45, 45, null, 'red', 'black', 'black', '#333', () => this.close());
            this.closeButton.static = true;
            this.closeButton.objAlfa = 0;
            this.closeButton.zIndex = 11;

        }

        this.fadeIn(this.toggleTime, () => {

        })

        if (options.button1) {
            this.button1.text = options.button1.text || 'Menu';
            this.button1.currentWidth = options.button1.width || 180;
            this.button1.currentHeight = options.button1.height || 60;
            this.button1.strokeStyle = options.button1.strokeColor || '#333';
            this.button1.strokeStyleHover = options.button1.strokeColorHover || 'green';
            this.button1.fillStyle = options.button1.fillColor || null;
            this.button1.fillStyleHover = options.button1.fillColorHover || null;
            this.button1.textColor = options.button1.textColor || '#333';
            this.button1.borderWidth = options.button1.borderWidth || 2;
            this.button1.action = options.button1.action || this.buttonDefaultAction;
            this.button1.used =  options.button1.used === false ? false : true;
        }
        if (options.button2) {
            this.button2.text = options.button2.text || 'Menu';
            this.button2.currentWidth = options.button2.width || 180;
            this.button2.currentHeight = options.button2.height || 60;
            this.button2.strokeStyle = options.button2.strokeColor || '#333';
            this.button2.strokeStyleHover = options.button2.strokeColorHover || 'green';
            this.button2.fillStyle = options.button2.fillColor || null;
            this.button2.fillStyleHover = options.button2.fillColorHover || null;
            this.button2.textColor = options.button2.textColor || '#333';
            this.button2.borderWidth = options.button2.borderWidth || 2;
            this.button2.action = options.button2.action || this.buttonDefaultAction;
            this.button2.used = options.button2.used === false ? false : true;
        }
        if (options.headline) {
            this.headline.text = options.headline.text || 'Jestem tytułem';
            this.headline.x = this.x + options.headline.x || this.x + 200;
            this.headline.y = this.y + options.headline.y || this.y + 60;
            this.headline.size = options.headline.size || 42;
            this.headline.color = options.headline.color || '#333';
        }
        this.border.setBorderWidth(borderWidth);
        //this.border.setAlfa(alfa);

        if (this.main) {
            this.main.call(this, this);
        }
    }

    add(obj) {
        if (typeof obj !== 'object') {
            return console.error('oczekiwano obiektu!');
        } else {
            this.obj.push(obj);
        }
    }

    close() {
        this.fadeOut(this.toggleTime, () => {
            this.destroy();
            this.border.destroy();
            this.button1.destroy();
            this.button2.destroy();
            if (this.closeButton) {
                this.closeButton.destroy();
            }
            this.headline.destroy();

            for (var i = 0; i < this.obj.length; i++) {
                this.obj[i].destroy();
            }
            this.obj = [];
        })
    }
};

export default Dialog;