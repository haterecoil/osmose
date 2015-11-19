
//abstract model
var Animal = function() {
    this.health = 1;
    this.name = "animal";
    this.color = "";

    Animal.numInstance = ( Animal.numInstance || 0 ) + 1;
    this.uid = Animal.numInstance;

    this._onDeath = new signals.Signal();
    //this._onBirth = new signals.Signal();
}

Animal.prototype.init = function() {

}

Animal.prototype.getInstance = function() {
    var instance = Object.create(this);
    instance.prototype = Object.create(this.prototype);

    return instance;
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


//species classes
var Zebra = function() {
    Animal.apply(this, arguments);
    this.name = "zebra";
    this.health = 2;
    this.color = color();
}
Zebra.prototype = Object.create(Animal.prototype);

var Rhino = function() {
    Animal.apply(this, arguments);
    this.name = "rhino";
    this.health = 5;
    this.color = color();
}
Rhino.prototype = Object.create(Animal.prototype);

//lol
function color(){
    return colors[Math.floor(Math.random()*colors.length)];
}
var colors = ["lime","peachpuff","tan","lightslategray","dimgray","deeppink","wheat","limegreen","silver","chartreuse","lightsalmon","darkslategray","fuchsia","lavender","darkcyan","lightcoral","dimgrey","midnightblue","lightslategrey","sienna","thistle","moccasin","darkblue","hotpink","white","greenyellow","darkseagreen","steelblue","black","magenta","honeydew","salmon","cornsilk","indianred","crimson","green","lightblue","lavenderblush","palegreen","teal","red","rebeccapurple","darkturquoise","mediumblue","goldenrod","grey","cadetblue","darkorange","lightpink","maroon","indigo","mediumspringgreen","blanchedalmond","papayawhip","peru","lawngreen","mediumaquamarine","darkgray","darkslategrey","powderblue","beige","antiquewhite","lightseagreen","orange","slateblue","lightsteelblue","azure","lightgray","khaki","orangered","lightskyblue","purple","saddlebrown","paleturquoise","olive","mediumturquoise","seashell","mintcream","mistyrose","firebrick","palevioletred","lightcyan","mediumpurple","oldlace","dodgerblue","seagreen","darkgreen","linen","darkorchid","pink","turquoise","lightgoldenrodyellow","plum","darkgrey","darkolivegreen","cyan","chocolate","darksalmon","brown","orchid","mediumorchid","navajowhite","blueviolet","ghostwhite","springgreen","slategray","yellowgreen","aqua","ivory","lightgreen","darkgoldenrod","mediumvioletred","slategrey","lightyellow","cornflowerblue","aliceblue","violet","darkred","olivedrab","royalblue","darkslateblue","lemonchiffon","tomato","forestgreen","snow","gray","mediumslateblue","aquamarine","burlywood","whitesmoke","darkkhaki","yellow","palegoldenrod","bisque","navy","deepskyblue","gainsboro","gold","coral","darkviolet","sandybrown","darkmagenta","skyblue","blue","mediumseagreen","rosybrown","lightgrey","floralwhite"];