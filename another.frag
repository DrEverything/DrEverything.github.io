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

float map(in vec3 pos) {
  vec3 aa = vec3(pos.x + 2.6 * sin(.1), pos.y, pos.z + .8 * sin(.0));
  float rad =
      .75 + .03 * sin(aa.x * 15.0 + iTime) * sin(aa.y * 15.0 + iTime) * sin(aa.z * 15.0 + iTime);
  float sphere = length(aa) - rad;
  sphere *= .5;
  // float box = sdBox(pos, vec3(.5));

  float ground = pos.y - (-0.78);
  return smin(ground, sphere, .1);
}

vec3 calcNormal(in vec3 pos) {
  vec2 e = vec2(0.0001, 0.0);
  return normalize(vec3(map(pos + e.xyy) - map(pos - e.xyy),
                        map(pos + e.yxy) - map(pos - e.yxy),
                        map(pos + e.yyx) - map(pos - e.yyx)));
}

float castRay(in vec3 ro, vec3 rd) {
  float t = 0.;
  for (int i = 0; i < 80; i++) {
    vec3 pos = ro + t * rd;

    float h = map(pos);
    if (h < .001) {
      break;
    }

    t += h;
    if (t > 20.) {
      break;
    }
  }
  if (t > 20.) {
    t = -1.;
  }
  return t;
}

void main(void) {
  vec2 p = (2. * gl_FragCoord.xy - iResolution.xy) / iResolution.y;

  vec3 ro = vec3(0, 0, 2.);
  vec3 rd = normalize(vec3(p, -1.));

  vec3 col = vec3(.6, .7, .8) - .5 * rd.y;

  float t = castRay(ro, rd);

  if (t > 0.) {
    vec3 pos = ro + t * rd;
    vec3 nor = calcNormal(pos);

    vec3 mate = vec3(.18);

    vec3 sun_dir = normalize(vec3(.8, .4, .2));
    float sun_dif = clamp(dot(nor, sun_dir), 0.0, 1.0);
    float sun_sha = step(castRay(pos + nor * .001, sun_dir), 0.);
    float sky_dif = clamp(.5 + .5 * dot(nor, vec3(0.0, 1.0, 0.0)), 0.0, 1.0);
    float bou_dif = clamp(.5 + .5 * dot(nor, vec3(0.0, -1.0, 0.0)), 0.0, 1.0);

    col = mate * vec3(7., 4.5, 3.) * sun_dif * sun_sha;
    col += mate * vec3(.5, .8, 0.9) * sky_dif;
    col += mate * vec3(0.7, 0.3, 0.2) * bou_dif;
  }

  col = pow(col, vec3(.4545));

  fragColor = vec4(col, 1.);
}