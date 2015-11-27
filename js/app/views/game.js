// you lost ^___^
var Game = function(){

	this.id = 'game';

	View.apply(this, arguments);

	this.images = {
		'experience-background': 'img/home-bg.jpg'
	};

	this._saveProfilePicture = new signals.Signal();
	this._saveProfilePicture.add( function(userPicture){
		debugger;
		this.images['userPicture'] = userPicture;
	});

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
	this.animalCollective._endOfGame.add( this.endOfGame.bind(this) );
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

Game.prototype.setProfilePicture = function(userPicture) {
	this.images['userPicture'] = userPicture;
}

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

//i'm afraid it's ugly
//fade out the game and show "are you proud ?"
//then shows the next page
Game.prototype.endOfGame = function() {

	setTimeout(function(){
		this.stopRequestAnimationFrames();
		var $div = $(document.createElement('div'));
		$div.addClass('the_end');

		$('#game').find('canvas').next().append($div);
		$div.fadeIn(5000, function(){
			$('#game').find('canvas').next().nextAll().remove();
			var p = document.createElement('p');
			$(p).addClass('end-text');
			$('#game').prepend(p);
			drawLetters(sentence, p, 0);
			setTimeout(function(){
				setTimeout(function(){
					var $div = $(document.createElement('div'));
					$div.addClass('user-picture')
					var $img = $(document.createElement('img'));
					$img.attr('src', this.images['userPicture'] || "/img/not-proud.png");
					$img.addClass('user-picture--img');
					$($div).append($img);
					var $img = $(document.createElement('img'));
					$img.attr('src', "/img/trophy.png");
					$img.addClass('user-picture--mask');
					$($div).append($img);

					$('#game').prepend($div);

					setTimeout(function(){
						$div.fadeOut(550, function(){
							var p = document.createElement('p');
							$(p).addClass('end-text');
							$('#game').prepend(p);
							$(p).text('#BIGFIVE, never again. Help us.').fadeIn(1000, function(){
								$(p).fadeOut(1000, function(){
									this.animateOut();
								}.bind(this))
							}.bind(this))
						}.bind(this))
					}.bind(this));
				}.bind(this), 1000);
				$(p).fadeOut(1000);
			}.bind(this), 4500);
		}.bind(this));
	}.bind(this), 2000);

	var sentence = "Are you proud of you ?";
	function drawLetters(sentence, container, index){
		if ( sentence.length <= index ) return;
		$(container).text($(container).text() + sentence[index]);
		setTimeout(function(){
			drawLetters(sentence, container, index+1);
		}, 75);

	}

}

Game.prototype.stopRequestAnimationFrames = function() {
	this.bloodSplatter.stop();
}
