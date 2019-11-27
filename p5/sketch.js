var touches;
var fail = false;
var startColor, newColor;
let palette;

function setup() {
	createCanvas(windowWidth, windowHeight);
	setupOsc(12000, 3334);
	background(255);
	palette = [color(0, 126, 255, 100), color(213, 4, 217, 100), color(242, 105, 56, 100), color(85, 0, 194, 100),
	color(125, 122, 191, 100), color(160, 194, 30, 100), color(122, 245, 200, 100), color(20, 126, 255, 100),
	color(255, 4, 217, 100), color(242, 100, 30, 100), color(75, 0, 150, 100), color(130, 122, 120, 100),
	color(180, 194, 30, 100), color(140, 245, 200, 100), color(90, 126, 255, 100), color(213, 145, 217, 100),
	color(242, 15, 50, 100), color(85, 30, 194, 100), color(125, 100, 191, 100), color(130, 194, 30, 100),
	color(122, 245, 210, 100), color(10, 126, 255, 100), color(255, 4, 200, 100), color(220, 100, 30, 100),
	color(80, 5, 150, 100), color(130, 100, 120, 100), color(180, 170, 30, 100), color(140, 245, 190, 100),
	color(70, 180, 255, 100), color(200, 4, 217, 100), color(230, 105, 56, 100), color(85, 0, 160, 100),];
}

function draw() {
	if (touches[0] == 1) {
		// one touched
	}
}

// FOR DEBUGGING
function keyTyped() {
	if (key === 'a') {
		one();
	}
	if (key === 's') {
		two();
	}
	if (key === 'd') {
		three();
	}
	if (key === 'f') {
		four();
	}
	if (key === 'g') {
		five();
	}

	if (key === 'c')
		clear();
}

function one() {
	push();
	noStroke();
	fill(palette[1]);
	let x = random(width);
	let y = random(height);
	ellipse(x, y, 20, 20);
	ellipse(x + random(20), y + random(20), 50, 50);
	ellipse(x - random(20), y - random(20), 30, 30);
	ellipse(x + random(20), y - random(20), 10, 10);
	ellipse(x - random(20), y + random(20), 20, 20);
	pop();
}

var angle = 0;
var r = 50;
var spin = 0.3;
var grow = spin * 20;
function two() {
	push();
	noStroke();
	fill(palette[2]);
	angle += spin;
	r = r + grow;
	// r = noise(angle) * 100;
	// Polar to Cartesian Transformation
	var x = cos(angle) * r;
	var y = sin(angle) * r;
	// translate(2, 2);
	//line(0, 0, x, y);
	ellipse(width/2+x, height/2+y, 100, 100);
	pop();
}

function three(){
	noStroke();
	fill(palette[3]);
	let x = random(width);
	let y = random(height);
	push();
	translate(x,y);
	rotate(random(2*PI));
	triangle(0, 0, x+30, y+50, x-30, y+50);
	pop();
}

function four(){
	push();
	noStroke();
	fill(palette[4]);
	let x = random(width);
	let y = random(height);
	translate(x,y);
	rotate(random(2*PI));
	rect(0,0,30,10,20);
	pop();
}

let i5 = 0;
let y5 = 300;
let x5;
function five(){
	push();
	noStroke();
	fill(palette[5]);
	if(x5>width){
		y5 = random(height);
		i5 = 0;
	}
	x5 = i5*30;
	ellipse( x5, y5 + sin(i5)*20.0, 26, 26);
	i5+=0.9;
	pop();
}

function receiveOsc(address, value) {
	console.log("received OSC: " + address + ", " + value);

	if (address == '/test') {
		x = value[0];
		y = value[1];
	}
	if (address == '/touch') {
		touches = value;
	}
}

function sendOsc(address, value) {
	socket.emit('message', [address].concat(value));
}

function setupOsc(oscPortIn, oscPortOut) {
	var socket = io.connect('http://127.0.0.1:8081', { port: 8081, rememberTransport: false });
	socket.on('connect', function () {
		socket.emit('config', {
			server: { port: oscPortIn, host: '127.0.0.1' },
			client: { port: oscPortOut, host: '127.0.0.1' }
		});
	});
	socket.on('message', function (msg) {
		if (msg[0] == '#bundle') {
			for (var i = 2; i < msg.length; i++) {
				receiveOsc(msg[i][0], msg[i].splice(1));
			}
		} else {
			receiveOsc(msg[0], msg.splice(1));
		}
	});
}
