const {
	vec2
} = glMatrix;

var gl;
var points;
var colors;
var R, G, B;
function init(count) {
	var canvas = document.getElementById("Canvas");

	gl = WebGLUtils.setupWebGL(canvas);
	var vertices = [
		-1, -1,
		0, 1,
		1, -1
	];
	var a=vec2.fromValues(vertices[0], vertices[1]);
	var b=vec2.fromValues(vertices[2], vertices[3]);
	var c=vec2.fromValues(vertices[4], vertices[5]);
	points=[];
	colors=[];
	divideTriangle(a, b, c, count);
	
	// Configure WebGL
	gl.viewport(10, 10, canvas.width-20, canvas.height-20);
	gl.clearColor(1.0, 1.0, 1.0, 1.0);

	// load shaders and initialize attribute buffers
	var program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	// load data into the gpu
	var bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
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
	var aColor = gl.getAttribLocation(program, "aColor");
	gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(aColor);

	renderPoints();
};

function renderPoints() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLES, 0, points.length/2);
}

function divideTriangle(a, b, c, count) {
	if(count==0) {
		points.push(a[0], a[1], b[0], b[1], c[0], c[1]);
		colors.push(R, G, B, R, G, B, R, G, B);
		return;
	}
	else {
		var ab=mix(a, b);
		var ac=mix(a, c);
		var bc=mix(b, c);
		count--;
		divideTriangle(a, ab, ac, count);
		divideTriangle(b, ab, bc, count);
		divideTriangle(c, ac, bc, count);
	}
}

function mix(a, b) {
	var ab=vec2.create();
	vec2.add(ab, a, b);
	vec2.scale(ab, ab, 0.5);
	return ab;
}

function DrawTriangle() {
	count = parseInt(myform.Count.value);
	R=parseFloat(myform.R.value);
	G=parseFloat(myform.G.value);
	B=parseFloat(myform.B.value);
	R/=255.0;
	G/=255.0;
	B/=255.0;
	document.getElementById("Triangle").innerHTML = "<canvas id=\"Canvas\" style=\"border:none;\" width=\"500\" height=\"500\" onclick=\"init("+count+")\"></canvas>";

	(() => {
		if (document.all) {
			document.getElementById("Canvas").click();
		}
		else {
			var e = document.createEvent("MouseEvents");
			e.initEvent("click", true, true);
			document.getElementById("Canvas").dispatchEvent(e);
		}
	})();
}