var Player = function() {
    this.name = "";
}

Player.prototype.setName = function(name){
    this.name = name;
}

Player.prototype.hasName = function(){
    return ( this.name.length > 0 ) ? true : false;
}