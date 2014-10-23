// @todo: add colorpicker, adjust resizing to keep same brush smoothness, allow keys to be reassigned

var canvas = document.createElement("canvas");
canvas.style = 'position:absolute; top:0; left:0;';
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

var canvas2 = document.createElement("canvas");
canvas2.style = 'position:absolute; top:0; left:0;';
var ctx2 = canvas2.getContext("2d");
canvas2.width = window.innerWidth;
canvas2.height = window.innerHeight;
document.body.appendChild(canvas2);

//var colorInput = document.createElement("input");
//document.body.appendChild(colorInput);

var mouse = {
	x: 0,
	y: 0,
	active: false,
}

// set up pen
var pen = {
	x: canvas.width/2,
	y: canvas.height/2,
	width: 32,
	down: false,
	speed: .1,
	color: '000000',
}

// handle keyboard
var keysDown = {};

addEventListener("keydown", function(e) {
	console.log("pressed: "+e.keyCode);
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function(e) {
	delete keysDown[e.keyCode];
}, false);

addEventListener("mousedown", function(e) {
	pen.down = (mouse.active)? true : pen.down
}, false);

addEventListener("mouseup", function(e) {
	pen.down = (mouse.active)? false : pen.down
}, false);

addEventListener("mousemove", function(e) {
	mouse.x = e.clientX;
	mouse.y = e.clientY;
}, false);

var update = function (delta) {
	if (38 in keysDown) { //up
		pen.y -= pen.speed * delta;
	}
	if (40 in keysDown) { //down
		pen.y += pen.speed * delta;
	}
	if (37 in keysDown) { //left
		pen.x -= pen.speed * delta;
	}
	if (39 in keysDown) { //right
		pen.x += pen.speed * delta;
	}
	if (32 in keysDown) { //space
		pen.down = (pen.down)? false : true ;
		delete keysDown[32];
	}
	if (107 in keysDown) { //plus
		pen.width += pen.speed * delta;
	}
	if (109 in keysDown) { //minus
		pen.width -= pen.speed * delta;
		pen.width = (pen.width < 2)? 2 : pen.width;
	}
	if (84 in keysDown) { //t for toggle mouse
		pen.down = (mouse.active)? false : pen.down
		mouse.active = (mouse.active)? false : true;
		delete keysDown[84];
	}
	if (mouse.active) {
		pen.x = mouse.x - pen.width/2;
		pen.y = mouse.y - pen.width/2;
	}
	if (27 in keysDown) { //clear
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}
	if (13 in keysDown) { //save
		saveImage();
		delete keysDown[13];
	}
}

var render = function () {
	//var style = "#"+pen.color;
	var style = ctx2.createRadialGradient(pen.x+pen.width/2, pen.y+pen.width/2, 0, pen.x+pen.width/2, pen.y+pen.width/2, pen.width/2);
	style.addColorStop(0, 'rgba(0,0,0,1)');
	style.addColorStop(.8, 'rgba(0,0,0,.9)');
	style.addColorStop(1, 'rgba(0,0,0,0)');
	
	ctx2.clearRect(0, 0, canvas.width, canvas.height);
	ctx2.fillStyle = style;
	ctx2.fillRect(pen.x-pen.width, pen.y-pen.width, pen.width*2, pen.width*2);
	if (pen.down) {
		ctx.fillStyle = style;
		ctx.fillRect(pen.x, pen.y, pen.width, pen.width);
	}
}

var saveImage = function () {
	var img = document.createElement("img");
	img.src = canvas.toDataURL("image/png");
	document.body.appendChild(img);
	document.body.removeChild(canvas);
	document.body.removeChild(canvas2);
	cancelAnimationFrame(animationFrame);
}

var main = function () {
	var now = Date.now();
	var delta = now - then;
	
	update(delta);
	render();
	
	then = now;
	var animationFrame = requestAnimationFrame(main);
}

var then = Date.now();
main();
