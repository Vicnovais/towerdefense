import GameController from './gamecontroller.js';

var gameController = new GameController();

gameController.start();

setInterval(() => {
    //gameController.walkMonsters();
}, 300);

setInterval(() => {
    //gameController.shootTowers();
}, 100);