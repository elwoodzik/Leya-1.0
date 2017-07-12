class Menu {

    constructor(game) {
        this.game = game;
    }

    create() {
        this.add.rect('main', 0, 0, this.width, this.height, null, '#d4e1ec');
        this.add.text('main', 'Sokoban', 300, 140, 99, 'black', null);
        this.add.button('Start', this.width / 2 - 130, 280, 260, 55, '#dc821d', '#67c743', 'black', 'black', 'black', () => {
            this.state.start('LevelSelect');
        });
    }

    update() {

    }
};

export default Menu; 