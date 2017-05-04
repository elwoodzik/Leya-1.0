import AssetManager from '../lib_components/AssertManager';
import Game from '../lib_components/Game';
import Menu from './Pages/Menu';
import Main from './Pages/Main';
class Loader {

    constructor() {
        AssetManager.preload();
        this.create();
    }

    create() {
        AssetManager.load({
            
        }, this.onComplete, this.onProgress);
    }

    onProgress(loaded, total, key, path, success) {
        // domyslny sposob wyswietlenia paska postepu
        AssetManager.preloadOnProgress(loaded, total);
    }

    onComplete() {
        new Game(640, 800, false, (game) => {
            //game.scallable(false);
            //game.add.multiplayer('http://localhost:4000');

            game.keyboard.initialize()
            game.mouse.initialize();
           
            //game.state.add("Menu", Menu);
            game.state.add("Main", Main);
            game.state.start('Main');
          
        })
    }
}

export default new Loader();