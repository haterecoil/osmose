/**

    AnimalCollection
        animals
        lanes
        speciesInstances
        _onAnimalDeath
        _onAnimalBirth
        _onSpeciesDeath

    .init()
    .setSpecies()
    .setAnimalInstance()
    .populateLanes()
    .balanceLanes()
    .createAnimal()
    .createRandomAnimal()
    .onSpeciesDeath()
    .onAnimalDeath()
    .noMoreAnimals()
    .getAnimalByUid()
    .appendToHtml()
    .draw()
    .onResize()

 **/
window.draw = false;
var AnimalCollective = function() {

    this.speciesTracker = [];   //keeps references to species config
    this.animalInstances = [];  //keeps references to living animals
    this.lanes = new Lanes(lanesConfig);   //Lanes handles lanes append and remove

    this._onAnimalDeath = new signals.Signal();
    this._onAnimalHit   = new signals.Signal();
    this._endOfGame     = new signals.Signal();

    this.totalPopulation = 0;   //will update to the total possible population

    this.fps = 5;               //used by requestAnimationFrame

    this.gameIsRunning = false; //to stop animationFrame

};

AnimalCollective.prototype.init = function(animalsConfig) {

    this.setSpecies(animalsConfig);     //load animal configs
    this.lanes.appendToHtml();          //init lanes
    this.gameIsRunning = true;          //enable loop
};

AnimalCollective.prototype.setSpecies = function(speciesConf) {
    if (void 0 === speciesConf ) console.error( "species QQ ?" ); ;

    this.speciesTracker = speciesConf;
    this.speciesTracker.forEach(function(curr){     //one loop now prevents further loops
        this.totalPopulation += curr.population;
    }, this);
};

AnimalCollective.prototype.setAnimalInstance = function(animal, laneIndex){
    this.animalInstances.push({
        instance: animal,       //the animal itself
        laneIndex: laneIndex,   //its lane index to easily add and remove
        species: animal.name    //@todo useless ?
    });
};

/*create enough animals to fill the lanes*/
AnimalCollective.prototype.populateLanes = function() {

    var laneIndexes = this.lanes.getLaneSlots();    //get possible lane slots

    //for each slot, create an animal and append it to the lane
    //  append a random animal to a random lane
    while (laneIndexes.length > 0) {
        var randomIndex = Math.floor(Math.random()*laneIndexes.length);
        var randomSlot = laneIndexes[randomIndex];

        var animal = this.createRandomAnimal();


        if (void 0 === animal) break;   //if undefined, then there is no animal to spawn !

        animal._onHit.add(this.onAnimalHit.bind(this));
        this.lanes.appendToLane(animal.domElement, randomSlot);
        this.setAnimalInstance(animal, randomSlot);

        //no infinite loop plz
        laneIndexes.splice(randomIndex, 1);
    }
};
/* put new animals in available lane */
AnimalCollective.prototype.balanceLanes = function() {

    if ( this.lanes.getEmptiestLaneIndex() > -1 ){
        var animal = this.createRandomAnimal();

        if (void 0 === animal) return;  //if undefined, then there is no animal to spawn !

        var laneIndex = this.lanes.appendToLane(animal.domElement);
        this.setAnimalInstance(animal, laneIndex);
    }
};

/**
 * create an animal instance and bind elements
 * @param speciesName string
 * @returns {Animal}
 */
AnimalCollective.prototype.createAnimal = function(speciesName) {

    //get animal's config
    var animalConf = {};
    for (var i = 0; i < this.speciesTracker.length; i++) {
        if (this.speciesTracker[i].name == speciesName) {
            animalConf = this.speciesTracker[i];
            break;                                      //break once found
        }
    }
    //create an Animal from its speciesName
    var animal = new Animal();
    animal.configure(animalConf);
    animal._onDeath.add(this.onAnimalDeath.bind(this));

    //set up dom
    animal.initView();

    //keep count
    animalConf.alive++;

    window.zoub = animal;
    return animal;
};

