class Menu {

    constructor(game) {
        this.game = game;
    }

    create() {

        this.add.text('main', 2048, 80, 120, 89, '#776e65');

        //this.add.rect('main', 0, 0, this.width, this.height, null, '#d4e1ec');
        this.add.button('Start', 200, 280, 180, 35, '#dc821d', '#67c743', 'black', 'black', 'black', () => {
            this.state.start('Main');
        }).fontSize = 24;
    }

    update() {

    }
};

export default Menu; 