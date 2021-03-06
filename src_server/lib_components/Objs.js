let that;

class Objs {

    static ID = 1;

    constructor(multiplayer, room) {
        that = this;


        this.objs = {};
        this.multiplayer = multiplayer;
    }

    add(obj, callback) {
        // console.log(obj)
        const ID = Objs.ID;

        // let room = that.multiplayer.users.findUserById(this.id).room;
        // room.objs[ID] = 

        that.objs[ID] = obj;
        that.objs[ID].sockID = this.id;
        that.objs[ID].ID = ID;
        that.objs[ID].room = that.multiplayer.users.findUserById(this.id).room;

        that.multiplayer.socket.broadcastToRoom(this, "share obj", that.objs[ID].room, obj);

        Objs.ID++;

        callback(ID, this.id, that.objs[ID].room);

    }

    onRemove(obj, callback) {
        that.remove(this.id);
        callback(null, that.objs);
    }

    remove(sockID, room) {
        let tab = [];

        for (let obj in this.objs) {
            if (this.objs[obj]) {
                if (this.objs[obj].sockID === sockID) {
                    tab.push(obj);
                }
            }
        }

        for (let i = 0; i < tab.length; i++) {
            delete this.objs[tab[i]];
        }

        this.multiplayer.socket.emitToAll("removed objs", sockID);
    }

    getObj(sock, roomName) {
        for (let obj in this.objs) {
            if (this.objs[obj]) {
                if (this.objs[obj].sockID !== sock.id) {
                    sock.emit("share obj", this.objs[obj]);
                }
            }
        }
    }

    update(data) {
        if (that.objs[data.ID]) {
            that.objs[data.ID].x = data.x;
            that.objs[data.ID].y = data.y;
            that.objs[data.ID].angle = data.angle;
            that.multiplayer.socket.broadcastToRoom(this, "update obj", that.objs[data.ID].room, that.objs[data.ID], that.objs[data.ID].angle);
        }
        //that.multiplayer.socket.emitToRoom.emit("update obj", that.objs[data.ID]);
    }

    findObjById(id) {
        for (let obj of this.objs) {
            if (obj.ID === Number(id)) {
                return obj;
            }
        }
    }
}

export default Objs;