const canvases = [
    document.querySelector('#wave') as HTMLCanvasElement,
    document.querySelector('#another') as HTMLCanvasElement
];

const shaderPromises = [
    fetch("main.vert").then((vert) => vert.text()),
    fetch("wave.frag").then((frag) => frag.text()),
    fetch("another.frag").then((frag) => frag.text()),
];

function compileShader(gl: WebGL2RenderingContext, source: string, type: GLenum): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) {
        console.error('Unable to create shader.');
        return null;
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation failed: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function createShaderProgram(gl: WebGL2RenderingContext, vsSource: string, fsSource: string): WebGLProgram | null {
    const vertexShader = compileShader(gl, vsSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fsSource, gl.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) {
        return null;
    }

    const program = gl.createProgram();
    if (!program) {
        console.error('Unable to create shader program.');
        return null;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Shader program linking failed: ' + gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }

    return program;
}

function initWebGL2(canvas: HTMLCanvasElement, vsSource: string, fsSource: string) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const gl = canvas.getContext('webgl2');
    if (!gl) {
        console.error('Unable to initialize WebGL2. Your browser may not support it.');
    }

    const shaderProgram = createShaderProgram(gl, vsSource, fsSource);
    if (!shaderProgram) {
        // Handle shader program creation failure
        console.error("No program created!")
    }

    gl.useProgram(shaderProgram);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    const positionAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    const vertices = new Float32Array([
        -1.0, 1.0, // Top left
        1.0, 1.0, // Top right
        -1.0, -1.0, // Bottom left
        1.0, -1.0 // Bottom right
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    let iTimeLocation = gl.getUniformLocation(shaderProgram, "iTime");
    let iResolutionLocation = gl.getUniformLocation(shaderProgram, "iResolution");
    let time = 0.;

    gl.enableVertexAttribArray(positionAttribute);
    gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0);

    function GLDraw() {
        gl.uniform1f(iTimeLocation, time);
        gl.uniform2f(iResolutionLocation, gl.canvas.width, gl.canvas.height);

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 2);
        time += 0.03;
        requestAnimationFrame(GLDraw);
    }

    GLDraw();
}

Promise.all(shaderPromises)
    .then((shaders) => {
        for (var i = 1; i < shaders.length; i++) {
            initWebGL2(canvases[i - 1], shaders[0], shaders[i]);
        }
    });
