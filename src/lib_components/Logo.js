class Logo {

    constructor(game) {
        this.game = game;
        this.startGame();
    }

    create() {
        
    }

    startGame() {
        this.game.add.rect('main', 0, 0, this.game.width, this.game.height, null, 'black');
        this.TextL = this.game.add.text('main', "L", -500, -2366, 99, "white", null);
        this.TextE = this.game.add.text('main', "e", 2570, -366, 99, "white", null);
        this.TextY = this.game.add.text('main', "y", -1660, -766, 99, "white", null);
        this.TextA = this.game.add.text('main', "a", -740, 1466, 99, "white", null);

        this.TextEngine = this.game.add.text('main', "engine", 590, 2475, 40, "white", null);

        this.TextL.moveToPoint(this.game.width /2 - this.TextA.currentHalfWidth-50, this.game.height/2   , 25, null);      
        this.TextE.moveToPoint(this.game.width / 2 - this.TextE.currentHalfWidth -10, this.game.height/2  , 25, null);
        this.TextY.moveToPoint(this.game.width / 2 - this.TextY.currentHalfWidth +40, this.game.height/2  , 25, null);
        this.TextA.moveToPoint(this.game.width / 2 - this.TextA.currentHalfWidth +90, this.game.height/2  , 25, () => {
            this.TextEngine.moveToPoint(this.game.width / 2 - this.TextEngine.currentHalfWidth + 70 , this.game.height/2 - 65 , 15, (textEngine) => {
                textEngine.doInTime(1500, () => {
                    this.game.callback(this.game, this.game);
                })
            });
        });
    }
};

export default Logo;