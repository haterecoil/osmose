/**
 * Backbone like
 * M VC
 *
 *  A Model is a smart row of data
 *  A Collection is a smart table of rows
 *  A View is an atomic part of the interface
 *
 **/

/*

    Staline.js

 */

var Staline = function() {

}

var Quack = function() {
    this.id = "abc";
}

Quack.prototype.doit = function() {
    console.log( "quack :o" );
}

var BlueDuck = function(){
    this.abstract = new Quack();
}

BlueDuck.prototype.doit = function() {
    this.abstract.doit();
    console.log( "blue quack :-)" );
}


var duck = new BlueDuck();

console.log( duck.abc );





