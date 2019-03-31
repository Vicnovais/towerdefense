const waves = [
    { level: 1, monsterQuantity: 5,  monsterHp: 1000, monsterGold: 35, monsterScore: 10 },
    { level: 2, monsterQuantity: 20, monsterHp: 2500, monsterGold: 50, monsterScore: 30 },
    { level: 3, monsterQuantity: 30, monsterHp: 4000, monsterGold: 85, monsterScore: 70 }
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
        this.currentWave = null;
    }

    send() {
        let wave = new Wave(this.currentLevel, this.monsterController, this.mapController);
        this.currentLevel++;
        this.currentWave = wave;
        wave.send();
    }
}

export default WaveController;