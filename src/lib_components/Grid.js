import _ObjectSettings from './_ObjectSettings';

class Grid extends _ObjectSettings {

    constructor(game, context, count, width) {
        super();

        this.initializeGlobalSettings({
            game: game,
            pooled: false,
            context: context || 'main',
            x: 1,
            y: 1,
            key: null,
            width: null,
            height: null
        });

        this.count = count;
        this.stroke = false;
        this.lineWidth = 6;
        this.strokeColor = 'black';

        this.zIndex = 1;

        this.cw = this.game.width;
        this.ch = this.game.height;

        this.width = width || Math.floor(this.cw / count);

        this.static = true;

        this.color1 = 'white';
        this.color2 = 'gray';

        this.grid = [];


        this.parse();
    }

    set gridWidth(int) {
        this.width = int;
    }

    get gridWidth() {
        return this.width;
    }

    get grids() {
        return this.grid;
    }

    setGrids(x, y, typ, value) {
        this.grid[x][y][typ] = value;
    }

    getFieldType(x, y) {
        return this.grid[x][y]
    }

    getFree() {
        let freeArr = [];
        for (let i = 0; i < this.count; i++) {
            for (let j = 0; j < this.count; j++) {
                if (this.grid[j][i].type === 'empty') {
                    freeArr.push({
                        col: j,
                        row: i
                    });
                }

            }
        }
        return freeArr;
    }

    parse() {
        this.arr = [];

        for (let i = 0; i < this.count; i++) {
            this.arr.push([]);
            this.grid.push([]);
            for (let j = 0; j < this.count; j++) {
                let tile = {};
                tile.x = i * this.width;
                tile.y = j * this.width;
                tile.col = i;
                tile.row = j;
                tile.type = 'empty';

                if (j % 2 === 0) {
                    this.arr[i].push(0);
                } else {
                    this.arr[i].push(1);
                }
                this.grid[i].push(tile);
            }
        }
        this.generate();
    }

    generate() {
        let ctx = document.createElement("canvas").getContext("2d");
        ctx.canvas.width = this.count * this.width;
        ctx.canvas.height = this.count * this.width;

        for (let y = 0; y < this.arr.length; y++) {
            for (let x = 0; x < this.arr[y].length; x++) {

                if ((y % 2 === 0) && this.arr[y][x] === 0) {
                    ctx.fillStyle = this.color1;
                } else if ((y % 2 === 1) && this.arr[y][x] === 1) {
                    ctx.fillStyle = this.color1;
                } else {
                    ctx.fillStyle = this.color2;
                }

                ctx.fillRect(x * this.width, y * this.width, this.width, this.width);

                if (this.stroke) {
                    ctx.strokeStyle = this.strokeColor;
                    ctx.rect(x * this.width, y * this.width, this.width, this.width);
                    ctx.lineWidth = this.lineWidth;
                    ctx.stroke();
                }
            }
        }

        this.imageGrid = new Image();
        this.imageGrid.src = ctx.canvas.toDataURL("image/png");

        ctx = null;
    }

    draw(dt) {
        this.context.drawImage(
            this.imageGrid,
            0, //Math.floor(this.renderX), // + (this.game.camera.lerpAmount * dt)
            0, //Math.floor(this.renderY), // + (this.game.camera.lerpAmount * dt)
            this.cw,
            this.ch,
            this.x + this.game.camera.xScroll,
            this.y + this.game.camera.yScroll,
            this.cw,
            this.ch
        );
    }
}

export default Grid;