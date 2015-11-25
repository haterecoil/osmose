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

	self.webcam.bindLetsGo();

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
    this.container 	= ".webcam-container";
    this.videoObj	= { "video": true};
    this.screenshot; // Final picture
    this.video; // Webcam video
    this.canvas; // Canvas print the screenshot
}

//Click on let's go, launh webcam phase
Webcam.prototype.bindLetsGo = function(){
	$('.phase2 a').bind('click', function(){
		$('.profil-picture').css('display', 'block');
	});

	this.bindCallWebcam();
	this.bindChooseImg();
};

// Add balise video in HTML
Webcam.prototype.appendVideoToHtml = function(){

	$(this.container).append(document.createElement('video'));
	$(this.container).append('<div class="filter"></div>')
	this.video = $(this.container+' '+'video');
};

// Add balise canvas in HTML
Webcam.prototype.appendCanvasToHtml = function(){
	var $canvas = $(document.createElement('canvas')).attr({width:"640px", height:"480px"});
	$(this.container).append($canvas);
	this.canvas =   $(this.container+' '+'canvas');;
};

// If error some button disapear
Webcam.prototype.onError = function(){
	$('.call-webcam').css('display', 'block');
	$('.take-picture').css('display', 'none');
	$(this.container).css('display', 'none');
};

 // Put video listeners into place
Webcam.prototype.showWebcam = function(){
	
	// Manage button
	$('.call-webcam').css('display', 'none');
	$('.take-picture').css('display', 'block');
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

  	this.bindTakeScreenshot();
};

// Call the webcam when event click
Webcam.prototype.bindCallWebcam = function(){
	this.appendVideoToHtml();
	$('.call-webcam').bind('click', this.showWebcam.bind(this));
};

// Event to take a a screenshot
Webcam.prototype.bindTakeScreenshot= function(){
	$('.take-picture').bind('click', this.canvasScreenshot.bind(this));
};

// Create a canvas and print the screenshot
Webcam.prototype.canvasScreenshot = function(){
	this.appendCanvasToHtml();
	var canvas = this.canvas
    var context = canvas[0].getContext("2d");
	context.drawImage(this.video[0], 0, 0, 640, 480);

	this.bindChooseCanvas();
};

// Event to choose canvas as profil picture
Webcam.prototype.bindChooseCanvas = function(){
	$(this.canvas).bind('click', this.canvasAsProfil.bind(this));
};

// Screenshot is officialy the canvas
Webcam.prototype.canvasAsProfil = function(){
	var canvas = this.canvas;
	this.screenshot = canvas[0].toDataURL();
	console.log(this.screenshot);
	
	$('.validate').css('display', 'block');
	this.bindChooseNo();
};

// Event to choose img as profil picture
Webcam.prototype.bindChooseImg = function(){
	$('img').bind('click', this.imgAsProfil.bind(this));
};

// Screenshot is officialy the img
Webcam.prototype.imgAsProfil = function(e){
	this.screenshot = $(e.toElement).attr('src');
	console.log(this.screenshot);
	
	$('.validate').css('display', 'block');
	this.bindChooseNo();
};

// If choose NO on validate
Webcam.prototype.bindChooseNo = function(){
	$('.validate .pop .no').bind('click', function(){
		$('.validate').css('display', 'none');
	});
}

