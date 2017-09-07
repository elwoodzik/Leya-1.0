let that;

class Socket {

    constructor(multiplayer, io) {
        this.io = io;
        this.socket = null;
        this.multiplayer = multiplayer;
        that = this;
    }

    initializeSockets(callback) {

        this.io.on('connection', (socket) => {

            socket.on("disconnect", this.multiplayer.users.removeUser.bind(this.multiplayer.users, socket));

            this.multiplayer.users.addNewUser(socket, (err) => {
                if (err) {
                    socket.emit("connected", "Nie udało się połączyć. \n" + err);
                } else {
                    socket.emit("connected", null, "Połączenie socketa - SUCCESS");
                    socket.on("waiting for init", this.afterInit.bind(socket));

                    socket.on("create room", this.multiplayer.rooms.create);
                    socket.on("join room", this.multiplayer.rooms.onJoin);
                    socket.on("leave room", this.multiplayer.rooms.onLeave);
                    socket.on("users in room", this.multiplayer.rooms.getUsersList);
                    socket.on("list rooms", this.multiplayer.rooms.list);
                    socket.on("get current room", this.multiplayer.rooms.getRoom);
                    socket.on("add object", this.multiplayer.objs.add);
                    socket.on("update obj", this.multiplayer.objs.update);
                    socket.on("remove obj", this.multiplayer.objs.onRemove);

                    socket.on("start match", this.startMatch);
                    // callback socketow zdefiniowanych przez uzytkownika w Classie Game.
                    callback.call(socket, socket);
                }
            });
        });
    }

    startMatch = (room, options) => {
        this.emitToRoom('start match', room.name, options);
    }

    afterInit(room) {
        that.multiplayer.objs.getObj(this, room.name);
    }

    onSocket(name, callback) {
        if (typeof callback === 'function') {
            this.io.on(name, callback);
        } else {
            throw 'Metoda przyjmuje dwa parametry. Nazwe Socketu (String) i callback (Function)';
        }
    }

    emitToAll(name, data) {
        if (!name) {
            throw 'musisz podac jako pierwszy parametr nazwe socketu';
        }

        this.io.emit(name, data);
    }

    // wysyla wiadomosc tylko do osoby wysylajacej socketa
    // emitToMe: function(name, data){
    //     if(!name){
    //         throw 'musisz podac jako pierwszy parametr nazwe socketu';
    //     }

    //     this.socket.emit(name, data);
    // }

    // wysyla wiadomosc do wszystkich z podanego pokoju (room)
    emitToRoom(name, room, data) {
        if (!name) {
            throw 'musisz podac jako pierwszy parametr nazwe socketu';
        }

        this.io.in(room).emit(name, data);
    }

    broadcastToRoom(socket, name, room, data) {
        if (!name) {
            throw 'musisz podac jako pierwszy parametr nazwe socketu';
        }
        socket.broadcast.to(room).emit(name, data);
        // this.io.in(room).emit(name, data);
    }

    // wysyla wiadomosc tylko do okreslonego gracza
    emitToPlayer(name, id, data) {
        if (!name) {
            throw 'musisz podac jako pierwszy parametr nazwe socketu';
        }

        this.socket.broadcast.to(id).emit(name, data);
    }

    // wysyla wiadomosc do wszystkich oprocz osoby ktora wyslala socketa
    // broadcastToAll: function(name, data, sock){
    //     if(!name){
    //         throw 'musisz podac jako pierwszy parametr nazwe socketu';
    //     }

    //     sock.broadcast.emit(name, data);
    // }
}

export default Socket;