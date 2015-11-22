/**

AnimalCollection
    animals
    lanes
    speciesInstances
    _onAnimalDeath
    _onAnimalBirth
    _onSpeciesDeath

 .setSpecies(json) //gets all species name and quantity from conf
 .setLanes(json) // gets lanes size and max qty from conf
 .populateLanes
 .adjustPopulation
 .checkSpeciesDeath
 .onAnimalDeath
 .onAnimalBirth
 .createAnimal(species)
 .setAnimalLane(AnimalInstance)
 .updatePositions
 .draw

 **/

var AnimalController = function() {
    this.speciesTracker = [];
    this.animalInstances = [];
    this.speciesConf = [];
    this.lanes = [];
}

AnimalController.prototype.init = function(animalsConfig, lanesConfig) {
    console.log( "anco init -- start" );
    this.setSpecies(animalsConfig);
    this.setLanes(lanesConfig);
    console.log( "anco init -- end" );
}

AnimalController.prototype.setSpecies = function(speciesConf) {
    //read conf file   -> @todo: another conf than animals so auto metaname load ?
    if (void 0 === speciesConf ) return;
    /*conf.forEach(function(curr, index, array){

        //populate speciesTracker with objects "animalName" : {deathAsset, etc.} ?
        this.speciesTracker.push({
            name: curr.name,
            max: curr.quantity,
            count: 0
        });

    });*/
    this.speciesTracker = speciesConf; // @todo: :'(
}

AnimalController.prototype.setLanes = function(lanesConf) {
    //read conf file --> @todo: abstract function for both ? setProperty(property, confArray) ?
    if (void 0 === lanesConf ) return;
    lanesConf.forEach(function(lane, index, array){
        //populate this.lanes with objects {maxQty, width, currQty}
        this.lanes.push({
            count: 0,
            max: lane.max,
            width: lane.width
        });

    }, this);
}

AnimalController.prototype.setAnimalInstance = function(animal, laneIndex){
    this.animalInstances.push({
        instance: animal,
        laneIndex: laneIndex,
        species: animal.name
    });
    this.lanes[laneIndex].count++;
};

AnimalController.prototype.populateLanes = function() {
    /*create enough animals to fill the lanes*/
    //gather lane slots
    console.log( "anCo populate -- start" );
    var laneSlots = [];
    this.lanes.forEach(function(curr, index, array){
        for (var i = 0; i < curr.max; i++) {
            var slot = {
                laneIndex: index
            }
            laneSlots.push(slot);
        }
    }, this);

    console.log( "laneSlots length : " + laneSlots.length);
    //for each slot, create an animal and append it to the lane
    while (laneSlots.length > 0) {
        //select a random slot so it's not ordered
        var randomIndex = Math.floor(Math.random()*laneSlots.length)
        var randomSlot = laneSlots[randomIndex];
        //create a random animal and append it to html
        var animal = this.createRandomAnimal();

        //save reference
        this.setAnimalInstance(animal, randomSlot.laneIndex);

        //no infinite loop plz :p
        laneSlots.splice(randomIndex, 1);
    }
    console.log( "anco populate -- end" );
}

AnimalController.prototype.getEmptiestLaneIndex = function() {
    //select the emptiest lane
    var lane = -1;
    var min = 2.0;
    this.lanes.forEach(function(curr, index, array) {
       if ( curr.count < curr.max ) {
           min = curr.count/curr.max < min ? curr.count/curr.max : min;
           lane = index;
       }
    }, this);

    if ( lane > -1 && min < 1 ) return lane;
    else return -1;
}

AnimalController.prototype.balanceLanes = function(animal) {
    //@todo rename
    // should put new animals in correct lane
    var laneIndex = this.getEmptiestLaneIndex();
    if (laneIndex < 0) return;

    var animal = this.createRandomAnimal();
    this.lanes[laneIndex].count++;

}

AnimalController.prototype.checkSpeciesDeath = function(species) {
    //should trigger on animalDeath to check if a specy is dead
}
AnimalController.prototype.onSpeciesDeath = function(speciesRef) {
    //alternative to checkSpeciesDeath (if only onanimaldeath triggers)
    console.log( speciesRef + "  is dead :o");
}
AnimalController.prototype.onAnimalDeath = function(animalUid) {
    /*organize things happening when an animal dies*/
    console.log( "animal n°"+animalUid+" is dead" );
    var animalReference = this.getAnimalByUid(animalUid);

    //decr its lane
    this.lanes[animalReference.ref.laneIndex].count--;

    //decr speciesTracker
    for (var i = 0 ; i < this.speciesTracker.length; i++) {
        if (this.speciesTracker[i].name == animalReference.ref.species) {
            this.speciesTracker[i].count--;
            if (this.speciesTracker[i].count < 1) {
                this.onSpeciesDeath(this.speciesTracker[i]);
            }
            break;
        }
    }

    //remove from animalInstances
    this.animalInstances.splice(animalReference.index, 1);

    //balance lanes
    this.balanceLanes();

}

AnimalController.prototype.getAnimalByUid = function(animalUid) {
    //returns a animalInstances reference correpsonding to uid
    for (var i = 0; i < this.animalInstances.length; i++) {
        if (this.animalInstances[i].instance.uid = animalUid) {
            return {ref: this.animalInstances[i], index: i};
        }
    }
}

AnimalController.prototype.onAnimalBirth = function() {
    //organizes the things happening when an animal dies
}

AnimalController.prototype.createAnimal = function(speciesName) {

    //get conf object for a speciesName
    //@todo: plz find a cleaner solution ><
    var animalConf = {};
    for (var i = 0; i < this.speciesTracker.length; i++) {
        if (this.speciesTracker[i].name = speciesName) {
            animalConf = this.speciesTracker[i];
            break;
        }
    }
    //create an Animal from its speciesName
    var animal = new Animal();
    animal.configure(animalConf)

    //keep count
    animalConf.count++;

    //append to html
    animal.initView();
    this.appendToHtml(animal);

    return animal;
}

AnimalController.prototype.createRandomAnimal = function() {
    var randomAnimal = null;
    while ( randomAnimal === null) {
        //select species
        var species = this.speciesTracker[Math.floor(Math.random()*this.speciesTracker.length)];
        //is max < qty ?
        if ( species.count < species.max ) {
            randomAnimal = this.createAnimal(species.name);
        }
    };
    return randomAnimal;
}

AnimalController.prototype.appendToHtml = function(animal) {
    var $container = $('#game')
    $container.append(animal.getDomElement());

}



var lanesConfig = [
    {
        count: 0,
        max: 3,
        width: 200
    },
    {
        count: 0,
        max: 3,
        width: 350
    },
    {
        count: 0,
        max: 3,
        width: 500
    }
]

var animalsConfig = [
    {
        name: "rhinoceros",
        count: 0,
        max: 10,
        health: 3,
        speed: 1,
        color: "yellow",
        assets: {
            moving: [],
            dying: [],
            sounds: []
        }
    }
];




//@todo: removeFromLane
//@todo: removeFromAnimals
//@todo: parent collection for click with weapon and time and score ?

