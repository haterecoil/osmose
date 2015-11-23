/* Object Home */
var Home = function(){

	this.id = 'home';

	View.apply(this, arguments);

	this.images = {
		'home-background': 'img/home_background.jpg'
	};

	this.webcam = new Webcam();

};

Home.prototype = Object.create(View.prototype);

Home.prototype.animateIn = function() {
	
	View.prototype.animateIn.call(this);

	var self = this;

	if ( !this.loaded ) return;

	this.domElem.fadeIn(function(){
		self.onAnimateIn();


	self.webcam.bindCallWebcam();
	self.webcam.bindTakeScreenshot();

	});

	

};

Home.prototype.animateOut = function() {
	
	View.prototype.animateOut.call(this);

	var self = this;

	this.domElem.fadeOut(function(){
		self.onAnimateOut();
	});

};

/* Object Webcam */
var Webcam = function(){
	this.domElement	= "<video></video>";
    this.container 	= ".webcam-container";
    this.videoObj	= { "video": true};
    this.screenshot;
    this.video;
}

// Add balise video in HTML
Webcam.prototype.appendToHtml = function(){

	$(this.container).append($(this.domElement));
	this.video =  $(this.container+' '+'video');
};

Webcam.prototype.onError = function(){
	$(this.container).css('display', 'none');
};

 // Put video listeners into place
Webcam.prototype.showWebcam = function(){

	$(this.container).css('display', 'block');
	var self = this;

	if(navigator.getUserMedia) { // Standard
    	navigator.getUserMedia(this.videoObj, function(stream) {
     		self.video.attr('src', stream);
      		self.video.get(0).play();
    	}, this.onError.bind(this));
  	}

  	else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
    	navigator.webkitGetUserMedia(this.videoObj, function(stream){
      		self.video.attr('src', window.URL.createObjectURL(stream));
      		self.video.get(0).play();
    	}, this.onError.bind(this));
  	}

  	else if(navigator.mozGetUserMedia) { // Firefox-prefixed
   		navigator.mozGetUserMedia(this.videoObj, function(stream){
      		self.video.attr('src', stream);
      		self.video.get(0).play();
    	}, this.onError.bind(this));
  	}
};

// Call the webcam when event click
Webcam.prototype.bindCallWebcam = function(){
	this.appendToHtml();
	$('.call-webcam').bind('click', this.showWebcam.bind(this));
};

Webcam.prototype.bindTakeScreenshot= function(){
	$('.take-picture').bind('click', this.canvasScreenshot.bind(this));
};

Webcam.prototype.canvasScreenshot = function(){
	console.log(this.container);
	var canvas = $(this.container).find('canvas');
	//debugger;
    var context = canvas[0].getContext("2d");
    console.log('draw');
	context.drawImage(this.video[0], 0, 0, 640, 480);
};
