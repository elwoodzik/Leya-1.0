class Logo {

    constructor(game) {
        this.game = game;
        this.startGame();
    }

    create() {

    }

    startGame() {
        this.game.add.rect('main', 0, 0, this.game.width, this.game.height, null, 'black');
        const TextL = this.game.add.text('main', "L", -500, -2366, 99, "white", null);
        TextL.fontType = 'Logo';
        const TextE = this.game.add.text('main', "e", 2570, -366, 99, "white", null);
        TextE.fontType = 'Logo';
        const TextY = this.game.add.text('main', "y", -1660, -766, 99, "white", null);
        TextY.fontType = 'Logo';
        const TextA = this.game.add.text('main', "a", -722, 1466, 99, "white", null);
        TextA.fontType = 'Logo';

        const TextEngine = this.game.add.text('main', "engine", 590, 2475, 40, "white", null);
        TextEngine.fontType = 'Logo';

        TextL.moveToPoint(this.game.width / 2 - TextA.currentHalfWidth - 50, this.game.height / 2, 25, null);
        TextE.moveToPoint(this.game.width / 2 - TextE.currentHalfWidth - 10, this.game.height / 2, 25, null);
        TextY.moveToPoint(this.game.width / 2 - TextY.currentHalfWidth + 40, this.game.height / 2, 25, null);
        TextA.moveToPoint(this.game.width / 2 - TextA.currentHalfWidth + 90, this.game.height / 2, 25, () => {
            TextEngine.moveToPoint(this.game.width / 2 - TextEngine.currentHalfWidth + 70, this.game.height / 2 - 65, 15, (textEngine) => {
                textEngine.doInTime(1500, () => {
                    this.game.callback(this.game, this.game);
                })
            });
        });
    }
};

export default Logo;