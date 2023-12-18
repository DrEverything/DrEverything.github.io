var canvas = document.querySelector('canvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Vertex Shader
const vsSource = `#version 300 es

    in vec4 aVertexPosition;

    void main(void) {
        gl_Position = vec4(aVertexPosition.xy, .0, 1.);
    }
`;

// Fragment Shader
const fsSource = `#version 300 es

precision mediump float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

    float aaa(vec2 position, float radius) {
  return step(radius, length(position - vec2(0.5)));
}

vec3 wave(vec2 uv) {
  float curve = .3 * sin((9.25 * uv.x) + (2. * iTime));
  float lineAShape =
      smoothstep(1. - clamp(distance(curve + uv.y, .0), 0., 1.), 1., .998);
  return (1. - lineAShape) *
         vec3(mix(vec3(.8, .2, .2), vec3(.5, .2, .2), lineAShape));
}

void main(void) {
  vec2 uv = (2. * gl_FragCoord.xy - iResolution.xy) / iResolution.y;
// vec2 uv = (gl_FragCoord.xy / vec2(gl_FragCoord.w, gl_FragCoord.w)) * 2.0 - 1.0;

  vec3 color = vec3(0.);
  float color_w = 1.;
  
//   if (uv.x > 0.) {
//     color.x = 1.;
//   }

  color = wave(uv);
//   vec2 d = vec2(abs(uv.x-.1), abs(uv.y - .5)) - .3;
//   float square = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
//   float circle = length(uv + .4) - .4;
//   float squareColor = step(square, 0.02);

//   // Use smoothstep() to create the circle
//   float circleColor = smoothstep(0., 0.9, circle);

//   // Combine the square and circle colors
//   color += vec3(squareColor, circleColor, 0.);
  
  fragColor = vec4(color, color_w);
}
`;

const gl = canvas.getContext('webgl2');
if (!gl) {
    console.error('Unable to initialize WebGL. Your browser may not support it.');
}

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
gl.uniform1f(iTimeLocation, time);
gl.uniform2f(iResolutionLocation, canvas.width, canvas.height);

gl.enableVertexAttribArray(positionAttribute);
gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0);

gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 2);

function GLDraw() {
    time += 0.02;
    gl.uniform1f(iTimeLocation, time);
    gl.uniform2f(iResolutionLocation, canvas.width, canvas.height);
    
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 2);
    requestAnimationFrame(GLDraw);
}

GLDraw();