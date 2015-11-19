/**
 * Backbone's inspired M VC
 *
 * This is an atomic view :
 *  - handling events on animals
 *  - watching changes on Animal through Herd
 *
**/

//Abstract specy view
var AnimalView = function(collection) {

    //@todo: set the properties in init ?
    this.domElem = this._getHtmlElement;
    this.collection = collection;

    //@todo: remove gameContainer ?
    this.gameContainer = document.getElementById('game');
}

//on init, set up the dom elem
AnimalView.prototype.init = function() {
    this.bindHerdEvents();
    this.collection.init();
    console.log( "view init" );
}

//bind user interactions to an Animal
AnimalView.prototype.bindHerdEvents = function() {
    this.collection._onAnimalBirth.add( this.onNewAnimal, this );
    this.collection._onAnimalDeath.add( this.onAnimalDeath, this );
    this.collection._onSpeciesDeath.add( this.onSpeciesAnnihilation, this );
}

//returns an html element representing an animal;
AnimalView.prototype._getHtmlElement = function() {
    var domElem = document.createElement('div');
    domElem.setAttribute('class', 'animal');
    domElem.style.backgroundColor = color();
    return domElem;
}

//when model notifies "new animal to spawn"
AnimalView.prototype.onNewAnimal = function(animal) {
    console.log( " new animal ! " );
    this.draw(animal);
}


//if animal got hit and the view must change
AnimalView.prototype.animalGotHit = function() {
    console.log( "animal got hit" );
}

//when model notifies "an animal is dead"
AnimalView.prototype.onAnimalDeath = function() {
    console.log( "animal death :o" );
}

//when model notifies "a species is dead"
AnimalView.prototype.onSpeciesAnnihilation = function() {

}

AnimalView.prototype.bindDomElemEvents = function(element, animal) {
    $(element).bind('click.animalView', this.collection.animalHit);
}

AnimalView.prototype.draw = function(animal) {
    var domElem = this.domElem();
    domElem.setAttribute("data-animal_uid", animal.uid);
    //bind events
    this.bindDomElemEvents(domElem, animal);

    //append elem to the game
    $(this.gameContainer).append(domElem);

    console.log( "draw !" );
}




/*


 */

