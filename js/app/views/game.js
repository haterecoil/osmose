// you lost ^___^
var Game = function(){

	this.id = 'game';

	View.apply(this, arguments);

	this.images = {
		'experience-background': 'img/home-bg.jpg'
	};

};

Game.prototype = Object.create(View.prototype);

Game.prototype.animateIn = function() {
	
	View.prototype.animateIn.call(this);

	var self = this;

	if ( !this.loaded ) return;

	this.domElem.fadeIn(function(){
		self.onAnimateIn();
	});

	this.startGame();

	console.log("--View: Hello Game :-)");
};

Game.prototype.animateOut = function() {
	
	View.prototype.animateOut.call(this);

	var self = this;

	this.domElem.fadeOut(function(){
		self.onAnimateOut();
	});
	console.log("--View: Goodbye Game :-)");
};

Game.prototype.startGame = function() {
	/*var animalCollection = new AnimalCollection(),
			shootThemAll = new AnimalView(animalCollection);

	shootThemAll.init();*/

}