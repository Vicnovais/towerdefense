const TOWER = "TOWER";

class Builder {
    constructor(mapController, towerController) {
        this.mapController = mapController;
        this.towerController = towerController;
        this.draggedElement = null;
    }

    onDrop(e) {
        e.preventDefault();
        let dataTransfer = e.originalEvent.dataTransfer,
            towerType = dataTransfer.getData("towerType"),
            square = $(e.currentTarget),
            dataX = square.attr("data-x"),
            dataY = square.attr("data-y");

        this.mapController.map.schema[dataX][dataY] = this.mapController.getTileType(TOWER);
        this.towerController.addTower({ x: dataX, y: dataY }, towerType);
        square.css("opacity", 1);
        square.css("backgroundColor", towerType);
        square.addClass(TOWER.toLowerCase());
        square.off("drop");
        square.off("dragover");
        square.off("dragleave");
    }

    onDragStart(e, currentGold) {
        let dataTransfer = e.originalEvent.dataTransfer,
            target = $(e.currentTarget),
            towerType = target.attr("data-kind"),
            towerCost = this.towerController.getTowerCost(towerType);

        if (currentGold < towerCost) {
            e.stopPropagation();
            e.preventDefault();
        }
        else {
            this.draggedElement = target;
            dataTransfer.setData("towerType", towerType);
        }
    }

    onDragOver(e) {
        if (this.draggedElement) {
            let towerType = this.draggedElement.attr("data-kind"),
                square = $(e.currentTarget);
        
            square.css("opacity", 0.5);
            square.css("backgroundColor", towerType);
        }
    }

    onDragLeave(e) {
        let square = $(e.currentTarget);
    
        square.css("opacity", 1);
        square.css("backgroundColor", "transparent");
    }

    onMouseOver(e, currentGold) {
        let tower = $(e.currentTarget),
            towerType = tower.attr("data-kind"),
            towerCost = this.towerController.getTowerCost(towerType);

        if (currentGold < towerCost) {
            tower.css("cursor", "not-allowed");
        }
        else {
            tower.css("cursor", "pointer");
        }
    }
}

export default Builder;