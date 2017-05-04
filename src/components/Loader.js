import AssetManager from '../lib_components/AssertManager';
import Game from '../lib_components/Game';
import Menu from './Pages/Menu';

class Loader {

    constructor() {
        AssetManager.preload();
        this.create();
    }

    create() {
        // jezeli startujesz gre z servera node z assetow musisz usunac folder public np:
        // "first": "/images/kafelka.png"
        AssetManager.load({
            "first": "public/images/kafelka.png"
        }, this.onComplete, this.onProgress);
    }

    onProgress(loaded, total, key, path, success) {
        // domyslny sposob wyswietlenia paska postepu
        AssetManager.preloadOnProgress(loaded, total);
    }

    onComplete() {
        const gameWidth = 1366;
        const gameHeight = 768;
        const orientation = false; //false -> vertical, true -> horizontal
        const scallable = true;

        new Game(gameWidth, gameHeight, orientation, scallable, (game) => {
            //game.add.multiplayer('http://localhost:4000')
            game.keyboard.initialize();
            game.mouse.initialize();

            game.state.add("Menu", Menu);
            game.state.start('Menu');
        })
    }
}

export default new Loader();