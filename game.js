// Plane oject. There is only one of these, so no need for psuedo-class.
var plane = {x: 180, y: 100, speed: 4, img: new Image()};
plane.img.src = 'bird.png';

// 
var Building = Class.extend({
  init: function(){
    this.x = 400;
    this.height = roundTo(randomNumber(80, 180), 10);
    this.width = roundTo(randomNumber(60, 100), 10);
    this.y = 200 - this.height;
    this.color = 'grey';
  }
});

var Missle = Class.extend({
	init: function() {
		this.x = plane.x;
		this.y = plane.y + 20;
		this.stopped = false;
		this.img = new Image();
		this.img.src = 'missle.png';
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
var FPS = 30;

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
	canvas.width = 400;
	canvas.height = 200;
	ctx = canvas.getContext('2d');
	ctx.fillStyle = '#7CE8E8';
	plane.img.onLoad = animate();

	// WASD Controls
	// I will change this so that once the keydown is fired, movement continues until keyup.
	body.onkeydown = function(event) {
		kk = event.keyCode;

		if (kk == 38) { // 'A' is pressed
			plane.y -= plane.speed;
		};
		if (kk == 40) { // 'S'
			plane.y += plane.speed;
		};
		if (kk == 37) { //'W' is pressed
			plane.x -= plane.speed;
		};
		if (kk == 39) { // 'D' is pressed
			plane.x += plane.speed;
		};
		if (kk == 32) { // 'SPACEBAR' is pressed
			missles.push(new Missle());
		};
	};
};


var explode = function(building, missle) {
	var explosion = new Explosion;
	explosions.push(explosion);
	explosion.y = missle.y;
	explosion.x = building.x;

};
var draw = function() {
	ctx.clearRect(0,0,400,200);
	ctx.fillStyle = '#87F3FF';
	ctx.fillRect(0,0,400,200);
	// draw buildings
	if (randomNumber(1,FPS*2) == 2) {
		buildings.push(new Building());
	}

	for (var i = 0; i < buildings.length; i++) {
		var building = buildings[i];
		ctx.fillStyle = building.color;
		ctx.fillRect(building.x, building.y, building.width, building.height);
		building.x -=SPEED;
		/* collision detection: three conditions must evaluate true
		1. the front of the plane is forward further than the back of the building
		2. the bottom of the bird is below the top of the building
		3. the back of the bird is further right than the back of the building 
		*/
		if ((plane.x + plane.img.width > building.x) && (plane.y + plane.img.height > building.y) && (building.x + building.width > plane.x)) {
			console.log('crash');
		};
		// get rid of invisible buildings
		if (building.x < building.width*(-1)) {
			buildings.shift();
		};		
	};
	// draw plane
	ctx.drawImage(plane.img, plane.x ,plane.y);

	// draw missles

	for (var i = 0; i < missles.length; i++) {
		var missle = missles[i];
		if(missle.stopped === false) {
			missle.x *= 1.1;
			}
		ctx.drawImage(missle.img, missle.x ,missle.y);
		for (var j = 0; j < buildings.length; j++) {
			var building = buildings[j];
				if (missle.x > 400 || missle.x < 1) {
					destroy(missle, missles);
				}
			if ((missle.x + missle.img.width > building.x) && (plane.y + plane.img.height > building.y) && (building.x + building.width > plane.x)) {
				var index = missles.indexOf(missle);
				destroy(missle, missles);
				console.log('hit');
				explode(building, missle);
			}

		};
	};
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