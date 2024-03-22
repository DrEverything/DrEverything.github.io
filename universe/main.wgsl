struct VertexInput {
  @location(0) pos: vec2f,
}

struct VertexOutput {
  @builtin(position) clip_position: vec4f,
  @location(0) position: vec2f,
}

@vertex
fn vertexMain(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    output.clip_position = vec4f(input.pos, 0, 1);
    output.position = input.pos;
    return output;
}

@group(0)@binding(0) var<uniform> time: f32;

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
    return render(input.position);
}

fn render(pos: vec2f) -> vec4f {
  let circle = .4 * sin(time) + length(pos);
  let s = vec3f(smoothstep(.0, 1.0, circle));
  return vec4f(s, 1);
}
