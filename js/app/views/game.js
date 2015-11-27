// you lost ^___^
var Game = function(){

	this.id = 'game';

	View.apply(this, arguments);

	this.images = {
		'experience-background': 'img/home-bg.jpg'
	};

	this.animalCollective 	= new AnimalCollective();
	this.bloodSplatter 		= new BloodSplatter();
	this.speedBlur 			= null;
	this.soundPlayer 		= null;

};

Game.prototype = Object.create(View.prototype);

Game.prototype.bind = function() {
	View.prototype.bind.apply(this);
	this.animalCollective._onAnimalDeath.add(function(){ this.bloodSplatter.splash(20) }.bind(this) );
	this.animalCollective._onAnimalHit.add(  function(){ this.soundPlayer.play('gunshot')}.bind(this) );
	this.animalCollective._endOfGame.add( this.stopRequestAnimationFrames.bind(this) );
}

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

	console.log( "starting game" );

	this.speedBlur 			= new SpeedBlur();
	this.soundPlayer 		= new SoundPlayer();

	$('#game').click( function() { this.soundPlayer.play('gunshot'); }.bind(this) );

	this.animalCollective.init(animalsConfig, lanesConfig);
	this.animalCollective.populateLanes();
	this.animalCollective.draw();

	this.bloodSplatter.init();

}

Game.prototype.resize = function() {
	this.animalCollective.onResize();
	this.bloodSplatter.onResize();
}

Game.prototype.stopRequestAnimationFrames = function() {
	this.bloodSplatter.stop();

}
