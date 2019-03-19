const MONSTER_HEIGHT = 15;
const MONSTER_WIDTH = 15;

class Projectile {
    constructor(tower, monster, power) {
        this.tower = tower;
        this.monster = monster;
        this.power = power || 10;
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
                                style="top: ${ squareCenterOffset.y }px; left: ${ squareCenterOffset.x }px;"
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
    constructor(position) {
        this.position = position;
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

    addTower(position) {
        this.towers.push(new Tower(position));
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