var Experience = function(){

	this.id = 'experience';

	View.apply(this, arguments);

	this.images = {
		'experience-background': 'img/home-bg.jpg'
	};

};

Experience.prototype = Object.create(View.prototype);

Experience.prototype.animateIn = function() {
	
	View.prototype.animateIn.call(this);

	var self = this;

	if ( !this.loaded ) return;

	this.domElem.fadeIn(function(){
		self.onAnimateIn();
	});
	console.log("--View: Hello Experience :-)");
};

Experience.prototype.animateOut = function() {
	
	View.prototype.animateOut.call(this);

	var self = this;

	this.domElem.fadeOut(function(){
		self.onAnimateOut();
	});
	console.log("--View: Goodbye Experience :-)");
};

/*
	How to customize parent's prototype ?

	CurrentClass.prototype.methodToCustomize = function() {
	  // 1.
	  // first, call the parent's function so it is executed
	  //  "call(this)" is necessary so the function is executed
	  //  with the current object properties
	  ParentClass.prototype.methodToCustomize.call(this);

	  //every other actions below are custom :-)
	  doThis();
	  doSomething();
	  this.yolo = true;

	}

 */
