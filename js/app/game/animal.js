
/*
    Animal
        healt
        name
        color
        uid
        posX
        posY
        maxQ
        lane
        instances -> gotoCollection
        ._onDeath
        ._onBirth

    .init
    .getInstance -> ?
    .create
    .createAll
    .getDomElement
    .getHit
    .decrementHealth
    .die
    .getHtmlElement
    .bindElementEvents
    .draw -> goto Collection




 */

//abstract model
var Animal = function(options) {
    var defaultOptions = {
        health : 1,
        name: "default",
        color : "grey"
    }
    options = ( void 0 === options ? options : defaultOptions );

    //counter
    Animal.numInstance = ( Animal.numInstance || 0 ) + 1;
    this.uid = Animal.numInstance;

    // global species options
    this.health = options.health;
    this.name = options.name;
    this.color = options.color;
    this.maxQuantity = 1; //@todo: in collection ? in options ?

    this.posX = -1;
    this.posY = -1;

    this.lane = -1;

    this.instances = [];

    //create signals
    this._onDeath = new signals.Signal();
    this._onBirth = new signals.Signal();
}

Animal.prototype.init = function() {

}

Animal.prototype.getInstance = function() {
    var instance = Object.create(this);
    instance.prototype = Object.create(this.prototype);

    return instance;
}

Animal.prototype.create = function() {
    console.log( "new animal" );
    var instance = {};
    instance.health = this.health;
    instance.name = this.name;
    instance.color = this.color;
    instance.posX = this.posX;
    instance.posY = this.posY;
    instance.lane = this.lane;
    instance.domElem = this.getDomElement();

    //save instance reference
    this.instances.push( instance );

    //notify the birth of an animal (for the view)
    this._onBirth.dispatch(instance);
}

//iterate through conf file to spawn all units necessary
Animal.prototype.createAll = function() {
    for ( var i = 0; i < this.maxQuantity; i++ ) {
        this.create();
    }
}

Animal.prototype.getDomElement = function() {
    return this.getHtmlElement();
}

Animal.prototype.getHit = function() {
    this.decrementHealth();
    console.log( "got hit" );
}

Animal.prototype.decrementHealth = function(hit) {
    if ( typeof hit !== "number" ) hit = 1;
    this.health = this.health - hit;
    //if 0 health, then DIE
    if ( this.health < 1 ) this.die();
}

Animal.prototype.die = function() {
    console.log( "oups a "+ this.name +" is dead !" );
    this._onDeath.dispatch(this);
}

//returns an html element representing an animal;
//@todo: use real template
Animal.prototype.getHtmlElement = function() {
    var domElem = document.createElement('div');
    domElem.setAttribute('class', 'animal');
    domElem.style.backgroundColor = color();
    return domElem;
}

Animal.prototype.bindElementEvents = function() {
    $(this.domElement).bind('click', this.getHit.bind(this));
}

//spawn the animal
//@todo: real draw ?
Animal.prototype.draw = function(animal) {
    var domElem = this.domElem();
    domElem.setAttribute("data-animal_uid", animal.uid);
    //bind events
    this.bindDomElemEvents(domElem, animal);

    //append elem to the game
    $(this.gameContainer).append(domElem);

    console.log( "draw !" );
}



var animalsConfig = [
    {
        name: "rhinoceros",
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



//lol
function color(){
    return colors[Math.floor(Math.random()*colors.length)];
}
var colors = ["lime","peachpuff","tan","lightslategray","dimgray","deeppink","wheat","limegreen","silver","chartreuse","lightsalmon","darkslategray","fuchsia","lavender","darkcyan","lightcoral","dimgrey","midnightblue","lightslategrey","sienna","thistle","moccasin","darkblue","hotpink","white","greenyellow","darkseagreen","steelblue","black","magenta","honeydew","salmon","cornsilk","indianred","crimson","green","lightblue","lavenderblush","palegreen","teal","red","rebeccapurple","darkturquoise","mediumblue","goldenrod","grey","cadetblue","darkorange","lightpink","maroon","indigo","mediumspringgreen","blanchedalmond","papayawhip","peru","lawngreen","mediumaquamarine","darkgray","darkslategrey","powderblue","beige","antiquewhite","lightseagreen","orange","slateblue","lightsteelblue","azure","lightgray","khaki","orangered","lightskyblue","purple","saddlebrown","paleturquoise","olive","mediumturquoise","seashell","mintcream","mistyrose","firebrick","palevioletred","lightcyan","mediumpurple","oldlace","dodgerblue","seagreen","darkgreen","linen","darkorchid","pink","turquoise","lightgoldenrodyellow","plum","darkgrey","darkolivegreen","cyan","chocolate","darksalmon","brown","orchid","mediumorchid","navajowhite","blueviolet","ghostwhite","springgreen","slategray","yellowgreen","aqua","ivory","lightgreen","darkgoldenrod","mediumvioletred","slategrey","lightyellow","cornflowerblue","aliceblue","violet","darkred","olivedrab","royalblue","darkslateblue","lemonchiffon","tomato","forestgreen","snow","gray","mediumslateblue","aquamarine","burlywood","whitesmoke","darkkhaki","yellow","palegoldenrod","bisque","navy","deepskyblue","gainsboro","gold","coral","darkviolet","sandybrown","darkmagenta","skyblue","blue","mediumseagreen","rosybrown","lightgrey","floralwhite"];