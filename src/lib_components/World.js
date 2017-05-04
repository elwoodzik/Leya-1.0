class World {

    constructor(game) {
        this.bounce = false;
        this.game = game;
        this.timeLocal = 0;
    }

    setBounce(bool) {
        if (typeof bool === 'boolean') {
            return this.bounce = bool;
        } else {
            throw "setBounce -> parametr musi byc boolean";
        }
    }

    setPortView(width, height) {
        if (!this.game.orientation) {
            this.game.portViewWidth = width;
            this.game.portViewHeight = height;
        } else {
            this.game.portViewWidth = height;
            this.game.portViewHeight = width;
        }
    }

    doInTime(time, callback) {
        this.timeLocal += this.game.FRAMEDURATION;

        if (this.timeLocal > time) {
            this.timeLocal = 0;
            callback.call(this);
        }
    }
};

export default World;