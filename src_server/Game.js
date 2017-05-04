import Multiplayer from './lib_components/Multiplayer';

class Game {

    constructor(io) {
        this.initialize(io);
    }

    initialize(io) {
        this.multiplayer = new Multiplayer(io);

        this.multiplayer.socket.initializeSockets((socket) => {
            // tutaj sockety uzytkownika
            // socket.on(name,function) 
            socket.on("start game", (room) => {
                this.multiplayer.rooms.close(room.name);
                this.multiplayer.socket.emitToRoom('start game', room.name, room);
            });
            // socket.on("create room", (data, cb) => {
            //     this.multiplayer.rooms.create('test', 2);
            //     this.multiplayer.rooms.join('test', socket, (err, room, sock) => {
            //         if (err) {
            //             console.error(err);
            //             //callback(err);
            //         } else {
            //             console.log(this.multiplayer.rooms.rooms)
            //            // callback(false);
            //         }
            //     });
            //     //cb('dostalem dupe');

            // })
            //console.log(this.multiplayer.rooms.rooms)
        });
    }
}

export default Game;