let that;

class Rooms {

    constructor(multiplayer) {
        this.rooms = [];
        this.multiplayer = multiplayer;
        that = this;
    }

    

    create(options, callback) {
        if (typeof callback !== 'function') {
            return console.error('brakuje callback albo nie jest funkcja');
        }
        if (!options.name) {
            return console.error('musisz podac name');
        }

        let room = that.findRoomByName(options.name);

        if (!room) {
            let room = {
                name: options.name,
                maxUsers: options.max || 0,
                users: 0,
                players: [],
                open: true,
                objs: {}
            }
            that.rooms.push(room);
            console.log(`stworzono pokoj ${options.name}`)
            callback(false, room);
        } else {
            callback('taki pokoj juz istnieje!', room);
        }
    }
    //przy on socket 'join'

    onJoin(data, callback) {
        let room = that.findRoomByName(data.name);
        let user = that.multiplayer.users.findUserById(this.id);

        if (room && user) {
            if (room.open) {
                if (room.maxUsers === 0 || room.users < room.maxUsers) {

                    if (user.room) {
                        that.leaveRoom(user, this, () => {
                            // if (data) {
                            //     room.data = data;
                            // }
                            user.room = data.name;
                            room.players.push(user);
                            room.users++;

                            this.join(data.name);

                            callback(false, room);
                        });
                    } else {
                        // if (data) {
                        //     room.data = data;
                        // }
                        user.room = data.name;
                        room.players.push(user);
                        room.users++;
                        this.join(data.name);

                        callback(false, room);
                    }
                    //console.log(this.getUsersIdList(roomName));
                } else {
                    callback('Pokoj jest pełny', room);
                }
            } else {
                callback('Pokoj został zamknięty! Nie można już do niego dołączyć.', room);
            }

        } else {
            callback('Podany pokoj nie istnieje', room);
        }
    }

    join(roomName, socket, callback) {
        let room = this.findRoomByName(roomName);
        let user = this.multiplayer.users.findUserById(socket.id);

        if (room && user) {
            if (room.open) {
                if (room.maxUsers === 0 || room.users < room.maxUsers) {

                    if (user.room) {
                        this.leaveRoom(user, socket, () => {
                            user.room = roomName;
                            room.players.push(user);
                            room.users++;
                            socket.join(roomName);
                            callback(false, room, socket);
                        });
                    } else {
                        user.room = roomName;
                        room.players.push(user);
                        room.users++;
                        socket.join(roomName);

                        callback(false, room, socket);
                    }

                    //console.log(this.getUsersIdList(roomName));
                } else {
                    callback('Pokoj jest pełny', room);
                }
            } else {
                callback('Pokoj został zamknięty! Nie można już do niego dołączyć.', room);
            }

        } else {
            callback('Podany pokoj nie istnieje', room);
        }
    }

    close(roomName) {
        let room = this.findRoomByName(roomName);
        room.open = false;
    }

    getRoom(obj, callback) {
        let user = that.multiplayer.users.findUserById(this.id);
        let room = that.findRoomByName(user.room);
        if (typeof callback === 'function') {
            callback(false, room);
        }
        else {
            callback('wystapil blad przy pobieraniu pokoju', null)
        }

    }

    getUsersIdList(roomName) {
        let room = this.findRoomByName(roomName);
        let users = [];
        if (room) {
            for (let i = 0; i < room.players.length; i++) {
                users.push(room.players[i].id);
            }
            return users;
        }
    }

    getUsersList = (sockID, callback) => {
        let user = this.multiplayer.users.findUserById(sockID);
        let room = this.findRoomByName(user.room);

        if (room) {
            callback(null, room)
        }

        // let room = this.findRoomByName(roomName);
        // let users = [];
        // if (room) {
        //     for (let i = 0; i < room.players.length; i++) {
        //         users.push(room.players[i].id);
        //     }
        //     return users;
        // }
    }

    list = (x, callback) => {
        let rooms = [];
        for (let i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].name !== 'global' && this.rooms[i].open && this.rooms[i].users < this.rooms[i].maxUsers) {
                rooms.push(this.rooms[i]);
            }
        };
        callback(rooms);
    }

    onLeave(nic, callback) {
        let user = that.multiplayer.users.findUserById(this.id);
        that.leaveRoom(user, this, callback);
    }

    leaveRoom(user, socket, callback) {
        let room = this.findRoomByName(user.room);

        if (user && room) {

            let index = room.players.indexOf(user);
            room.players.splice(index, 1);
            room.users--;

            if (room.users === 0 && room.name !== 'global') {
                this.rooms.splice(this.rooms.indexOf(room), 1);
                console.log(this.rooms);
            }
            socket.leave(user.room);
            this.multiplayer.objs.remove(socket.id, room);

            if (callback) {
                callback(false, this.rooms);
            } else {
                console.log('brak callbacka')
            }

        } else {
            if (callback) {
                callback('wystapil blad');
            }
        }
    }

    findRoomByName(name) {
        for (let i = 0; i < this.rooms.length; i++) {
            let room = this.rooms[i];

            if (room.name === name) {
                return room;
            }
        }
        return false;
    }
}

export default Rooms;