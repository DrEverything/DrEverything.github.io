let mainCanvas = document.querySelector('#main');
let webgpuPromises = [
    fetch("main.wgsl").then((shader) => shader.text()),
    navigator.gpu.requestAdapter().then(async (adapter) => await adapter.requestDevice()).catch((e) => console.error("No appropriate GPUAdapter found.", e)),
];
Promise.all(webgpuPromises).then(([shader, _device]) => {
    let device = _device;
    mainCanvas.height = mainCanvas.clientHeight * window.devicePixelRatio;
    mainCanvas.width = mainCanvas.clientWidth * window.devicePixelRatio;
    const context = mainCanvas.getContext("webgpu");
    const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
    context.configure({
        device: device,
        format: canvasFormat,
    });
    const shaderModule = device.createShaderModule({
        label: "Shader",
        code: shader
    });
    const vertices = new Float32Array([
        -1.0, -1.0,
        1.0, -1.0,
        1.0, 1.0,
        -1.0, -1.0,
        1.0, 1.0,
        -1.0, 1.0,
    ]);
    const vertexBuffer = device.createBuffer({
        label: "Screen vertices",
        size: vertices.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    const vertexBufferLayout = {
        arrayStride: 8,
        attributes: [{
                format: "float32x2",
                offset: 0,
                shaderLocation: 0,
            }],
    };
    device.queue.writeBuffer(vertexBuffer, 0, vertices);
    const uniformBuffers = [
        device.createBuffer({
            label: "Size Buffer",
            size: 8,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        }),
        device.createBuffer({
            label: "Time Buffer",
            size: 4,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        })
    ];
    let size = new Float32Array([context.canvas.width, context.canvas.height]);
    device.queue.writeBuffer(uniformBuffers[0], 0, size);
    let time = new Float32Array([0.0]);
    device.queue.writeBuffer(uniformBuffers[1], 0, time);
    const resizeObserver = new ResizeObserver(entries => {
        for (let _ of entries) {
            context.canvas.height = mainCanvas.clientHeight * window.devicePixelRatio;
            context.canvas.width = mainCanvas.clientWidth * window.devicePixelRatio;
        }
        let size = new Float32Array([context.canvas.width, context.canvas.height]);
        device.queue.writeBuffer(uniformBuffers[0], 0, size);
    });
    resizeObserver.observe(mainCanvas);
    const bindGroupLayouts = [
        device.createBindGroupLayout({
            label: "Time buffer bind group layout",
            entries: [{
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    buffer: {}
                }, {
                    binding: 1,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    buffer: {}
                }]
        }),
    ];
    const bindGroups = [
        device.createBindGroup({
            label: "Bind Group 1",
            layout: bindGroupLayouts[0],
            entries: [
                {
                    binding: 0,
                    resource: { buffer: uniformBuffers[0] }
                },
                {
                    binding: 1,
                    resource: { buffer: uniformBuffers[1] }
                }
            ]
        })
    ];
    const pipelineLayout = device.createPipelineLayout({
        label: "Pipeline Layout",
        bindGroupLayouts: bindGroupLayouts,
    });
    const renderPipeline = device.createRenderPipeline({
        label: "Render Pipeline",
        layout: pipelineLayout,
        vertex: {
            module: shaderModule,
            entryPoint: "vertexMain",
            buffers: [vertexBufferLayout]
        },
        fragment: {
            module: shaderModule,
            entryPoint: "fragmentMain",
            targets: [{
                    format: canvasFormat
                }]
        }
    });
    // const UPDATE_INTERVAL = 100;
    function updateGrid() {
        time[0] += 0.02;
        const encoder = device.createCommandEncoder();
        const renderPass = encoder.beginRenderPass({
            colorAttachments: [{
                    view: context.getCurrentTexture().createView(),
                    loadOp: "clear",
                    clearValue: { r: 0, g: 0, b: 0.1, a: 1.0 },
                    storeOp: "store",
                }]
        });
        renderPass.setPipeline(renderPipeline);
        renderPass.setVertexBuffer(0, vertexBuffer);
        renderPass.setBindGroup(0, bindGroups[0]);
        renderPass.draw(vertices.length / 2);
        renderPass.end();
        device.queue.submit([encoder.finish()]);
        device.queue.writeBuffer(uniformBuffers[1], 0, time);
        requestAnimationFrame(updateGrid);
    }
    updateGrid();
    // setInterval(updateGrid, UPDATE_INTERVAL);
});
export {};
