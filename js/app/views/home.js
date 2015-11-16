var Home = function(){

	this.id = 'home';

	View.apply(this, arguments);

	this.images = {
		'home-background': 'img/home-bg.jpg'
	};

};

Home.prototype = Object.create(View.prototype);

Home.prototype.bind = function(){
	View.prototype.bind.call(this);

	//nxt level btn
	$('.next_view').bind('click.'+this.eventSuffix, this.gotoNextView);

}

Home.prototype.animateIn = function() {
	View.prototype.animateIn.call(this);

	var self = this;

	if ( !this.loaded ) return;

	this.domElem.fadeIn(function(){
		self.onAnimateIn();
	});

	console.log("--View: Hello Home :-)");
};

Home.prototype.animateOut = function() {
	View.prototype.animateOut.call(this);


	var self = this;

	this.domElem.fadeOut(function(){
		self.onAnimateOut();
	});

	console.log("--View: Goodbye Home :-)");

};

Home.prototype.gotoNextView= function(){
	if ( ! nameProvided() ) return;

	app.router.navigate( '/game' );

}

function nameProvided(){
	return ( $('#home #player-name').val().length > 0 ) ? true : false;
}