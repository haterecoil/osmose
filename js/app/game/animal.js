
/*
    Animal
        health
        name
        color/assets
        uid
        posX
        posY
        template
        _onDeath
        _onBirth

    .configure(conf) // sets fro mconf
    .setPosition
    .move(side)
    .getHit
    .die
    .bindElementEvents
    .setDomElement
    .getDomElement

    @todo:
    .nextFrame
    .deathAnimation

 */


var Animal = function() {
    //counter
    Animal.numInstance = ( Animal.numInstance || 0 ) + 1;
    this.uid = Animal.numInstance;

    //default conf
    this.health = 1;
    this.name = "default";
    this.color = " grey";

    this.posX = 0;
    this.posY = 0;

    this.side = -1;

    this.template = "<div></div>";
    this.domElement = null;

    this._onDeath = new signals.Signal();
}

Animal.prototype.configure = function(conf) {
    //set all but position
    if ( void 0 === conf ) return;
    this.health = conf.health;
    this.name = conf.name;
    this.color = conf.color;
    this.speed = conf.speed;
    console.log( JSON.stringify(conf) );
}

Animal.prototype.initView = function() {
    this.setPosition(0,0);
    this.setDomElement();
}

Animal.prototype.setPosition = function(posX, posY) {
    //set spawn position
    this.posX = 0;
    this.posY = 0; //maybe Y is defined by css ?
}

Animal.prototype.move = function(plusOrMinus) {
    //move to the left or to the right
    this.posX = this.posX + this.side*this.speed;
    this.domElement.css({"transform": "translateX("+ this.posX +"px)"});
}
Animal.prototype.goRight = function() {
    this.side = 1
}
Animal.prototype.goLeft = function() {
    this.side = -1;
}

Animal.prototype.getHit = function() {
    //what happens when animal gets hit ?
    this.decrementHealth();
    console.log( "animal n°"+ this.uid +" got hit" );
}

Animal.prototype.decrementHealth = function(hit) {
    if ( typeof hit !== "number" ) hit = 1;
    this.health = this.health - hit;
    //if 0 health, then DIE
    if ( this.health < 1 ) this.die();
}

Animal.prototype.die = function() {
    //when health is 0
    console.log( "oups a "+ this.name +" is dead !" );
    this._onDeath.dispatch(this.uid);
}

Animal.prototype.bindElementEvents = function() {
    //binds click events
    $(this.domElement).bind('click', this.getHit.bind(this));
}

Animal.prototype.setDomElement = function() {
    //create dom element from template
    this.domElement = $(this.template);
    this.domElement.addClass('animal');
    this.domElement.css( "background-color", this.color);
    this.domElement.attr( 'data-uid', this.uid);
    //trigger bindElementsEvents
    this.bindElementEvents();
}

Animal.prototype.getDomElement = function() {
    return this.domElement;
}

//lol
function color(){
    return colors[Math.floor(Math.random()*colors.length)];
}
var colors = ["lime","peachpuff","tan","lightslategray","dimgray","deeppink","wheat","limegreen","silver","chartreuse","lightsalmon","darkslategray","fuchsia","lavender","darkcyan","lightcoral","dimgrey","midnightblue","lightslategrey","sienna","thistle","moccasin","darkblue","hotpink","white","greenyellow","darkseagreen","steelblue","black","magenta","honeydew","salmon","cornsilk","indianred","crimson","green","lightblue","lavenderblush","palegreen","teal","red","rebeccapurple","darkturquoise","mediumblue","goldenrod","grey","cadetblue","darkorange","lightpink","maroon","indigo","mediumspringgreen","blanchedalmond","papayawhip","peru","lawngreen","mediumaquamarine","darkgray","darkslategrey","powderblue","beige","antiquewhite","lightseagreen","orange","slateblue","lightsteelblue","azure","lightgray","khaki","orangered","lightskyblue","purple","saddlebrown","paleturquoise","olive","mediumturquoise","seashell","mintcream","mistyrose","firebrick","palevioletred","lightcyan","mediumpurple","oldlace","dodgerblue","seagreen","darkgreen","linen","darkorchid","pink","turquoise","lightgoldenrodyellow","plum","darkgrey","darkolivegreen","cyan","chocolate","darksalmon","brown","orchid","mediumorchid","navajowhite","blueviolet","ghostwhite","springgreen","slategray","yellowgreen","aqua","ivory","lightgreen","darkgoldenrod","mediumvioletred","slategrey","lightyellow","cornflowerblue","aliceblue","violet","darkred","olivedrab","royalblue","darkslateblue","lemonchiffon","tomato","forestgreen","snow","gray","mediumslateblue","aquamarine","burlywood","whitesmoke","darkkhaki","yellow","palegoldenrod","bisque","navy","deepskyblue","gainsboro","gold","coral","darkviolet","sandybrown","darkmagenta","skyblue","blue","mediumseagreen","rosybrown","lightgrey","floralwhite"];