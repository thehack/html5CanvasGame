// Plane oject. There is only one of these, so no need for psuedo-class.
var plane = {
	x: 300,
	y: 300,
	speed: 5, 
	xDirection: 0, 
	yDirection: 0, 
//	img: new Image(), 
	width: 40, 
	height: 20, 
	color: '#1ed700'
};
// plane.img.src = 'bird.png';

// Classes for Game Objects.
var Building = Class.extend({
  init: function(){
    this.x = STAGE_WIDTH;
    this.height = roundTo(randomNumber(10, 160), 10);
    this.width = this.height;
    this.y = roundTo(randomNumber(0, (STAGE_HEIGHT - this.height)), 10);
    this.hits = 0;
    this.color = boxColors[randomNumber(0,3)];
  }
});

var Missle = Class.extend({
	init: function() {
		this.x = plane.x + 20;
		this.y = plane.y + 10;
		this.stopped = false;
		this.img = new Image();
		this.img.src = 'missle.png';
		this.height = 10;
		this.width = 10;
	}
});

var Explosion = Class.extend({
	init: function() {
		this.x = null;
		this.y = null;
		this.img = new Image();
		this.img.src = 'explosion.png';
		this.frame = 20;
	}
});

// Constants
var SPEED = 3; // rate at which plane normally moves past buildings.
var FPS = 33;
var BACKGROUND_COLOR = '#220035';
var STAGE_HEIGHT = 600;
var STAGE_WIDTH = 600;
var boxColors = ['rgb(215, 0, 127)', '#0096f9', '#f9d200', '#ff0000'];
var timeSinceLastBuilding = 0;
var buildings = [];
var missles = [];
var explosions = [];
var body, canvas, div, ctx;
var setup = function() {
	body = document.getElementById('body');
	canvas = document.createElement('canvas');
	div = document.createElement('div');
	body.appendChild(div);
	div.appendChild(canvas);
	canvas.id = 'canvas';
	canvas.width = STAGE_WIDTH;
	canvas.height = STAGE_HEIGHT;
	ctx = canvas.getContext('2d');
	ctx.fillStyle = '#7CE8E8';
	body.onLoad = animate();

	// ARROW KEYS for controls; 
	body.onkeydown = function(event) {
		var kk = event.keyCode;

		if (kk == 38) { // 'A' is pressed
			plane.yDirection = plane.speed*-1;
		};
		if (kk == 40) { // 'S'
			plane.yDirection = plane.speed;
		};
		if (kk == 37) { //'W' is pressed
			plane.xDirection = plane.speed*-1;
		};
		if (kk == 39) { // 'D' is pressed
			plane.xDirection = plane.speed;
		};
		if (kk == 32) { // 'SPACEBAR' is pressed
			missles.push(new Missle());
		};
	};
	body.onkeyup = function(event) {
		var ku = event.keyCode;
		if (ku == 38) { // 'A' is pressed
			plane.yDirection += plane.speed;
		}
		if (ku == 40) { // 'S'
			plane.yDirection -= plane.speed;
		}
		if (ku == 37) { //'W' is pressed
			plane.xDirection += plane.speed;
		}
		if (ku == 39) { // 'D' is pressed
			plane.xDirection -= plane.speed;
		}
	};
};


var explode = function(building, missle) {
	var explosion = new Explosion;
	explosions.push(explosion);
	explosion.y = missle.y;
	explosion.x = building.x;
	building.hits += 1;
	if(building.hits == 5) {
		destroy(building, buildings);
	}

};

// Everything on the canvas gets redrawn at the framerate (FPS)
var draw = function() {
	ctx.clearRect(0,0,STAGE_WIDTH,STAGE_HEIGHT);
	ctx.fillStyle = BACKGROUND_COLOR;
	ctx.fillRect(0,0,STAGE_HEIGHT,STAGE_WIDTH);
	// draw buildings
	if (randomNumber(1,FPS*2) == 2) {
		buildings.push(new Building());
	}

	for (var i = 0; i < buildings.length; i++) {
		var building = buildings[i];
		ctx.fillStyle = building.color;
		ctx.fillRect(building.x, building.y, building.width, building.height);
		building.x -=SPEED;
		
		// collision detection:
		if ((plane.x + plane.width > building.x) && (plane.y + plane.height > building.y) && (building.x + building.width > plane.x)) {
		}

		// get rid of invisible buildings
		if (building.x < building.width*(-1)) {
			buildings.shift();
		}
	};

	// draw plane
	ctx.fillStyle = plane.color;
	ctx.fillRect((plane.x += plane.xDirection), (plane.y += plane.yDirection), plane.width, plane.height);

	// draw missles
	for (var i = 0; i < missles.length; i++) {
		var missle = missles[i];
		if(missle.stopped === false) {
			missle.x *= 1.1;
			}
		ctx.fillStyle = 'white';
		ctx.fillRect(missle.x, missle.y, missle.width, missle.height);
		for (var j = 0; j < buildings.length; j++) {
			var building = buildings[j];

				// destroy off-screen missles
				if (missle.x > STAGE_WIDTH || missle.x < 1) {
					destroy(missle, missles);
				}
			// Still needs refined
			if ((missle.x + missle.img.width > building.x) && (plane.y + plane.height > building.y) && (building.x + building.width > plane.x) && (missle.y  < building.y + building.height)) {
				var index = missles.indexOf(missle);
				destroy(missle, missles);
				explode(building, missle);
			}
		};
	};

	// draw explosions
	for (var i = explosions.length - 1; i >= 0; i--) {
		explosion = explosions[i];
		explosion.x -= SPEED;
		ctx.drawImage(explosion.img,explosion.frame,0,20,20, explosion.x, explosion.y,20,20);
		explosion.frame += 20;
		if(explosion.frame > 400) {
			destroy(explosion, explosions);
		} 
	};
};

var animate = function() {
	setInterval(function() {
		draw();

	}, (1000/FPS));
};