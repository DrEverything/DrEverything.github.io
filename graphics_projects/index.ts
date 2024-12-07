const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(navigator.userAgent.toLowerCase());

// import init from "./pkg/allsim.js";
// init().then(() => {
//   console.log("WASM Loaded");
// });

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

let animationIds: Map<string, number> = new Map();
let drawFuctions: Map<string, () => void> = new Map();
function initWebGL2(canvas: HTMLCanvasElement, vsSource: string, fsSource: string): () => void {
  canvas.height = canvas.clientHeight * window.devicePixelRatio;
  canvas.width = canvas.clientWidth * window.devicePixelRatio;

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
  const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
      gl.canvas.height = canvas.clientHeight * window.devicePixelRatio;
      gl.canvas.width = canvas.clientWidth * window.devicePixelRatio;
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }
  });
  resizeObserver.observe(canvas);

  let isDragging = false;
  let lastMousePosition = { x: 0, y: 0 };
  let mouseDelta = { x: 0, y: 0 };
  let accumulatedDelta = { x: 0, y: 0 };
  function updateBuffer(e: MouseEvent | Touch) {
    if (!isDragging) return;

    let currentMousePosition = {
      x: ((e.clientX - canvas.offsetLeft) / canvas.width) * 2 - 1,
      y: 1 - ((e.clientY - canvas.offsetTop) / canvas.height) * 2
    };

    // Calculate the delta
    mouseDelta.x = currentMousePosition.x - lastMousePosition.x;
    mouseDelta.y = currentMousePosition.y - lastMousePosition.y;

    accumulatedDelta.x += mouseDelta.x;
    accumulatedDelta.y += mouseDelta.y;

    // Update lastMousePosition for the next move event
    lastMousePosition = currentMousePosition;

    gl.uniform2f(iMouseLocation, accumulatedDelta.x, accumulatedDelta.y);
  }

  if (isMobile) {
    canvas.addEventListener('touchstart', function(e) {
      e.preventDefault(); // Often useful to prevent default touch behaviors
      isDragging = true;
      const touch = e.touches[0];
      lastMousePosition.x = ((touch.clientX - canvas.offsetLeft) / canvas.width) * 2 - 1;
      lastMousePosition.y = 1 - ((touch.clientY - canvas.offsetTop) / canvas.height) * 2;
      updateBuffer(touch);
    }, { passive: false });

    canvas.addEventListener('touchmove', function(e) {
      if (isDragging) {
        e.preventDefault();
        updateBuffer(e.touches[0]);
      }
    }, { passive: false });

    canvas.addEventListener('touchend', function() {
      isDragging = false;
    });

    canvas.addEventListener('touchcancel', function() {
      isDragging = false;
    });
  } else {
    canvas.addEventListener('mousedown', function(e) {
      isDragging = true;
      lastMousePosition.x = ((e.clientX - canvas.offsetLeft) / canvas.width) * 2 - 1;
      lastMousePosition.y = 1 - ((e.clientY - canvas.offsetTop) / canvas.height) * 2;
      updateBuffer(e);
    });

    canvas.addEventListener('mousemove', updateBuffer);

    canvas.addEventListener('mouseup', function() {
      isDragging = false;
    });

    canvas.addEventListener('mouseleave', function() {
      isDragging = false;
    });
  }

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
  let iMouseLocation = gl.getUniformLocation(shaderProgram, "iMouse");
  gl.uniform2f(iResolutionLocation, gl.canvas.width, gl.canvas.height);

  gl.enableVertexAttribArray(positionAttribute);
  gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0);

  let time = 0.;
  function GLDraw() {
    gl.uniform1f(iTimeLocation, time);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 2);
    time += 0.03;

    animationIds.set(canvas.id, requestAnimationFrame(GLDraw));
  }

  // GLDraw();
  // cancelAnimationFrame(animationIds.get(canvas.id));

  // let intervalId = setInterval(GLDraw, 100);
  return GLDraw;
}

let canvases = [document.querySelector('#inigo') as HTMLCanvasElement];
let shaderPromises = [
  fetch("main.vert").then((vert) => vert.text()),
  fetch(`inigo.frag`).then((frag) => frag.text())
];

// for (let canvas of canvases) {
//     shaderPromises.push(fetch(`${canvas.id}.frag`).then((frag) => frag.text()))
// }

Promise.all(shaderPromises)
  .then((shaders) => {
    for (let i = 0; i < canvases.length; i++) {
      drawFuctions.set(canvases[i].id, initWebGL2(canvases[i], shaders[0], shaders[i + 1]));
      drawFuctions.get(canvases[i].id)();
      cancelAnimationFrame(animationIds.get(canvases[i].id));

      if (isMobile) {
        // canvases[i].addEventListener("touchstart", function () {
        //     let cId = canvases[i].id;
        //     let id = animationIds.get(cId);
        //     if (id) {
        //         cancelAnimationFrame(id);
        //         animationIds.delete(cId);
        //     } else {
        //         drawFuctions.get(cId)();
        //     }
        // })
        canvases[i].addEventListener("touchstart", function() {
          drawFuctions.get(canvases[i].id)();
        })
        canvases[i].addEventListener("touchend", function() {
          cancelAnimationFrame(animationIds.get(canvases[i].id));
        })
      } else {
        canvases[i].addEventListener("mouseenter", function() {
          drawFuctions.get(canvases[i].id)();
        })
        canvases[i].addEventListener("mouseleave", function() {
          cancelAnimationFrame(animationIds.get(canvases[i].id));
        })
      }
    }
  });

export { }
