var Trophy = function(){

    this.id = 'trophy';

    View.apply(this, arguments);

    this.images = {
        'experience-background': 'img/home-bg.jpg'
    };

};

Trophy.prototype = Object.create(View.prototype);

Trophy.prototype.animateIn = function() {

    View.prototype.animateIn.call(this);

    var self = this;

    if ( !this.loaded ) return;

    this.domElem.fadeIn(function(){
        self.onAnimateIn();
    });
    console.log("--View: Hello Trophy :-)");
};

Trophy.prototype.animateOut = function() {

    View.prototype.animateOut.call(this);

    var self = this;

    this.domElem.fadeOut(function(){
        self.onAnimateOut();
    });
    console.log("--View: Goodbye Trophy :-)");
};
