
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

    .configure()
    .initView()
    .tweenInit()
    .move()
    .goRight()
    .goLeft()
    .getHit()
    .decrementHealth()
    .die()
    .bindElementEvents()
    .setDomElement()
    .getDomElement()

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
    this.name   = "default";
    this.color  = "grey";

    this.posX = 0;

    this.side = -1;

    this.domElement = null;

    this._onDeath   = new signals.Signal();
    this._onHit     = new signals.Signal();

    this.assets = {};

}

Animal.prototype.configure = function(conf) {
    //set all but position
    if ( void 0 === conf ) return;
    this.health = conf.health;
    this.name   = conf.name;
    this.color  = conf.color;
    this.speed  = conf.speed;
    this.assets = conf.assets;
}

Animal.prototype.initView = function() {
    //this.tweenInit();

    this.setDomElement();
}

Animal.prototype.move = function(plusOrMinus) {
    //move to the left or to the right
    this.posX = this.posX + this.side*this.speed;
    this.domElement.css({"transform": "translate("+ this.posX +"px) rotateY("+(this.side-1)*90+"deg)"});
}
Animal.prototype.goRight = function() {
    this.side = 1;
}
Animal.prototype.goLeft = function() {
    this.side = -1;
}

Animal.prototype.getHit = function() {
    //what happens when animal gets hit ?
    this.decrementHealth();
    this._onHit.dispatch();
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
    $(this.domElement).find('object').load(function(e){
        var path = $(e.target.getSVGDocument()).find('path');
        path.bind('click', this.getHit.bind(this));
        $(e.target.getSVGDocument()).find('svg').css('cursor', 'url(/img/cursor.png) 16 16, default');
    }.bind(this))
    $(this.domElement).find("path").bind('click', this.getHit.bind(this));
}

Animal.prototype.setDomElement = function() {

    //get template
    var templateData = {
        svgPath : this.assets['moving'].svgPath,
        animalName: this.name,
        animalUid: this.uid
    }
    var template = window.templates[ 'animal' ]( templateData );
    this.domElement = $(template);
    this.domElement.attr( 'data-uid', this.uid);

    this.bindElementEvents();
}

Animal.prototype.getDomElement = function() {
    return this.domElement;
}