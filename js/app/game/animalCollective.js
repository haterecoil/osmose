/**
 * Backbone's inspired M VC
 *
 * This is a collection:
 *  - grouping animals
 *  - watching changes on Animal (graphic update) and Herd ( flashes )
 *
 **/

//@todo : go abstract or go concrete !!!!
    //but first mvp
/*var AnimalCollective = function(options) {
    //@todo: set in an option ?
    this.animals = [
        {
            specy: Zebra,
            quantity: 3
        },
        {
            specy: Rhino,
            quantity: 1
        }
    ]

    this.instances = {};

    this._onAnimalDeath  = new signals.Signal();
    this._onAnimalBirth  = new signals.Signal();
    this._onSpeciesDeath = new signals.Signal();
}

AnimalCollective.prototype.init = function() {
    this.createMany();
}

AnimalCollective.prototype.bindCollectionEvents = function() {
}

AnimalCollective.prototype.onAnimalDeath = function(animal) {
    //notify death of na animal (for the view)
    this._onAnimalDeath.dispatch();
}

AnimalCollective.prototype.animalHit = function(event) {
    var uid = event.target.getAttribute("data-animal_uid");
    var animal = this.getAnimalById(id);
debugger;
}

AnimalCollective.prototype.getAnimalById = function(id) {

}

AnimalCollective.prototype.create = function(type) {
    console.log( "new animal" );
    var instance = new type();

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
AnimalCollective.prototype.createMany = function() {
    this.animals.forEach(function(current, index, array){
        for (var qty = 0; qty < current.quantity; qty++ ) {
            this.create(current.specy);
        }
    }, this)
}*/





