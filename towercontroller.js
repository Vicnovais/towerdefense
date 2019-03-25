const MONSTER_HEIGHT = 15;
const MONSTER_WIDTH = 15;
const BLUE_TOWER = "blue";
const RED_TOWER = "red";
const PURPLE_TOWER = "purple";
const YELLOW_TOWER = "yellow";
const GREEN_TOWER = "green";
const TOWER_POWER = { BLUE_TOWER: 100, RED_TOWER: 300, PURPLE_TOWER: 450, YELLOW_TOWER: 800, GREEN_TOWER: 1500 };

class Projectile {
    constructor(tower, monster) {
        this.tower = tower;
        this.monster = monster;
        this.power = this.tower.getPower();
        this.initialPosition = tower.position;
        this.id = this.generateUUID();
        this.speed = 200;
        this.create();
    }

    generateUUID() {
        var d = new Date().getTime();

        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    create() {
        let sourceSquare = $(`.square[data-x="${ this.initialPosition.x }"][data-y="${ this.initialPosition.y }"]`);

        if (sourceSquare.length) {
            let squareOffset = sourceSquare.offset(),
                squareCenterX = Math.floor(Math.ceil(sourceSquare.outerWidth()) / 2),
                squareCenterY = Math.floor(Math.ceil(sourceSquare.outerHeight()) / 2),
                squareCenterOffset = { 
                    x: Math.floor(squareOffset.left) + squareCenterX - Math.ceil(MONSTER_WIDTH / 2), 
                    y: Math.floor(squareOffset.top) + squareCenterY - Math.ceil(MONSTER_HEIGHT / 2)
                },
                element = `<div class="projectile" 
                                style="top: ${ squareCenterOffset.y }px; 
                                       left: ${ squareCenterOffset.x }px;
                                       background-color: ${ this.tower.type }";
                                       border: 1px solid ${ this.tower.type };
                                data-id="${ this.id }">
                            </div>`;
            
            $("body").append(element);
        }
    }

    shoot() {
        let projectileElement = $(`.projectile[data-id="${ this.id }"]`),
            monsterElement = $(`.monster[data-id="${ this.monster.id }"]`);

        if (projectileElement.length && monsterElement.length) {
            let monsterOffset = monsterElement.offset(),
                targetCoordinates = { 
                    x: monsterOffset.left + Math.floor(MONSTER_WIDTH / 2),
                    y: monsterOffset.top + Math.floor(MONSTER_HEIGHT / 2),
                };
        
            projectileElement.animate({ 
                top: targetCoordinates.y, 
                left: targetCoordinates.x 
            }, 
            {
                duration: this.speed,
                queue: false,
                complete: () => {
                    projectileElement.remove();
                    this.monster.onCollide(this);
                }
            });
        }
    }
}

class Tower {
    constructor(position, type) {
        this.position = position;
        this.type = type;
    }

    getPower() {
        if (!this.type) return 100;
        return TOWER_POWER[this.type] || 100;
    }
}

class TowerController {
    constructor(monsterController, mapController) {
        this.towers = [];
        this.monsterController = monsterController;
        this.mapController = mapController;
        this.setTowers();
    }

    setTowers() {
        this.mapController.getTowers().forEach(t => {
            this.addTower(t);
        });
    }

    addTower(position, type) {
        this.towers.push(new Tower(position, type));
    }

    shoot() {
        let target = this.monsterController.getMonsters();

        if (target.length > 0) {
            target = target[0];

            this.towers.forEach(t => {
                let projectile = new Projectile(t, target);
                projectile.shoot();
            });
        }
    }

    clearProjectiles() {
        $(".projectile").remove();
    }
}

export default TowerController;