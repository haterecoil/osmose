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
    this.lanes = new Lanes();

    this.totalPopulation = 0;

    this.fps = 15;

    this.gameIsRunning = false;

};

AnimalController.prototype.init = function(animalsConfig) {
    /*console.log( "anco init -- start" );*/
    this.setSpecies(animalsConfig);
    this.lanes.appendToHtml();

    this.gameIsRunning = true;

    /*console.log( "anco init -- end" );*/
};

AnimalController.prototype.setSpecies = function(speciesConf) {
    //read conf file   -> @todo: another conf than animals so auto metaname load ?
    if (void 0 === speciesConf ) console.error( "species QQ ?" ); ;
    this.speciesTracker = speciesConf; // @todo: :'(
    this.speciesTracker.forEach(function(curr){
        this.totalPopulation += curr.population;
    }, this);
};

AnimalController.prototype.setAnimalInstance = function(animal, laneIndex){
    this.animalInstances.push({
        instance: animal,
        laneIndex: laneIndex,
        species: animal.name
    });
    /*console.log( "["+laneIndex+"] #"+animal.uid + "-- setAnimalInstance");*/
};

AnimalController.prototype.populateLanes = function() {
    /*create enough animals to fill the lanes*/
    //gather lane slots
    console.info( "anCo populate -- start" );
    var laneIndexes = this.lanes.getLaneSlots();

    //for each slot, create an animal and append it to the lane
    while (laneIndexes.length > 0) {
        //select a random slot so it's not ordered
        var randomIndex = Math.floor(Math.random()*laneIndexes.length);
        var randomSlot = laneIndexes[randomIndex];

        //create a random animal and append it to html
        var animal = this.createRandomAnimal();

        //if animal is undefined, then there is no more animals to spawn !
        if (void 0 === animal) break;

        this.lanes.appendToLane(animal.domElement, randomSlot);

        /*console.log( "[" +randomSlot+"] #" + animal.uid  + "-- populateLanes");*/
        //save reference
        this.setAnimalInstance(animal, randomSlot);
        //no infinite loop plz :p
        laneIndexes.splice(randomIndex, 1);
    }

    console.info( "anco populate -- end" );
};

AnimalController.prototype.balanceLanes = function() {
    //@todo rename
    // should put new animals in correct lane
    if ( this.lanes.getEmptiestLaneIndex() > -1 ){
        var animal = this.createRandomAnimal();

        //if animal is undefined, then there is no more animals to spawn !
        if (void 0 === animal) return;

        var laneIndex = this.lanes.appendToLane(animal.domElement);
        this.setAnimalInstance(animal, laneIndex);
    }

};

AnimalController.prototype.createAnimal = function(speciesName) {

    //load species conf
    var animalConf = {};
    for (var i = 0; i < this.speciesTracker.length; i++) {
        if (this.speciesTracker[i].name == speciesName) {
            animalConf = this.speciesTracker[i];     //set animal conf
            break;
        }
    }
    //create an Animal from its speciesName
    var animal = new Animal();
    animal.configure(animalConf);
    animal._onDeath.add(this.onAnimalDeath.bind(this));
    //set up dom
    animal.initView();
    //@dev
    $(animal.domElement).text(animal.uid);

    //keep count
    animalConf.counter++;

    return animal;
};

AnimalController.prototype.createRandomAnimal = function() {
    var randomAnimal = null;
    var deadSpecies = 0;

    //select species
    var species = this.speciesTracker.filter(function(species){
        if ( species.counter < species.population )
            return true;
    });

    //return undefined if there are no available animals anymore
    if ( species.length < 1 )
        return undefined;

    var randomSpecies = species[Math.floor(Math.random()*species.length)];

    if ( void 0 === randomSpecies ) debugger;

    randomAnimal = this.createAnimal(randomSpecies.name);

    return randomAnimal;
};

AnimalController.prototype.onSpeciesDeath = function(speciesRef) {
    //alternative to checkSpeciesDeath (if only onanimaldeath triggers)
    /*console.log( speciesRef + "  is dead :o");*/
    console.log(speciesRef.assets.death[0]);
};