/**
 * select a random animal then call createAnimal()
 * @returns Animal
 *
 **/
AnimalCollective.prototype.createRandomAnimal = function() {
    var randomAnimal = null;
    var deadSpecies = 0;

    //select available species
    var species = this.speciesTracker.filter(function(species){
        if ( species.alive < species.population )
            return true;
    });

    //return undefined if there are no available species anymore
    if ( species.length < 1 )
        return undefined;

    var randomSpecies = species[Math.floor(Math.random()*species.length)];

    randomAnimal = this.createAnimal(randomSpecies.name);

    return randomAnimal;
};

AnimalCollective.prototype.onAnimalHit = function() {
    this._onAnimalHit.dispatch();
}

/**
 * flash a dead animal on the screen
 * @param speciesRef species' conf
 */
AnimalCollective.prototype.onSpeciesDeath = function(speciesRef) {

    var $flash = $('<img/>')
    $flash.addClass('flash');

    $flash.load( function(){
        $('#game').prepend($flash);
        setTimeout(function(){ $flash.fadeOut(300).remove(); }, 200)

    });

    $flash[0].src = speciesRef.assets.death.flashPath;

};
/**
 * dispatch the Signal event, update lanes and animal counters,
 * can trigger this.onSpeciesDeath() and this.noMoreAnimals()
 * @param animalUid a uid string
 */
AnimalCollective.prototype.onAnimalDeath = function(animalUid) {

    this._onAnimalDeath.dispatch();

    var animalReference = this.getAnimalByUid(animalUid);

    //remove from lane
    this.lanes.removeFromLane(animalUid, animalReference.ref.laneIndex);

    //decrement animal counter
    this.totalPopulation--;

    //remove from animalInstances
    this.animalInstances.splice(animalReference.index, 1);

    //trigger species's death event
    for (var i = 0 ; i < this.speciesTracker.length; i++) {
        if (this.speciesTracker[i].name == animalReference.ref.species) {
            this.speciesTracker[i].dead++;
            if (this.speciesTracker[i].dead >= this.speciesTracker[i].population) {
                this.onSpeciesDeath(this.speciesTracker[i]);
            }
            break;
        }
    }

    if ( this.totalPopulation <= 0 ) {
        this.noMoreAnimals();
    }

    //balance lanes
    this.balanceLanes();
};

AnimalCollective.prototype.noMoreAnimals = function() {
    console.log( "end of game :)" );
    this.gameIsRunning = false;
    this._endOfGame.dispatch();

};
/**
 * returns a animalInstances reference correpsonding to uid
 * @param animalUid
 * @returns {{ref: Animal, index: number}}
 */
AnimalCollective.prototype.getAnimalByUid = function(animalUid) {
    for (var i = 0; i < this.animalInstances.length; i++) {
        if (this.animalInstances[i].instance.uid == animalUid) {
            return {ref: this.animalInstances[i], index: i};
        }
    }
};

/**
 *
 * @param animal Animal instance
 */
AnimalCollective.prototype.appendToHtml = function(animal) {
    var $container = $('#game');
    $container.append(animal.getDomElement());
};


AnimalCollective.prototype.draw = function() {
    if (!this.gameIsRunning) return;

    var self = this;

    if ( !window.draw ) {
        setTimeout( requestAnimationFrame( self.draw.bind(self) ), 3000 );
    }
    else {
        setTimeout(function() {
            // Drawing code goes here
            self.animalInstances.forEach(function(anRef){
                setTimeout(function(){
                    var animalInstance = anRef.instance;
                    if ( animalInstance.posX > self.lanes.lanes[anRef.laneIndex].width - (animalInstance.domElement.width()) ) {
                        animalInstance.goLeft();
                    } else if ( animalInstance.posX < 0 ) {
                        animalInstance.goRight();
                    }
                    animalInstance.move();

                }, 1000 / (Math.floor(Math.random()*self.fps)));
            });

            requestAnimationFrame(self.draw.bind(self));

        }, 1000 / self.fps);
    }
}

AnimalCollective.prototype.onResize = function() {

}



