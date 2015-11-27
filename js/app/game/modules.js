/**
 * #BLOOD
 * @constructor
 */

var BloodSplatter = function() {

    this.focused = false;
    this.clicked = false;

    this.items = [];

    this.running = true;

    this.options = {
        scatter: 0.7,
        gravity: 0.2,
        consistency: 0.1,
        pollock: false,
        burst: true,
        shade: true
    }

    this.mouse = {
        x: 0,
        y: 0,
        dx: 0,
        dy: 0,
        px: 0,
        py: 0
    };
}

BloodSplatter.prototype.init = function() {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.shadow = document.createElement('canvas');
    this.sctx = this.shadow.getContext('2d');
    this.sctx.fillStyle = this.ctx.fillStyle = '#aa0707'; // rgba(250,0,0,0.1)'
    this.canvas.width = this.shadow.width = window.innerWidth;
    this.canvas.height = this.shadow.height = window.innerHeight;
}

BloodSplatter.prototype.onResize = function() {
    if (this.canvas !== undefined) {
        this.canvas.width = this.shadow.width = window.innerWidth;
        this.canvas.height = this.shadow.height = window.innerHeight;
    }
}

BloodSplatter.prototype.drawloop = function() {

    if (this.running)
        requestAnimationFrame(this.drawloop.bind(this));
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.drawsplat(this.items)
}


BloodSplatter.prototype.splat = function(x, y, arr) {

    for (var i = 0; i < 30; i++) {
        var s = Math.random() * Math.PI;
        var dirx = (((Math.random() < .5) ? 3 : -3) * (Math.random() * 3)) * this.options.scatter;
        var diry = (((Math.random() < .5) ? 3 : -3) * (Math.random() * 3)) * this.options.scatter;

        arr.push({
            x: x,
            y: y,
            dx: dirx + this.mouse.dx,
            dy: diry + this.mouse.dy,
            size: s
        })
    }
}

BloodSplatter.prototype.drawsplat = function(arr) {

    var i = arr.length
    while (i-- > 0) {
        var t = arr[i];
        var x = t.x,
            y = t.y,
            s = t.size;
        circle(x, y, s, this.ctx)

        t.dy -= this.options.gravity
        t.x -= t.dx
        t.y -= t.dy
        t.size -= 0.05;

        if (arr[i].size < 0.3 || Math.random() < this.options.consistency) {
            circle(x, y, s, this.sctx)
            arr.splice(i, 1)

        }

    }

    this.ctx.drawImage(this.shadow, 0, 0);
    //sctx.drawImage(shadow, 0, 0.5)

}

BloodSplatter.prototype.splash = function(count) {

    var widthTenth = this.canvas.width / 7,
        heightTenth = this.canvas.height / 7;
    var minW = Math.floor(Math.random()*this.canvas.width - widthTenth),
        maxW = minW + widthTenth,
        minH = Math.floor(Math.random()*this.canvas.height - heightTenth),
        maxH = minH + heightTenth;

    while (count > 0) {
        if (!this.focused) {
            this.focused = true;
            this.drawloop();
        } else {

            var redtone = 'rgb(' + (130 + (Math.random() * 105 | 0)) + ',0,0)';
            this.sctx.fillStyle = this.ctx.fillStyle = redtone;

            this.mouse.x = minW + Math.floor(Math.random()*maxW);
            this.mouse.y = minH + Math.floor(Math.random()*maxH);

            this.splat(this.mouse.x, this.mouse.y, this.items);
        }

        setTimeout(function(){
            this.clicked = false;
            this.mouse.dx = this.mouse.dy = 0;

        }.bind(this), 50)

        count--;
    }
}

BloodSplatter.prototype.stop = function() {
    this.running = false;
}

function circle(x, y, s, c) {

    c.beginPath()
    c.arc(x, y, s * 5, 0, 2 * Math.PI, false);
    c.fill()
    c.closePath()

}

/**
 * #BLUR
 * @constructor
 */


