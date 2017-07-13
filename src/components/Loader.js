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
            //'mapa': '/images/mapa.png',
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