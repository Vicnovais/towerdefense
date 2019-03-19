const MONSTER_HEIGHT = 15;
const MONSTER_WIDTH = 15;

class Monster {
    constructor(monsterController, mapController, hp, speed) {
        this.id = this.generateUUID();
        this.mapController = mapController;
        this.monsterController = monsterController;
        this.hp = hp;
        this.speed = speed || 900;
        this.initialPosition = this.getInitialPosition();
        this.endPosition = this.getEndPosition();
        this.currentPosition = this.initialPosition;
        this.walkedPaths = [this.initialPosition];
        this.element = null;
        this.visible = false;
    }

    getInitialPosition() {
        return this.mapController.getStart();
    }

    getEndPosition() {
        return this.mapController.getEnd();
    }

    getNextPath() {
        let nextPaths = this.mapController.getNextPaths(this.currentPosition);
        return nextPaths.filter(t => !this.hasWalkedPast(t))[0];
    }

    canWalk() {
        let nextPath = this.getNextPath();
        if (!nextPath) return false;

        return this
              .monsterController
              .monsters
              .filter(t => t.currentPosition.x === nextPath.x 
                        && t.currentPosition.y === nextPath.y)
              .length === 0;
    }

    walk() {
        if (this.canWalk()) {
            this.currentPosition = this.getNextPath();
            this.walkedPaths.push(this.currentPosition);
        }
    }

    hasWalkedPast(position) {
        for (let i = 0; i < this.walkedPaths.length ; i++) {
            let x = this.walkedPaths[i].x,
                y = this.walkedPaths[i].y

            if (x === position.x && y === position.y)
                return true;
        }
    }

    generateUUID() {
        var d = new Date().getTime();

        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    removeHp(value) {
        let state = this.hp - value;

        if (state < 0) this.hp = 0;
        else this.hp -= value;
    }

    addHp(value) {
        this.hp += value;
    }

    isDead() {
        return this.hp <= 0;
    }

    onVisible() {
        this.element = $(`.monster[data-id=${ this.id }]`);
    }

    onCollide(projectile) {
        if (projectile) {
            this.removeHp(projectile.power);
            this.check();
        }
    }

    check() {
        if (this.isDead()) {
            if (this.element && this.element.length) {
                this.visible = false;
                this.element.remove();
                this.element = null;
            }
        }
    }
};

class MonsterController {
    constructor(onFinish) {
        this.monsters = [];
        this.onFinish = onFinish;
    }

    addMonster(mapController, hp, speed) {
        let monster = new Monster(this, mapController, hp, speed);
        this.monsters.push(monster);
    }

    removeMonster(monster) {
        this.monsters = this.monsters.filter(t => t.id !== monster.id);
    }

    getMonsters() {
        return this.monsters;
    }

    walk() {
        if (this.monsters.length === 0) {
            this.onFinish();
        }
        else {
            this.monsters.forEach(t => {
                t.walk();
            });
        }
    }

    createElement(monster, position) {
        return `<div class="monster" data-id="${ monster.id }" 
                     style="top: ${ position.y }px; left: ${ position.x }px" />`;
    }

    draw() {
        this.monsters = this.monsters.filter(t => !t.isDead());
        this.monsters.forEach(t => {
            if (t.currentPosition) {
                let square = $(`.square[data-x="${ t.currentPosition.x }"][data-y="${ t.currentPosition.y }"]`),
                    squareOffset = square.offset(),
                    squareCenterX = Math.floor(Math.ceil(square.outerWidth()) / 2),
                    squareCenterY = Math.floor(Math.ceil(square.outerHeight()) / 2),
                    squareCenterOffset = { 
                        x: Math.floor(squareOffset.left) + squareCenterX - Math.ceil(MONSTER_WIDTH / 2), 
                        y: Math.floor(squareOffset.top) + squareCenterY - Math.ceil(MONSTER_HEIGHT / 2)
                    };
                
                if (!t.visible) {
                    t.visible = true;
                    $("body").append(this.createElement(t, squareCenterOffset));
                    t.onVisible();
                }
                else {
                    let element = $(`.monster[data-id="${ t.id }"]`);

                    element.animate({ 
                        top: squareCenterOffset.y, 
                        left: squareCenterOffset.x
                    }, t.speed);
                }
            }
        })
    }
}

export default MonsterController;