var SpeedBlur = function() {
    var timestamp = null;
    var lastMouseX = null;
    var lastMouseY = null;

    document.body.addEventListener("mousemove", function(e) {
        if (timestamp === null) {
            timestamp = Date.now();
            lastMouseX = e.screenX;
            lastMouseY = e.screenY;
            return;
        }

        var now = Date.now();
        var dt =  now - timestamp;
        var dx = e.screenX - lastMouseX;
        var dy = e.screenY - lastMouseY;
        var speedX = Math.round(dx / dt * 100);
        var speedY = Math.round(dy / dt * 100);

        timestamp = now;
        lastMouseX = e.screenX;
        lastMouseY = e.screenY;

        var final = Math.abs(speedX);
        final = final / 50;
        if (final > 7) final = 7;

        $('.background-cover').css({'-webkit-filter': 'blur('+Math.abs(final)+'px)'});
    });

    $('.background-cover').css({'transition': '1s all ease'});

    var timeout;
    $(document).on('mousemove', function (event) {
        if (timeout !== undefined) {
            window.clearTimeout(timeout);
        }
        timeout = window.setTimeout(function () {
            // trigger the new event on event.target, so that it can bubble appropriately

            $('.background-cover').css({'-webkit-filter': 'blur(0px)'});
        }, 100);

        var mouseTenth = event.clientX * 1 / window.innerWidth;
        var left = -5 + (mouseTenth*-1);

        TweenMax.to('.lane', 0.1, {left : left + "%"});
        TweenMax.to('.background-cover__img', 0.1, {left : left*0.9 + "%"});
        /*$('.lane').css({'left' : left + "%"});
        $('.background-cover__img').css({'left' : left*0.9 + "%"});*/
    });

    $('body').on('mousemove', function(e){
        /*var mouseTenth = e.clientX * 1 / window.innerWidth;
        var left = -5 + (mouseTenth*-1);
        $('.lane').css({'left' : left + "%"});
        $('.background-cover__img').css({'left' : left*0.9 + "%"});*/
    });
}

/**
 * #LANES
 * @returns {number}
 */
//@todo externalize everything
//@todo one template for lanes ?
var Lanes = function(lanesConfig) {
    this.lanes = lanesConfig;
};

Lanes.prototype.getEmptiestLaneIndex = function() {
    //select the emptiest lane
    var lane = -1;
    var min = 2.0;
    this.lanes.forEach(function(curr, index) {
        if ( curr.count < curr.max ) {
            min = curr.count/curr.max < min ? curr.count/curr.max : min;
            lane = index;
        }
    }, this);

    return lane;
};

Lanes.prototype.getLaneSlots = function() {
    var laneSlots = [];
    this.lanes.forEach(function(curr, index){
        for (var i = 0; i < curr.max; i++) {
            laneSlots.push(index);
        }
    }, this);

    console.log( JSON.stringify(laneSlots ));

    return laneSlots;
};

Lanes.prototype.increment = function(laneIndex) {
    this.lanes[laneIndex].count++;
};
Lanes.prototype.decrement = function(laneIndex) {
    this.lanes[laneIndex].count--;
};

Lanes.prototype.appendToHtml = function() {
    var $container = $('.background-cover');
    this.lanes.forEach(function(lane){
        var $template = $(lane.template);
        $container.append($template);
        lane.$domElement = $template;
        lane.width = $template.width();
    }, this);

    //$(window).resize( this.onResize.bind(this) );

};

Lanes.prototype.appendToLane = function(animalDomElement, laneIndex) {

    if (void 0 === laneIndex) {
        laneIndex = this.getEmptiestLaneIndex();
    }
    if (laneIndex == -1) debugger;

    this.lanes[laneIndex].$domElement.prepend(animalDomElement);
    this.increment(laneIndex);

    /*console.log( "__ ["+laneIndex+"] #"+$(animalDomElement).attr("data-uid")+" -- appendToLane !" );*/
    return laneIndex;

};

Lanes.prototype.removeFromLane = function(animalUid, laneIndex) {
    $(".lane"+laneIndex).find('[data-uid='+animalUid+']').remove();
    console.log( "lets remove " + animalUid + "from lane " + laneIndex);
    //debugger;
    this.decrement(laneIndex);
};

Lanes.prototype.onResize = function() {
    this.lanes.forEach(function(lane){
        lane.width = lane.$domElement.width();
    }, this);
}
/**
 * #SOUND
 * @constructor
 */
var SoundPlayer = function() {
    this.tracks = {
        'gunshot': {
            src: '/sounds/gunshot.mp3',
            audioElement: null
        }
    };

    this.init();
}
SoundPlayer.prototype.init = function() {
    for (var track in this.tracks) {
        var audioElement = document.createElement('audio');
        audioElement.volume = 1;
        audioElement.src = this.tracks[track].src;
        document.getElementById('game').appendChild(audioElement);
        audioElement.load();
        this.tracks[track].audioElement = audioElement;
    }
}

SoundPlayer.prototype.play = function(trackName) {
    this.tracks[trackName].audioElement.currentTime = 0;
    this.tracks[trackName].audioElement.play();
}

SoundPlayer.prototype.mute = function() {
    for (var track in this.tracks){
        this.tracks[track].audioElement.volume = 0;
    }
}

