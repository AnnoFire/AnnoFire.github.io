var gl;
var canvas;
var shaderProgram;
var vertexBuffer;
var vertexIndexBuffer;
//加载shader
function setupShaders() {
    // 从 DOM 上创建对应的着色器
    vertexShader = loadShaderFromDOM("shader-vs");
    fragmentShader = loadShaderFromDOM("shader-fs");

    // 创建程序并连接着色器
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // 连接失败的检测
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Failed to setup shaders");
    }

    // 使用着色器
    gl.useProgram(shaderProgram);

    // 创建动态属性获取着色器中 aVertexPosition 属性的位置
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
}
//读取shader字符内容
function loadShaderFromDOM(id) {
    // 获取 DOM
    var shaderScript = document.getElementById(id);

    if (!shaderScript) {
        return null;
    }

    // 获取着色器代码
    var shaderSource = "";
    var currentChild = shaderScript.firstChild;
    while (currentChild) {
        if (currentChild.nodeType == 3) { // 3 corresponds to TEXT_NODE
            shaderSource += currentChild.textContent;
        }
        currentChild = currentChild.nextSibling;
    }

    // 创建着色器
    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    // 编译着色器
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    // 判断编译是否成功
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

//初始化顶点缓存数据
function setupBuffers() {

    // 定义顶点数据
    var triangleVertices = [
        0.5, 0.5, 0.0,
        0.5, -0.5, 0.0,
        -0.5, -0.5, 0.0,
        -0.5, 0.5, 0.0
    ];
    var triangleIndex = [
        0,1,2,
        0,2,3
    ]
    // 创建顶点缓冲
    vertexBuffer = gl.createBuffer();
    // 绑定顶点缓冲
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // 提交顶点数据
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
    vertexBuffer.itemSize = 3;
    vertexBuffer.numberOfItems = 3;

    //创建顶点索引
    vertexIndexBuffer = gl.createBuffer();
    // 绑定顶点索引
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,vertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(triangleIndex),gl.STATIC_DRAW);


}
//绘图
function draw() {
    // 设置视口大小, 使用像素, 调整该大小不影响显示内容，只影响图像在 Canvas 上显示的位置和尺寸
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    // 清除颜色缓冲
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,vertexIndexBuffer);
    // 将提交的顶点数据绑定到着色器的 aVertexPosition 属性
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
    // 开启属性 aVertexPosition 的使用
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    // 绘制图像
    gl.drawElements(gl.TRIANGLES,6,gl.UNSIGNED_SHORT,0);
}

function main() {
    canvas = document.getElementById("Canvas_b");
    //如果没找到<canvas>标签，则输出错误信息
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element.');
        return;
    }
    //获取绘图上下文，“webgl”代表我们用webgl绘制图形。
    gl = canvas.getContext("webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
    setupShaders();//加载并创建shader
    setupBuffers();//加载图形数据
    // 定义清除颜色缓冲之后的填充色为黑色
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    draw();//绘图
}
