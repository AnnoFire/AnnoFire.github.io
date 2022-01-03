const {
	vec2
} = glMatrix;

var gl;
var points;

function init(count, angle) {
	var canvas = document.getElementById("Canvas");

	gl = WebGLUtils.setupWebGL(canvas);
	var vertices = [
		vec2.fromValues(-0.5, -0.5),
		vec2.fromValues(0, 0.5),
		vec2.fromValues(0.5, -0.5)
	];
	var a=vertices[0];
	var b=vertices[1];
	var c=vertices[2];
	//
	points=[];
	console.log(angle);
	a=rotateTriangle(a, angle);
	b=rotateTriangle(b, angle);
	c=rotateTriangle(c, angle);
	divideTriangle(a, b, c, count);
	
	// Configure WebGL
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(1.0, 1.0, 1.0, 1.0);
	
	// load shaders and initialize attribute buffers
	var program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);
	
	// load data into the gpu
	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

	// associate external shader variables with data buffer 
	var vPosition = gl.getAttribLocation(program, 'vPosition');
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	renderPoints();
};

function renderPoints() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.LINES, 0, points.length/2);
}

function divideTriangle(a, b, c, count) {
	if(count==0) {
		points.push(a[0], a[1], b[0], b[1]);
		points.push(b[0], b[1], c[0], c[1]);
		points.push(c[0], c[1], a[0], a[1]);
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
		divideTriangle(ab, ac, bc, count);
	}
}

function mix(a, b) {
	var ab=vec2.create();
	vec2.add(ab, a, b);
	vec2.scale(ab, ab, 0.5);
	return ab;
}

function rotateTriangle(dot, angle) {
	var theta=angle*Math.PI/180.0;
	var a=dot[0];
	var b=dot[1];
	var c=a*Math.cos(theta)+b*Math.sin(theta);
	var d=b*Math.cos(theta)-a*Math.sin(theta);
	return vec2.fromValues(c, d);
}

function DrawTriangle() {
	count = parseInt(myform.Count.value);
	angle=parseInt(myform.Angle.value)
	document.getElementById("Triangle").innerHTML = "<canvas id=\"Canvas\" style=\"border:none;\" width=\"500\" height=\"500\" onclick=\"init("+count+","+angle+")\"></canvas>";

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