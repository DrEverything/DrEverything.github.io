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
  vec3 spherePos = vec3(sin(iTime) * 3., 0, 1);
  float sphere = sdSphere(p - spherePos, 1.);

  vec3 q = p;

  float box = sdBox(q, vec3(.5));

  float ground = p.y + .75;

  return smin(ground, smin(sphere, box, 2.), .65);
}

void main(void) {
  vec2 uv = (2. * gl_FragCoord.xy - iResolution.xy) / iResolution.y;

  vec3 ro = vec3(0, 0, -3);         // ray origin
  vec3 rd = normalize(vec3(uv, 1)); // ray direction
  vec3 col = vec3(0);

  float tdt = 0.;

<<<<<<< HEAD
  float pct = plot(st, y);
  color = pct * vec3(0.0, 1.0, 0.0) * sin(2.5 * st.x + iTime * 1.4);
=======
  // Raymarching
  for (int i = 0; i < 80; i++) {
    vec3 p = ro + rd * tdt;
>>>>>>> dev

    float d = map(p);

    tdt += d;

    if (d < .001 || tdt > 100.) {
      break;
    }
  }

  // Coloring
  col = vec3(tdt * .09);

  fragColor = vec4(col, 1);
}