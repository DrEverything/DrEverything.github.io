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

float map(vec3 p) {
  float sphere = sdSphere(p, .75 + .05 * sin(p.x * 15.0 + iTime) *
                                       sin(p.y * 15.0 + iTime * .7) *
                                       sin(p.z * 15.0 + iTime * .3));
  return sphere;
}

void main(void) {
  vec2 p = (2. * gl_FragCoord.xy - iResolution.xy) / iResolution.y;

  vec3 ro = vec3(0, 0, -2);         // ray origin
  vec3 rd = normalize(vec3(p, 1.)); // ray direction

  for (int i = 0; i < 80; i++) {
    
  }

  // Coloring
  vec3 col = vec3(.2);

  fragColor = vec4(col, 1);
}