/**

AnimalCollection
    animals
    lanes
    speciesInstances
    _onAnimalDeath
    _onAnimalBirth
    _onSpeciesDeath

 .init
 .setSpecies
 .bindCollectionEvents
 .onAnimalDeath
 .onAnimalBirth
 .getAnimalById
 .animalHit
 .createAll
 .addToLane
 .draw

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

var AnimalCollection = function(options) {

    this.animals = [];
    this.lanes = [
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
    this.speciesInstances = [];

    this._onAnimalDeath  = new signals.Signal();
    this._onAnimalBirth  = new signals.Signal();
    this._onSpeciesDeath = new signals.Signal();
}

AnimalCollection.prototype.init = function() {
    this.setSpecies();
}

//load conf file and species instances
AnimalCollection.prototype.setSpecies = function() {
    for ( var species in animalsConfig ) {
        var instance = new Animal(animalsConfig( species ));
        instance._onBirth.add(this.onAnimalBirth, this);
        this.speciesInstances.push( instance )
    }
}

AnimalCollection.prototype.bindCollectionEvents = function() {
}

AnimalCollection.prototype.onAnimalDeath = function(animal) {
    //notify death of na animal (for the view)
    this._onAnimalDeath.dispatch();
}

AnimalCollection.prototype.onAnimalBirth = function(animal) {
    this.animals.push(animal);
}

AnimalCollection.prototype.animalHit = function(event) {
    var uid = event.target.getAttribute("data-animal_uid");
    var animal = this.getAnimalById(id);
debugger;
}

AnimalCollection.prototype.getAnimalById = function(id) {

}

AnimalCollection.prototype.create = function(specy) {
    console.log( "new animal" );
    var instance = AnimalFactory.getInstanceOf(specy);

    if (void 0 === this.instances[type.name]) {
        this.instances[type.name] = [];
    }

    //set up the death event
    instance._onDeath.add( this.onAnimalDeath, this );

    //save instance reference
    this.instances[type.name].push( instance );

    //notify the birth of an animal (for the view)
    this._onAnimalBirth.dispatch(instance);
}

//iterate through conf file to spawn all units necessary
AnimalCollection.prototype.createAll = function() {
    this.animals.forEach(function(current, index, array){
        for (var qty = 0; qty < current.quantity; qty++ ) {
            this.create(current.specy);
        }
    }, this)
}

AnimalCollection.prototype.addToLane = function(animal) {
    var min = 999;
    this.lanes.forEach(function(lane){
        if ( lane.count < min && lane.count < lane.max) min = lane.count;
    });

    //@todo: sécuriser overflow

    var lane = this.lanes[min];

    lane.count++;

    animal.lane = min; //@todo: lane -> laneId ?

}

AnimalCollection.prototype.draw = function() {
    for ( specy in this.instances ) {
        this.instances[specy].forEach(function(instance, index, array){

        }, this);
    }
}


//@todo: removeFromLane
//@todo: removeFromAnimals
//@todo: parent collection for click with weapon and time and score ?

