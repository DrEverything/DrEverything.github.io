#version 300 es
precision mediump float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (a - b) / k, 0.0, 1.0);
  return mix(a, b, h) - k * h * (1.0 - h);
}

mat2 rot2D(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}
vec3 rot3D(vec3 p, vec3 axis, float angle) {
  return mix(dot(axis, p) * axis, p, cos(angle)) + cross(axis, p) * sin(angle);
}

float sdSphere(vec3 p, float s) { return length(p) - s; }
float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}
float sdBox2D(in vec2 p, in vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}
float sdEquilateralTriangle(in vec2 p, in float r) {
  const float k = sqrt(3.0);
  p.x = abs(p.x) - r;
  p.y = p.y + r / k;
  if (p.x + k * p.y > 0.0)
    p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.0;
  p.x -= clamp(p.x, -2.0 * r, 0.0);
  return -length(p) * sign(p.y);
}
float map(in vec3 pos) {
  vec3 aa = vec3(pos.x + 2.6 * sin(.0), pos.y, pos.z + .8 * sin(.0));
  float rad = .75 + .05 * sin(aa.x * 15.0 + iTime) *
                        sin(aa.y * 15.0 + iTime * .7) *
                        sin(aa.z * 15.0 + iTime * .3);
  float sphere = length(aa) - rad;
  sphere *= .5;
  // float box = sdBox(pos, vec3(.5));

  float ground = pos.y - (-0.78);
  return smin(ground, sphere, .1);
}

float plot(vec2 st, float pct) {
  return smoothstep(pct - 0.01, pct, st.y) - smoothstep(pct, pct + 0.01, st.y);
}

void main() {
  vec2 p = (2. * gl_FragCoord.xy - iResolution.xy) / iResolution.y;
  float sphere = length(p - .55) - .5 +
                 .05 * sin(15. * p.x + iTime) * sin(15. * p.y + iTime * 1.4);
  float box =
      sdBox2D(vec2(p.x - .45, p.y + .65),
              vec2(.5 + .05 * sin(12. * p.x + iTime) * sin(12. * p.y + iTime)));
  float triangle = sdEquilateralTriangle(vec2(p.x - .45, p.y + .65),
                                         .5 + .05 * sin(12. * p.x + iTime) *
                                                  sin(12. * p.y + iTime));

  float y =
      smin(smoothstep(.0, 0.01, sphere), smoothstep(.0, .01, box), .76);

  vec3 color = vec3(y);

  fragColor = vec4(color, 1.0);
}