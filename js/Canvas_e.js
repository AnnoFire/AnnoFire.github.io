var gl;
function init() {
	var canvas = document.getElementById("Canvas_e");
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) {
		alert("WebGL isn't available");
	}
	// Six Vertices
	var vertices = new Float32Array([
		-1.0, -1.0, 1.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 1.0, 0.0,
		1.0, -1.0, 0.0, 0.0, 1.0,
	]);

	// Configure WebGL
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(1.0, 1.0, 1.0, 1.0);

	// Load shaders and initialize attribute buffers
	var program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	// Load the data into the GPU
	var bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	// Associate external shader variables with data buffer
	//
	var FSIZE = vertices.BYTES_PER_ELEMENT;

	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 5 * FSIZE, 0);
	gl.enableVertexAttribArray(vPosition);

	var aColor = gl.getAttribLocation(program, "aColor");
	console.log(aColor);
	gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 5 * FSIZE, 2 * FSIZE);
	gl.enableVertexAttribArray(aColor);

	render();
}

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function DrawTriangle() {
	var height = parseInt(myform.Height.value);
	var width = parseInt(myform.Width.value);
	document.getElementById("Triangle").innerHTML = "<canvas id=\"Canvas_e\" style=\"border:none;\" width=\"" + width +
		"\" height=\"" + height + "\" onclick=\"init()\"></canvas>";
	(() => {
		if (document.all) {
			document.getElementById("Canvas_e").click();
		}
		else {
			var e = document.createEvent("MouseEvents");
			e.initEvent("click", true, true);
			document.getElementById("Canvas_e").dispatchEvent(e);
		}
	})();
}