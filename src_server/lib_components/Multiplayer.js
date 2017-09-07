import Socket from './Socket';
import Users from './Users';
import Rooms from './Rooms';
import Objs from './Objs';

class Multiplayer {

    constructor(io) {
        this.socket = new Socket(this, io);
        this.users = new Users(this);
        this.rooms = new Rooms(this);
        this.objs = new Objs(this);

        this.rooms.create.bind(this.socket)({ name: 'global', max: 0 }, (err, room) => {

        });
    }
}

export default Multiplayer;