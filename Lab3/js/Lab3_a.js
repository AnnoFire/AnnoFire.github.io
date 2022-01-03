const {
	vec2,
	vec3,
	vec4,
} = glMatrix;

var gl;
var points = [];
var colors = [];
//
var direction=-1.0; 
var color = vec3.fromValues(0.5, 0.5, 1.0); 
var R, G, B; 
var angle=10;
var speed = 50; 
var theta = 0;
var thetaLoc;

var vertices = [
	vec2.fromValues(0, 1),
	vec2.fromValues(-1, 0),
	vec2.fromValues(1, 0),
	vec2.fromValues(0, -1)
];

function init() {
	var canvas = document.getElementById("Canvas");

	gl = WebGLUtils.setupWebGL(canvas);

	var a = vertices[0];
	var b = vertices[1];
	var c = vertices[2];
	var d = vertices[3];
	points = [];
	colors = [];
	Draw(a, b, c, d);
	// Configure WebGL
	gl.viewport(canvas.width / 4, canvas.height / 4, canvas.width / 2, canvas.height / 2);
	// gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(0.0, 0.0, 0.0, 0.0);

	// load shaders and initialize attribute buffers
	var program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	// load data into the gpu
	var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

	// associate external shader variables with data buffer 
	var vPosition = gl.getAttribLocation(program, 'vPosition');
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);
	//Color
	var cBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	//
	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);
	//
	thetaLoc = gl.getUniformLocation(program, "theta");

	render();
};

function Draw(a, b, c, d) {
	pushPoint(a);
	pushPoint(b);
	pushPoint(c);
	pushPoint(d);
	pushColor(color);
	pushColor(color);
	pushColor(color);
	pushColor(color);
}

function pushPoint(point) {
	points.push(point[0], point[1]);
}

function pushColor(color) {
	colors.push(color[0], color[1], color[2]);
}

function render() {
	getData();
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, points.length / 2);
	setTimeout( function(){ requestAnimFrame( render ); }, speed );
}

function getData() {
	var radian = angle / 180.0 * Math.PI;
	theta += direction * radian;
	if (theta > 2 * Math.PI)
		theta -= (2 * Math.PI);
	gl.uniform1f(thetaLoc, theta);
}

function main() {
	document.getElementById("Direction").onclick = function(event) {
		direction *= -1.0;
	}
	document.getElementById("Angle").onchange=function(event) {
		var tmp=event.target.value;
		if(tmp>=0 && tmp<=255) angle=event.target.value;
;
	}
	document.getElementById("Speed").onchange=function(event) {
		speed=101-event.target.value;
	}
	init();
}