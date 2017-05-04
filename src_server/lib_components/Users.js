class Users {

    constructor(multiplayer) {
        this.users = [];
        this.multiplayer = multiplayer;
    }

    addNewUser(socket, callback) {
        let user = {
            id: socket.id,
            //name: name,
            //socket: socket,
        };

        this.users.push(user);

        this.multiplayer.rooms.join('global', socket, (err, room, sock) => {
            if (err) {
                console.error(err);
                callback(err);
            } else {

                callback(false);
            }
        });
    }

    removeUser(socket) {
        const id = socket.id;
        const user = this.findUserById(id);
        if (user) {

            const index = this.users.indexOf(user);
            this.users.splice(index, 1);
            this.multiplayer.rooms.leaveRoom(user, socket, (err) => {
                if (err) {
                    console.error("\nWystąpił błąd przy probie disconnect\n");
                } else {
                    console.log("\nUżytkownik poprawnie WYLOGOWANY z servera  " + id + "\n");
                    this.multiplayer.objs.remove(id);
                    if (user.room) {
                        let room = this.multiplayer.rooms.findRoomByName(user.room);
                        this.multiplayer.socket.emitToRoom('leave room', room.name, room);
                    }
                }
            })
        }
        else {
            console.error('blad kurwa!');
        }
    }

    findUserById(id) {
        for (let i = 0; i < this.users.length; i++) {
            let user = this.users[i];

            if (user.id === id) {
                return user;
            }
        }
        return console.error('Nie znaleziono uzytkownika o id: ' + id);
    }
}

export default Users;