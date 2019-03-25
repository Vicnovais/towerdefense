const EMPTY = "EMPTY";
const PATH = "PATH";
const START = "START";
const END = "END";
const TOWER = "TOWER";

class Map {
    constructor(levelNumber) {
        this.schema = this[`level${ levelNumber }`]();
    }

    getSizeX() {
        return this.schema[0].length;
    }

    getSizeY() {
        return this.schema.length;
    }

    level1() {
        return [
            [0,2,0,0,0,0,0,0,0,0],
            [0,1,0,0,0,0,0,0,0,0],
            [0,1,0,0,0,0,4,0,0,0],
            [0,1,0,4,0,0,0,0,0,0],
            [0,1,0,0,0,0,0,0,0,0],
            [0,1,1,1,1,1,1,1,1,0],
            [0,0,0,0,0,0,0,0,1,0],
            [0,0,0,4,0,0,0,0,1,0],
            [0,0,0,0,0,0,0,0,1,0],
            [0,0,0,0,0,0,0,0,3,0]
        ];
    }
}

class MapController {
    constructor(level) {
        this.level = level;
        this.map = new Map(this.level);
    }

    getStart() {
        return this.getPosition(START);
    }

    getEnd() {
        return this.getPosition(END);
    }

    mapAction(actionX, actionY) {
        for (let i = 0; i < this.map.schema.length; i++) {
            for (let j = 0; j < this.map.schema[i].length; j++) {
                if (!actionY(i, j)) break;
            }

            if (!actionX(i)) break;
        }
    }

    getAdjacentTiles(position) {
        if (!position) return [];

        let posX = position.x,
            posY = position.y,
            adjacentTiles = [],
            toFind = [
                { x: posX - 1, y: posY     },
                { x: posX + 1, y: posY     },
                { x: posX,     y: posY + 1 },
                { x: posX,     y: posY - 1 },
                { x: posX - 1, y: posY + 1 },
                { x: posX + 1, y: posY + 1 },
                { x: posX - 1, y: posY - 1 },
                { x: posX + 1, y: posY - 1 },
            ];

        toFind.forEach(t => adjacentTiles.push(this.getTile(t)));

        return adjacentTiles.filter(t => null !== t);
    }

    getTowers() {
        let towers = [],
            funcY = (x, y) => {
                if (this.map.schema[x][y] === this.getTileType(TOWER)) {
                    towers.push({ x, y });
                }

                return true;
            },
            funcX = (x) => {
                return true;
            };

        this.mapAction(funcX, funcY);

        return towers;
    }

    getNextPaths(position) {
        return this
              .getAdjacentTiles(position)
              .filter(t => t.type === this.getTileType(PATH) || t.type === this.getTileType(END));
    }

    getTile(position) {
        let posX = position.x,
            posY = position.y,
            tile = null,
            funcY = (x, y) => {
                if (x === posX && y === posY) {
                    tile = { x, y, type: this.map.schema[x][y] };
                    return false;
                }

                return true;
            },
            funcX = (x) => {
                if (tile) return false;
                return true;
            };

        this.mapAction(funcX, funcY);
        
        return tile;
    }

    getPosition(type) {
        let position = null,
            tileType = this.getTileType(type),
            funcY = (x, y) => {
                if (this.map.schema[x][y] === tileType) {
                    position = { x, y };
                    return false;
                }

                return true;
            },
            funcX = (x) => {
                if (position) return false;
                return true;
            };
        
        this.mapAction(funcX, funcY);

        return position;
    }

    getTileTypeByPosition(position) {
        return this.getTileType(this.map.schema[position.x][position.y]);
    }

    getTileType(type) {
        switch (type) {
            case EMPTY: return 0;
            case PATH: return 1;
            case START: return 2;
            case END: return 3;
            case TOWER: return 4;
            case 0: return EMPTY;
            case 1: return PATH;
            case 2: return START;
            case 3: return END;
            case 4: return TOWER;
            default: return -1;
        }
    }

    getTileBackground(tileType) {
        switch (tileType) {
            case EMPTY: return "transparent";
            case PATH: return "black";
            case START: return "green";
            case END: return "red";
            case TOWER: return "blue";
            default: return "white";
        }
    }

    draw() {
        let board = $("#board"),
        sizeX = this.map.getSizeX(),
        sizeY = this.map.getSizeY(),
        getElement = (x, y) => {
            let pos = { x, y },
                tileType = this.getTileTypeByPosition(pos),
                className = `square ${ tileType }`;

            return `<div class="${ className.toLowerCase() }" 
                         style="background-color: ${ this.getTileBackground(tileType) };"
                         data-x="${ x }"
                         data-y="${ y }"
                    </div>`;
        };

        for (let i = 0; i < sizeX; i++) {
            for (let j = 0; j < sizeY; j++) {
                
                board.append(getElement(i, j));
            }
        }
    }
};

export default MapController;