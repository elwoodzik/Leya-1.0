import AssetManager from '../lib_components/AssertManager';
import Game from '../lib_components/Game';
import Menu from './Pages/Menu';

class Loader {

    constructor() {
        AssetManager.preload();
        this.create();
    }

    create() {
        AssetManager.load({
            'mapa': '/images/mapa.png',
            'mapa2': '/images/mapa2.png',
            'mapa3': '/images/mapa3.png',
            'player': '/images/player.png',
            'placed': '/images/kafelka2.png',
            'balls': '/images/balls.png',
            'bgPanel': '/images/Panel.png',
            'base': '/images/base.png',
            'levelSelect': '/images/levelSelect.png',
            'back_btn': '/images/back_btn.png',
            'block_active': '/images/block_active.png',
            'block_locked': '/images/block_locked.png',
            'btn_right': '/images/btn_right.png',
            'btn_up': '/images/btn_up.png',
            'btn_left': '/images/btn_left.png',
            'btn_down': '/images/btn_down.png',
            'btn_menu': '/images/btn_menu.png',
            'btn_prev': '/images/btn_prev.png',
            'option': '/images/option.png',
            'btn_play': '/images/btn_play.png',
            'btn_reload': '/images/btn_reload.png',
            'x_icon': '/images/x_icon.png',
            'win_dialog': '/images/win_dialog.png',
            'tiles': '/images/sokoban64.png',

        }, this.onComplete, this.onProgress);
    }

    onProgress(loaded, total, key, path, success) {
        // domyslny sposob wyswietlenia paska postepu
        AssetManager.preloadOnProgress(loaded, total);
    }

    onComplete() {
        const gameWidth = 1280;
        const gameHeight = 720;
        const orientation = false; //false -> vertical, true -> horizontal
        const scallable = true;
        const mobile = false;

        new Game(gameWidth, gameHeight, orientation, scallable, mobile, (game) => {
            //game.add.multiplayer('http://localhost:4000')
            game.keyboard.initialize();
            game.mouse.initialize();
            game.state.add("Menu", Menu);
            game.state.start('Menu');
        })
    }
}

export default new Loader();