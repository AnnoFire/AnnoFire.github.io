const {
	vec2,
	vec3,
	vec4
} = glMatrix;

var canvas;
var gl;

var points = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [0, 0, 0];
var thetaLoc;

var offset=vec3.fromValues(0,  0, 0);
var offsetLoc;

window.onload = function initCube() {
	canvas = document.getElementById("Canvas");

	gl = WebGLUtils.setupWebGL(canvas);

	makeCube();

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(0.0, 0.0, 0.0, 0.0);

	gl.enable(gl.DEPTH_TEST);

	var program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	var cBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);

	var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);
	thetaLoc = gl.getUniformLocation(program, "theta");
	gl.uniform3fv(thetaLoc, theta);
	//
	offsetLoc = gl.getUniformLocation(program, "offset");
	gl.uniform3fv(offsetLoc, offset);

	addEvent();

	render();
}

function makeCube() {

	var vertices = [
		vec4.fromValues(-0.5, -0.5, 0.5, 1.0),
		vec4.fromValues(-0.5, 0.5, 0.5, 1.0),
		vec4.fromValues(0.5, 0.5, 0.5, 1.0),
		vec4.fromValues(0.5, -0.5, 0.5, 1.0),
		vec4.fromValues(-0.5, -0.5, -0.5, 1.0),
		vec4.fromValues(-0.5, 0.5, -0.5, 1.0),
		vec4.fromValues(0.5, 0.5, -0.5, 1.0),
		vec4.fromValues(0.5, -0.5, -0.5, 1.0),
	];

	var vertexColors = [
		vec4.fromValues(0.0, 0.0, 0.0, 1.0),
		vec4.fromValues(1.0, 0.0, 0.0, 1.0),
		vec4.fromValues(1.0, 1.0, 0.0, 1.0),
		vec4.fromValues(0.0, 1.0, 0.0, 1.0),
		vec4.fromValues(0.0, 0.0, 1.0, 1.0),
		vec4.fromValues(1.0, 0.0, 1.0, 1.0),
		vec4.fromValues(0.0, 1.0, 1.0, 1.0),
		vec4.fromValues(1.0, 1.0, 1.0, 1.0)
	];
	
	var faces= [
		1, 0, 3, 2,
		2, 3, 7, 6,
		3, 0, 4, 7,
		6, 5, 1, 2,
		4, 5, 6, 7,
		5, 4, 0, 1,
	];
	for (var i = 0; i < faces.length; i++) {
		points.push(vertices[faces[i]][0], vertices[faces[i]][1], vertices[faces[i]][2]);
		colors.push(vertexColors[Math.floor(i / 4)][0], vertexColors[Math.floor(i / 4)][1], vertexColors[Math.floor(i /
			4)][2], vertexColors[Math.floor(i / 4)][3]);
	}
}

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	theta[axis] += 0.02;
	gl.uniform3fv(thetaLoc, theta);
	gl.uniform3fv(offsetLoc, offset);
	
	for(var i=0; i<points.length/3; i+=4) {
		gl.drawArrays(gl.TRIANGLE_FAN, i, 4);
	}

	requestAnimFrame(render);
}

function addEvent() {
	document.getElementById("rotateX").onclick = function() {
		axis = xAxis;
	}
	
	document.getElementById("rotateY").onclick = function() {
		axis = yAxis;
	}
	
	document.getElementById("rotateZ").onclick = function() {
		axis = zAxis;
	}
	
	document.getElementById("X_offset").onchange=function(event) {
		offset[0]=event.target.value/canvas.width;	
	}
	document.getElementById("Y_offset").onchange=function(event) {
		offset[1]=event.target.value/canvas.height;
	}
	document.getElementById("Z_offset").onchange=function(event) {
		offset[2]=event.target.value/canvas.width;
	}
}