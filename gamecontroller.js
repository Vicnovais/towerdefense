import MapController from './mapcontroller.js';
import MonsterController from './monstercontroller.js';
import TowerController from './towercontroller.js';
import WaveController from './wavecontroller.js';
import BuilderController from './buildercontroller.js';

class Game {
    constructor() {
        this.mapController = new MapController(1);
        this.monsterController = new MonsterController(this.onFinish.bind(this));
        this.towerController = new TowerController(this.monsterController, this.mapController);
        this.waveController = new WaveController(this.monsterController, this.mapController);
        this.builderController = new BuilderController(this.mapController, this.towerController);
        this.score = 0;
        this.lifes = 50;
    }

    start() {
        this.drawMap();
        this.attachEvents();
        this.sendWave();
    }

    onFinish() {
        this.towerController.clearProjectiles();
        this.sendWave();
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

    attachEvents() {
        $(".square.empty").on("drop", (e) => {
            e.preventDefault();  
            e.stopPropagation();
            this.builderController.onDrop(e);
        });

        $(".tower-base").on("dragstart", (e) => {
            this.builderController.onDragStart(e);
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