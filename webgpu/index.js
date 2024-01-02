let canvases = document.querySelectorAll('canvas');
let webgpuPromises = [
    fetch("main.wgsl").then((shader) => shader.text()),
    navigator.gpu.requestAdapter().then(async (adapter) => await adapter.requestDevice()).catch((e) => console.error("No appropriate GPUAdapter found.", e)),
];
const GRID_SIZE = 64;
const WORKGROUP_SIZE = 8;
Promise.all(webgpuPromises).then(([shader, _device]) => {
    let device = _device;
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
    const vertexBufferLayout = {
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
    const cellStateArray = new Uint32Array(GRID_SIZE * GRID_SIZE);
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
    for (let i = 0; i < cellStateArray.length; ++i) {
        cellStateArray[i] = Math.random() > 0.6 ? 1 : 0;
    }
    device.queue.writeBuffer(cellStateStorage[0], 0, cellStateArray);
    device.queue.writeBuffer(cellStateStorage[1], 0, cellStateArray);
    device.queue.writeBuffer(uniformBuffer, 0, uniformArray);
    device.queue.writeBuffer(vertexBuffer, 0, vertices);
    const cellShaderModule = device.createShaderModule({
        label: "Cell shader",
        code: shader
    });
    const computeShaderModule = device.createShaderModule({
        label: "Cell shader",
        code: `
  `
    });
    const bindGroupLayout = device.createBindGroupLayout({
        label: "Cell Bind Group Layout",
        entries: [{
                binding: 0,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE | GPUShaderStage.FRAGMENT,
                buffer: {}
            }, {
                binding: 1,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE,
                buffer: { type: "read-only-storage" }
            }, {
                binding: 2,
                visibility: GPUShaderStage.COMPUTE,
                buffer: { type: "storage" }
            }]
    });
    const bindGroups = [
        device.createBindGroup({
            label: "Cell renderer bind group A",
            layout: bindGroupLayout,
            entries: [{
                    binding: 0,
                    resource: { buffer: uniformBuffer }
                }, {
                    binding: 1,
                    resource: { buffer: cellStateStorage[0] }
                }, {
                    binding: 2,
                    resource: { buffer: cellStateStorage[1] }
                }],
        }),
        device.createBindGroup({
            label: "Cell renderer bind group B",
            layout: bindGroupLayout,
            entries: [{
                    binding: 0,
                    resource: { buffer: uniformBuffer }
                }, {
                    binding: 1,
                    resource: { buffer: cellStateStorage[1] }
                }, {
                    binding: 2,
                    resource: { buffer: cellStateStorage[0] }
                }],
        }),
    ];
    const pipelineLayout = device.createPipelineLayout({
        label: "Cell Pipeline Layout",
        bindGroupLayouts: [bindGroupLayout],
    });
    const cellPipeline = device.createRenderPipeline({
        label: "Cell pipeline",
        layout: pipelineLayout,
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
    const simulationPipeline = device.createComputePipeline({
        label: "Simulation pipeline",
        layout: pipelineLayout,
        compute: {
            module: cellShaderModule,
            entryPoint: "computeMain",
        }
    });
    const UPDATE_INTERVAL = 200;
    let step = 0;
    function updateGrid() {
        step++;
        const encoder = device.createCommandEncoder();
        const computePass = encoder.beginComputePass();
        computePass.setPipeline(simulationPipeline);
        computePass.setBindGroup(0, bindGroups[step % 2]);
        const workgroupCount = Math.ceil(GRID_SIZE / WORKGROUP_SIZE);
        computePass.dispatchWorkgroups(workgroupCount, workgroupCount);
        computePass.end();
        const pass = encoder.beginRenderPass({
            colorAttachments: [{
                    view: context.getCurrentTexture().createView(),
                    loadOp: "clear",
                    clearValue: { r: 0, g: 0, b: 0.1, a: 1.0 },
                    storeOp: "store",
                }]
        });
        pass.setPipeline(cellPipeline);
        pass.setBindGroup(0, bindGroups[step % 2]); // Updated!
        pass.setVertexBuffer(0, vertexBuffer);
        pass.draw(vertices.length / 2, GRID_SIZE * GRID_SIZE);
        pass.end();
        device.queue.submit([encoder.finish()]);
    }
    setInterval(updateGrid, UPDATE_INTERVAL);
});
export {};
