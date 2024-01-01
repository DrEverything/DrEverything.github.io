let canvases = document.querySelectorAll('canvas');
let webgpuPromises = [
    fetch("main.wgsl").then((shader) => shader.text()),
    navigator.gpu.requestAdapter().then(async (adapter) => await adapter.requestDevice()).catch((e) => console.error("No appropriate GPUAdapter found.", e)),
];

const GRID_SIZE = 16;

Promise.all(webgpuPromises).then(([shader, _device]) => {
    let device = _device as GPUDevice;
    canvases[0].width = canvases[0].clientWidth;
    canvases[0].height = canvases[0].clientHeight;

    const context = canvases[0].getContext("webgpu");
    const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
    context.configure({
        device: device,
        format: canvasFormat,
    });

    const vertices = new Float32Array([
        -0.8, -0.8,
        0.8, -0.8,
        0.8, 0.8,

        -0.8, -0.8,
        0.8, 0.8,
        -0.8, 0.8,
    ]);

    const vertexBuffer = device.createBuffer({
        label: "Cell vertices",
        size: vertices.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });

    const vertexBufferLayout: GPUVertexBufferLayout = {
        arrayStride: 8,
        attributes: [{
            format: "float32x2",
            offset: 0,
            shaderLocation: 0,
        }],
    };

    const uniformArray = new Float32Array([GRID_SIZE, GRID_SIZE]);
    const uniformBuffer = device.createBuffer({
        label: "Grid Uniforms",
        size: uniformArray.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    // Create an array representing the active state of each cell.
    const cellStateArray = new Uint32Array(GRID_SIZE * GRID_SIZE);

    // Create two storage buffers to hold the cell state.
    const cellStateStorage = [
        device.createBuffer({
            label: "Cell State A",
            size: cellStateArray.byteLength,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        }),
        device.createBuffer({
            label: "Cell State B",
            size: cellStateArray.byteLength,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        })
    ];

    // Mark every third cell of the first grid as active.
    for (let i = 0; i < cellStateArray.length; i += 3) {
        cellStateArray[i] = 1;
    }
    device.queue.writeBuffer(cellStateStorage[0], 0, cellStateArray);

    // Mark every other cell of the second grid as active.
    for (let i = 0; i < cellStateArray.length; i++) {
        cellStateArray[i] = i % 2;
    }
    device.queue.writeBuffer(cellStateStorage[1], 0, cellStateArray);
    device.queue.writeBuffer(uniformBuffer, 0, uniformArray);
    device.queue.writeBuffer(vertexBuffer, 0, vertices);

    const cellShaderModule = device.createShaderModule({
        label: "Cell shader",
        code: shader as string
    });

    const cellPipeline = device.createRenderPipeline({
        label: "Cell pipeline",
        layout: "auto",
        vertex: {
            module: cellShaderModule,
            entryPoint: "vertexMain",
            buffers: [vertexBufferLayout]
        },
        fragment: {
            module: cellShaderModule,
            entryPoint: "fragmentMain",
            targets: [{
                format: canvasFormat
            }]
        }
    });

    const bindGroups = [
        device.createBindGroup({
            label: "Cell renderer bind group A",
            layout: cellPipeline.getBindGroupLayout(0),
            entries: [{
                binding: 0,
                resource: { buffer: uniformBuffer }
            }, {
                binding: 1,
                resource: { buffer: cellStateStorage[0] }
            }],
        }),
        device.createBindGroup({
            label: "Cell renderer bind group B",
            layout: cellPipeline.getBindGroupLayout(0),
            entries: [{
                binding: 0,
                resource: { buffer: uniformBuffer }
            }, {
                binding: 1,
                resource: { buffer: cellStateStorage[1] }
            }],
        })
    ];

    const UPDATE_INTERVAL = 200; // Update every 200ms (5 times/sec)
    let step = 0; // Track how many simulation steps have been run

    function updateGrid() {
        step++; // Increment the step count

        // Start a render pass 
        const encoder = device.createCommandEncoder();
        const pass = encoder.beginRenderPass({
            colorAttachments: [{
                view: context.getCurrentTexture().createView(),
                loadOp: "clear",
                clearValue: { r: 0, g: 0, b: 0.4, a: 1.0 },
                storeOp: "store",
            }]
        });

        // Draw the grid.
        pass.setPipeline(cellPipeline);
        pass.setBindGroup(0, bindGroups[step % 2]); // Updated!
        pass.setVertexBuffer(0, vertexBuffer);
        pass.draw(vertices.length / 2, GRID_SIZE * GRID_SIZE);

        // End the render pass and submit the command buffer
        pass.end();
        device.queue.submit([encoder.finish()]);
    }

    // Schedule updateGrid() to run repeatedly
    setInterval(updateGrid, UPDATE_INTERVAL);
});

export { }