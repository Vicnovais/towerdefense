const waves = [
    { level: 1, monsterQuantity: 10, monsterHp: 300 },
    { level: 2, monsterQuantity: 20, monsterHp: 500 },
    { level: 3, monsterQuantity: 30, monsterHp: 600 }
];

class Wave {
    constructor(level, monsterController, mapController) {
        this.monsters = [];
        this.level = level;
        this.monsterController = monsterController;
        this.mapController = mapController;
        this.config = this.getWaveConfig();
        this.sent = false;
    }

    getWaveConfig() {
        let config = waves.filter(t => t.level === this.level);

        if (config.length === 1) return config[0];
        else return null;
    }

    send() {
        this.sent = true;

        if (this.config) {
            for (let i = 1; i <= this.config.monsterQuantity; i++) {
                this.monsterController.addMonster(this.mapController, this.config.monsterHp);
            }
        }
    }
}

class WaveController {
    constructor(monsterController, mapController) {
        this.currentLevel = 1;
        this.monsterController = monsterController;
        this.mapController = mapController;
    }

    send() {
        let wave = new Wave(this.currentLevel, this.monsterController, this.mapController);
        this.currentLevel++;
        wave.send();
    }
}

export default WaveController;