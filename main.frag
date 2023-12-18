#version 300 es
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

  vec3 color = vec3(0.);
  float color_w = 1.;

  color = wave(uv);
  //   vec2 d = vec2(abs(uv.x-.1), abs(uv.y - .5)) - .3;
  //   float square = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
  //   float circle = length(uv + .4) - .4;
  //   float squareColor = step(square, 0.02);

  //   float circleColor = smoothstep(0., 0.9, circle);

  //   color += vec3(squareColor, circleColor, 0.);

  fragColor = vec4(color, color_w);
}