AnimalController.prototype.onAnimalDeath = function(animalUid) {
    /*organize things happening when an animal dies*/
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
            if (this.speciesTracker[i].counter > this.speciesTracker[i].population) {
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

AnimalController.prototype.noMoreAnimals = function() {
    console.log( "end of game :)" );
    this.gameIsRunning = false;
};

AnimalController.prototype.getAnimalByUid = function(animalUid) {
    //returns a animalInstances reference correpsonding to uid
    for (var i = 0; i < this.animalInstances.length; i++) {
        if (this.animalInstances[i].instance.uid == animalUid) {
            return {ref: this.animalInstances[i], index: i};
        }
    }
};

AnimalController.prototype.onAnimalBirth = function() {
    //organizes the things happening when an animal dies
};



AnimalController.prototype.appendToHtml = function(animal) {
    var $container = $('#game');
    $container.append(animal.getDomElement());
};


AnimalController.prototype.draw = function() {
    if (!this.gameIsRunning) return;

    var self = this;
    setTimeout(function() {
        // Drawing code goes here
        self.animalInstances.forEach(function(anRef){
            setTimeout(function(){

                if ( anRef.instance.posX > self.lanes.lanes[anRef.laneIndex].width ) {
                    anRef.instance.goLeft();
                } else if ( anRef.instance.posX < 0 ) {
                    anRef.instance.goRight();
                }
                anRef.instance.move();

            }, 1000 / (Math.floor(Math.random()*self.fps)));
        });

        requestAnimationFrame(self.draw.bind(self));

    }, 1000 / self.fps);
}




var Lanes = function() {
    this.lanes = [
        {
            count: 0,
            max: 3,
            width: 200,
            template: "<div class='lane lane0'></div>",
            $domElement: null
        },
        {
            count: 0,
            max: 3,
            width: 350,
            template: "<div class='lane lane1'></div>",
            $domElement: null
        },
        {
            count: 0,
            max: 4,
            width: 500,
            template: "<div class='lane lane2'></div>",
            $domElement: null
        }
    ];
};

Lanes.prototype.getEmptiestLaneIndex = function() {
    //select the emptiest lane
    var lane = -1;
    var min = 2.0;
    this.lanes.forEach(function(curr, index) {
        if ( curr.count < curr.max ) {
            min = curr.count/curr.max < min ? curr.count/curr.max : min;
            lane = index;
            /*console.log( "curr lane " + lane );*/
            /*console.log( "emptiest is " + min );*/
        }
    }, this);

    return lane;
};

Lanes.prototype.getLaneSlots = function() {
    var laneSlots = [];
    this.lanes.forEach(function(curr, index){
        for (var i = 0; i < curr.max; i++) {
            laneSlots.push(index);
        }
    }, this);

    console.log( JSON.stringify(laneSlots ));

    return laneSlots;
};

Lanes.prototype.increment = function(laneIndex) {
    this.lanes[laneIndex].count++;
};
Lanes.prototype.decrement = function(laneIndex) {
    this.lanes[laneIndex].count--;
};

Lanes.prototype.appendToHtml = function() {
    var $container = $('#lanes');
    this.lanes.forEach(function(lane){
        lane.$domElement = $(lane.template);
        $container.append(lane.$domElement);
    }, this);
};

Lanes.prototype.appendToLane = function(animalDomElement, laneIndex) {
    /*console.log( "__ ["+laneIndex+"] #"+$(animalDomElement).attr("data-uid")+" -- appendToLane ?" );*/
    if (void 0 === laneIndex) {
        //debugger;
        laneIndex = this.getEmptiestLaneIndex();
    }
    if (laneIndex == -1) debugger;
    this.lanes[laneIndex].$domElement.append(animalDomElement);
    this.increment(laneIndex);
    /*console.log( "__ ["+laneIndex+"] #"+$(animalDomElement).attr("data-uid")+" -- appendToLane !" );*/
    return laneIndex;

};

Lanes.prototype.removeFromLane = function(animalUid, laneIndex) {
    $(".lane"+laneIndex).find('[data-uid='+animalUid+']').remove();
    console.log( "lets remove " + animalUid + "from lane " + laneIndex);
    this.decrement(laneIndex);
};

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
];

var animalsConfig = [
    {
        name: "rhinoceros",
        counter: 0,
        population: 10,
        health: 3,
        speed: 3,
        color: "yellow",
        assets: {
            moving: [],
            death: ['dead rhino'],
            sounds: []
        }
    },
    {
        name: "rambo",
        counter: 0,
        population: 2,
        health: 1,
        speed: 1,
        color: "blue",
        assets: {
            moving: [],
            death: ['dead rambo'],
            sounds: []
        }
    },
    {
        name: "lion",
        counter: 0,
        population: 2,
        health: 1,
        speed: 10,
        color: "red",
        assets: {
            moving: [],
            death: ['dead rambo'],
            sounds: []
        }
    }
];




//@todo: removeFromLane
//@todo: removeFromAnimals
//@todo: parent collection for click with weapon and time and score ?

