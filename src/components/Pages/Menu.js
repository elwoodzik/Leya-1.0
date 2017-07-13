class Menu {

    constructor(game) {
        this.game = game;
    }

    create() {
        this.add.rect('main', 0, 0, this.width, this.height, null, '#d4e1ec');
        this.add.text('main', 'TEST PAGE', 400, 140, 99, 'black', null);
        
    }

    update() {

    }
};

export default Menu; 