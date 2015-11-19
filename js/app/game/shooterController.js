var ShooterController = function() {
    this.animals = [
        {
            type: Zebra,
            quantity: 3
        },
        {
            type: Rhino,
            quantity: 1
        }
    ]
    this.animalsInstances = [];
}

ShooterController.prototype.init = function() {
    this.spawnThemAll();
}

//iterate through conf file to spawn all units necessary
ShooterController.prototype.spawnThemAll = function() {
    for (var type = 0; type < this.animals.length; type++) {
        for (var qty = 0; qty < this.animals[type].quantity; qty++) {
            //debugger;
            var animalInstance = new this.animals[type].type;
            animalInstance.draw();
            this.animalsInstances.push(animalInstance);
        }
    }
}



