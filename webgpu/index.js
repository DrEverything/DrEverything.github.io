let canvases = document.querySelectorAll('canvas');
let webgpuPromises = [
    fetch("main.wgsl").then((shader) => shader.text()),
    navigator.gpu.requestAdapter().then(async (adapter) => await adapter.requestDevice()).catch((e) => console.error("No appropriate GPUAdapter found.", e)),
];
Promise.all(webgpuPromises).then(([shader, device]) => {
    device = device;
    canvases[0].width = canvases[0].clientWidth;
    canvases[0].height = canvases[0].clientHeight;
    const context = canvases[0].getContext("webgpu");
    const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
    context.configure({
        device: device,
        format: canvasFormat,
    });
    const vertices = new Float32Array([
        //   X,    Y,
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
    const vertexBufferLayout = {
        arrayStride: 8,
        attributes: [{
                format: "float32x2",
                offset: 0,
                shaderLocation: 0, // Position, see vertex shader
            }],
    };
    const cellShaderModule = device.createShaderModule({
        label: "Cell shader",
        code: shader
    });
    device.queue.writeBuffer(vertexBuffer, /*bufferOffset=*/ 0, vertices);
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
    const encoder = device.createCommandEncoder();
    const pass = encoder.beginRenderPass({
        colorAttachments: [{
                view: context.getCurrentTexture().createView(),
                loadOp: "clear",
                storeOp: "store",
                clearValue: { r: 0, g: 0, b: 0.4, a: 1 },
            }]
    });
    pass.setPipeline(cellPipeline);
    pass.setVertexBuffer(0, vertexBuffer);
    pass.draw(vertices.length / 2); // 6 vertices
    pass.end();
    const commandBuffer = encoder.finish();
    device.queue.submit([commandBuffer]);
    device.queue.submit([encoder.finish()]);
});
export {};
