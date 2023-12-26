#version 300 es
precision mediump float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

vec3 wave(vec2 uv) {
  float curve = .3 * sin((9.25 * uv.x) + (2. * iTime));
  float lineAShape =
      smoothstep(1. - clamp(distance(curve + uv.y, .0), 0., 1.), 1., .998);
  return (1. - lineAShape) *
         vec3(mix(vec3(.8, .2, .2), vec3(.5, .2, .2), lineAShape));
}

float plot(vec2 st, float pct) {
  return smoothstep(pct - 0.02, pct, st.y) - smoothstep(pct, pct + 0.02, st.y);
}

void main(void) {
  vec2 st = (2. * gl_FragCoord.xy - iResolution.xy) / iResolution.y;

  // float y = .3 * sin(4.5 * st.x + iTime);
  float y = pow((st.x + .5 * sin(9.5 * st.x + iTime * .9)) * .234 *
                    sin(4.5 * st.x + iTime * 1.1),
                1.);

  vec3 color = vec3(y);

  float pct = plot(st, y);
  color = pct * vec3(0.0, 1.0, 1.0) * sin(1. * st.x + iTime * .8);

  fragColor = vec4(color, 1.);
}