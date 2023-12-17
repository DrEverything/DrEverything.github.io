var canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2');
if (!gl) {
    console.error('Unable to initialize WebGL. Your browser may not support it.');
}
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
window.onresize = () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
};
// Vertex Shader
const vsSource = `
    attribute vec4 aVertexPosition;

    void main(void) {
        gl_Position = vec4(aVertexPosition.xy, .0, 1.);
    }
`;
// Fragment Shader
const fsSource = `
    precision mediump float;

    void main(void) {
        gl_FragColor = vec4(.0, 1.0, 1.0, .5);
    }
`;
function compileShader(gl, source, type) {
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
function createShaderProgram(gl, vsSource, fsSource) {
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
const shaderProgram = createShaderProgram(gl, vsSource, fsSource);
if (!shaderProgram) {
    // Handle shader program creation failure
    console.error("No program created!");
}
gl.useProgram(shaderProgram);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
const positionAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
const vertices = new Float32Array([
    -1.0, 1.0,
    1.0, 1.0,
    -1.0, -1.0,
    1.0, -1.0 // Bottom right
]);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
gl.enableVertexAttribArray(positionAttribute);
gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 2);
