import MapController from './mapcontroller.js';
import MonsterController from './monstercontroller.js';
import TowerController from './towercontroller.js';
import WaveController from './wavecontroller.js';
import BuilderController from './buildercontroller.js';

class Game {
    constructor() {
        this.mapController = new MapController(1);
        this.monsterController = new MonsterController(this, this.onFinish.bind(this));
        this.towerController = new TowerController(this.monsterController, this.mapController);
        this.waveController = new WaveController(this.monsterController, this.mapController);
        this.builderController = new BuilderController(this.mapController, this.towerController);
        this.score = 0;
        this.gold = 150;
        this.lifes = 50;
    }

    start() {
        this.drawMap();
        this.initTowers();
        this.attachEvents();
        this.updateGold(0);
        this.updateScore(0);
        this.sendWave();
    }

    onFinish() {
        this.towerController.clearProjectiles();
        this.sendWave();
    }

    getCurrentWave() {
        return this.waveController.currentWave;
    }

    sendWave() {
        this.waveController.send();
    }

    shootTowers() {
        this.towerController.shoot();
    }

    addMonster() {
        this.monsterController.addMonster(this.mapController, 1000);
    }
    
    walkMonsters() {
        this.monsterController.walk();
        this.monsterController.draw();
    }

    drawMap() {
        this.mapController.draw();
    }

    getGold() {
        return this.gold;
    }

    updateScore(amount) {
        this.score += amount;
        let scoreElement = $("#score");
        scoreElement.text(this.score);
    }

    updateGold(amount) {
        this.gold += amount;
        let goldElement = $("#gold");
        goldElement.text(this.gold);
    }

    initTowers() {
        $(".tower-base").each((index, element) => {
            let towerType = $(element).attr("data-kind"),
                towerCost = this.towerController.getTowerCost(towerType);

            $(element).attr("data-price", `${ towerCost } gold`);
        });
    }

    attachEvents() {
        $(".square.empty").on("drop", (e) => {
            e.preventDefault();  
            e.stopPropagation();
            this.builderController.onDrop(e);
            
            let dataTransfer = e.originalEvent.dataTransfer,
                towerType = dataTransfer.getData("towerType"),
                towerCost = this.towerController.getTowerCost(towerType);

            this.updateGold(-towerCost);
        });

        $(".tower-base").on("dragstart", (e) => {
            this.builderController.onDragStart(e, this.getGold());
        });

        $(".tower-base").on("mouseover", (e) => {
            this.builderController.onMouseOver(e, this.getGold());
        });

        $(".square.empty").on("dragover", (e) => {
            e.preventDefault();  
            e.stopPropagation();
            this.builderController.onDragOver(e);
        });

        $(".square.empty").on("dragleave", (e) => {
            e.preventDefault();  
            e.stopPropagation();
            this.builderController.onDragLeave(e);
        });
    }
}

export default Game;