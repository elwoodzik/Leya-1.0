class Keyboard {

    constructor(game) {
        this.game = game;

        this.use = {
            'left': {
                hold: false,
                pressed: false,
                name: "left"
            },
            'up': {
                hold: false,
                pressed: false,
                name: "up"
            },
            'down': {
                hold: false,
                pressed: false,
                name: "down"
            },
            'right': {
                hold: false,
                pressed: false,
                name: "right"
            },
            'W': {
                hold: false,
                pressed: false,
                name: "W"
            },
            'S': {
                hold: false,
                pressed: false,
                name: "S"
            },
            'A': {
                hold: false,
                pressed: false,
                name: "A"
            },
            'D': {
                hold: false,
                pressed: false,
                name: "D"
            },
            '1': {
                hold: false,
                pressed: false,
                name: "1"
            },

            'SPACE': {
                hold: false,
                pressed: false,
                name: "SPACE"
            },
        }

        this.lastKeyCode = null;

        this.keys = {
            '37': 'left',
            '38': 'up',
            '40': 'down',
            '39': 'right',
            '87': 'W',
            '83': 'S',
            '65': 'A',
            '68': 'D',
            '49': '1',

            '32': 'SPACE'
        }
        this.hold = false;
    }

    initialize() {
        window.document.addEventListener("keydown", (e) => this.keyDown(e));
        window.document.addEventListener("keyup", (e) => this.keyUp(e));
    }

    keyDown(e) {
        const code = e.which || e.keyCode;
        const key = this.getKeyByCode(e, code);

        if (!this.use[key]) {
            return false;
        }

        if (this.lastKeyCode === code) {
            this.use[key].hold = true;
            return;
        }

        this.lastKeyCode = code;
        this.use[key].pressed = true;
    }

    keyUp(e) {
        const code = e.which || e.keyCode;
        const key = this.getKeyByCode(e, code);
        this.hold = false;
        this.lastKeyCode = null;

        if (this.use[key] && (this.use[key].pressed || this.use[key].hold)) {
            this.use[key].pressed = false;
            this.use[key].hold = false;
        }
    }

    getKeyByCode(e, code) {
        if (this.keys[code]) {
            e.preventDefault();
            return this.keys[code];
        } else {
            return;
        }
    }
};

export default Keyboard;