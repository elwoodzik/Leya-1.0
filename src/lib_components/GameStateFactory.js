class GameStateFactory {

    constructor(game) {
        this.game = game;
    }

    add(key, stateObject) {
        this.game.states[key] = stateObject;
    }

    start(key, options) {

        if (!options) {
            options = {};
        }
        if (key === 'Logo') {
            this.game.gameObject.length = 0;
            this.game.gameObjectStatic.length = 0;
            this.game.gameObjectOnStatic.length = 0;
            this.game.camera.xScroll = 0;
            this.game.camera.yScroll = 0;
            this.game.VAR = {};
            this.game.ARR = {};
            this.game.currentState = null;
            this.game.currentState = new this.game.states[key](this.game, 'aaa');

            if (this.game.currentState.create) {
                this.game.currentState.create.apply(this.game);
                if (this.game.bgctx) {
                    this.game.renderStatic();
                }
                if (this.game.onbgctx) {
                    this.game.renderOnStatic();
                }
                this.game.sortByIndex();
            } else {
                throw "Brakuje metody create w scenie " + key;
            }
        }
        else {
            this.game.fadeOut(options.fadeOut || 400, key, () => {
                this.game.gameObject.length = 0;
                this.game.gameObjectStatic.length = 0;
                this.game.gameObjectOnStatic.length = 0;
                this.game.camera.xScroll = 0;
                this.game.camera.yScroll = 0;
                this.game.VAR = {};
                this.game.ARR = {};
                this.game.currentState = null;
                if (this.game.states[key]) {
                    this.game.currentState = new this.game.states[key](this.game);
                } else {
                    return console.error('Nie ma stanu o takiej nazwie: ' + key + '\nDostepne stany:\n' + this.getAllStates());
                }


                if (this.game.currentState.create) {
                    this.game.currentState.create.call(this.game, options.data);
                    if (this.game.bgctx) {
                        this.game.renderStatic();
                    }
                    if (this.game.onbgctx) {
                        this.game.renderOnStatic();
                    }
                    this.game.sortByIndex();

                    setTimeout(() => {
                        if (!this.game.timerFadeOutActive) {
                            this.game.fadeIn(options.fadeIn || 400, null)
                        }
                    }, 300);
                } else {
                    throw "Brakuje metody create w scenie " + key;
                }
            });
        }
    }

    getAllStates() {
        return Object.keys(this.game.states);
    }

}

export default GameStateFactory;