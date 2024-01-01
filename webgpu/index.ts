let canvases = document.querySelectorAll('canvas');

if (navigator.gpu) {
    const adapter = await navigator.gpu.requestAdapter();
    if (adapter) {
        const device = await adapter.requestDevice();
        canvases[0].width = canvases[0].clientWidth;
        canvases[0].height = canvases[0].clientHeight;
        const context = canvases[0].getContext("webgpu");
        const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
        context.configure({
            device: device,
            format: canvasFormat,
        });
        const encoder = device.createCommandEncoder();
        const pass = encoder.beginRenderPass({
            colorAttachments: [{
                view: context.getCurrentTexture().createView(),
                loadOp: "clear",
                storeOp: "store",
            }]
        });
        pass.end();
        const commandBuffer = encoder.finish();
        device.queue.submit([commandBuffer]);
        device.queue.submit([encoder.finish()]);
    } else {
        console.error("No appropriate GPUAdapter found.");
    }
} else {
    console.error("WebGPU not supported on this browser.");
}

export { }