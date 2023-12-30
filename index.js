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
let animationIds = new Map();
function initWebGL2(canvas, vsSource, fsSource) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const gl = canvas.getContext('webgl2');
    if (!gl) {
        console.error('Unable to initialize WebGL2. Your browser may not support it.');
    }
    const shaderProgram = createShaderProgram(gl, vsSource, fsSource);
    if (!shaderProgram) {
        // Handle shader program creation failure
        console.error("No program created!");
    }
    gl.useProgram(shaderProgram);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    window.addEventListener("resize", function () {
        gl.canvas.width = canvas.clientWidth;
        gl.canvas.height = canvas.clientHeight;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    });
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
        animationIds.set(canvas.id, requestAnimationFrame(GLDraw));
    }
    GLDraw();
}
let canvases = document.querySelectorAll('canvas');
let shaderPromises = [
    fetch("main.vert").then((vert) => vert.text()),
];
for (let canvas of canvases) {
    shaderPromises.push(fetch(`${canvas.id}.frag`).then((frag) => frag.text()));
}
// if (!navigator.gpu) {
//     throw new Error("WebGPU not supported on this browser.");
// }
// const adapter = await navigator.gpu.requestAdapter();
// if (!adapter) {
//     throw new Error("No appropriate GPUAdapter found.");
// }
// const device = await adapter.requestDevice();
// const context = canvases[0].getContext("webgpu");
// const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
// context.configure({
//     device: device,
//     format: canvasFormat,
// });
// const encoder = device.createCommandEncoder();
// const pass = encoder.beginRenderPass({
//     colorAttachments: [{
//         view: context.getCurrentTexture().createView(),
//         loadOp: "clear",
//         storeOp: "store",
//     }]
// });
// pass.end();
// const commandBuffer = encoder.finish();
// device.queue.submit([commandBuffer]);
// device.queue.submit([encoder.finish()]);
Promise.all(shaderPromises)
    .then((shaders) => {
    for (let i = 0; i < canvases.length; i++) {
        canvases[i].addEventListener("click", function () {
            if (!animationIds.has(canvases[i].id)) {
                initWebGL2(canvases[i], shaders[0], shaders[i + 1]);
            }
        });
        initWebGL2(canvases[i], shaders[0], shaders[i + 1]);
    }
    window.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            for (let id of animationIds.keys()) {
                cancelAnimationFrame(animationIds.get(id));
                animationIds.delete(id);
            }
        }
    });
});
export {};
