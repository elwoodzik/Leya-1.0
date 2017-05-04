import io from 'socket.io-client';

class Multiplayer {

    constructor(game, _ip) {
        this.socket = io.connect(_ip);
        this.game = game;

        this.initialize();
    }

    initialize() {
        this.onSocket('connected', function (err, msg) {
            if (err) {
                console.error(err);
            } else {
                console.log(msg);
            }
        });
    }

    init() {
        this.getCurrentRoom((err, roomName) => {
            if (!err) {
                this.emit('waiting for init', roomName);
                this.onSocket('share obj', this.shareObj);
                this.onSocket('removed objs', this.removeAllObjects);
                this.onSocket('update obj', this.updateObject);
            } else {
                console.error(err);
            }

        })
    }

    onSocket(name, callback) {
        this.socket.removeAllListeners(name);

        if (typeof callback === 'function') {
            this.socket.on(name, callback);
        } else {
            throw 'Metoda przyjmuje dwa parametry. Nazwe Socketu (String) i callback (Function)';
        }
    }

    emit(name, data, callback) {
        if (!name) {
            throw 'musisz podac jako pierwszy parametr nazwe socketu';
        }
        this.socket.emit(name, data, callback);
    }

    enemyLeave(data, callback) {
        if (typeof callback === 'function') {

        } else {
            console.error('brak zdefiniowanego callbacka lub nie jest to funkcja!');
        }
    }

    //wysylane na server
    removeObj(_callback) {
        this.emit('remove obj', null, (err, objs) => {
            if (typeof _callback === 'function') {
                return _callback(err, objs);
            } else {
                console.error('brak zdefiniowanego callbacka lub nie jest to funkcja!');
            }
        });
    }

    // mozliwe ze trzeba poprawic do jedej petli
    // otrzymywane z servera
    removeAllObjects = (data) => {
        let tab = [];

        for (let i = 0; i < this.game.gameObject.length; i++) {
            if (this.game.gameObject[i].sockID === data) {
                tab.push(this.game.gameObject[i])
            }
        }

        for (let i = 0; i < tab.length; i++) {
            this.game.gameObject.splice(this.game.gameObject.indexOf(tab[i]), 1);
        }
    }

    shareObj = (data) => {
        this.switchType(data);
    }

    updateObject = (data) => {
        let obj = this.getObjById(data.ID);
        obj.x = data.x;
        obj.y = data.y;
    }

    getObjById(id) {
        for (let i = 0; i < this.game.gameObject.length; i++) {
            if (id === this.game.gameObject[i].ID) {
                return this.game.gameObject[i];
            }
        }
    }

    createRoom(options, _callback) {
        this.emit('create room', options, (err, room) => {
            if (typeof _callback === 'function') {
                return _callback(err, room);
            } else {
                console.error('brak zdefiniowanego callbacka lub nie jest to funkcja!');
            }
        });
    }

    leaveRoom(_callback) {
        this.emit('leave room', null, (err, room) => {
            if (typeof _callback === 'function') {
                return _callback(err, room);
            } else {
                console.error('brak zdefiniowanego callbacka lub nie jest to funkcja!');
            }
        });
    }

    joinRoom(data, _callback) {
        if (!data.name) {
            return console.error('musisz podac nazwe pokoju do ktorego chcesz dolaczyc. Pole: "name"');
        }

        this.emit('join room', data, (err, room) => {
            if (typeof _callback === 'function') {
                return _callback(err, room);
            } else {
                console.error('brak zdefiniowanego callbacka lub nie jest to funkcja!');
            }
        });
    }

    getCurrentRoom(_callback) {
        this.emit('get current room', null, (err, room) => {
            if (typeof _callback === 'function') {
                return _callback(err, room);
            } else {
                console.error('brak zdefiniowanego callbacka lub nie jest to funkcja!');
            }
        });
    }

    getUsersInRoom(_callback) {
        this.emit('users in room', this.socket.id, (err, room) => {
            if (typeof _callback === 'function') {
                return _callback(err, room);
            } else {
                console.error('brak zdefiniowanego callbacka lub nie jest to funkcja!');
            }
        });
    }

    getRoomsList(_callback) {
        this.emit('list rooms', null, (rooms) => {
            if (typeof _callback === 'function') {
                return _callback(rooms);
            } else {
                console.error('brak zdefiniowanego callbacka lub nie jest to funkcja!');
            }
        });
    }

    switchType(data) {
        let obj = null;

        if (data.oClass) {
            // var req = require('module/Objects/Player')
            // console.log(req)
            obj = new this.game.CLASS[data.oClass](this.game, data.arguments[0], data.arguments[1], data.arguments[2], data.arguments[3], data.arguments[4], data.arguments[5], data.arguments[6], data.arguments[7], data.arguments[8], data.arguments[9], data.arguments[10]);
            obj.playerControlled = false;
        } else {
            switch (data.type) {
                case 'image':

                    obj = this.game.add[data.type]('main', data.x, data.y, data.key);
                    obj.zIndex = 10;
                    break;
                case 'sprite':
                    obj = this.game.add[data.type]('main', data.x, data.y, data.key);
                    break;
            }
        }

        obj.sockID = data.sockID;
        obj.ID = data.ID;

        return obj;
    }
}

export default Multiplayer;