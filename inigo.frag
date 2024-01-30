#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
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
float sdEllipsoid(vec3 p, vec3 r) {
  float k0 = length(p / r);
  float k1 = length(p / (r * r));
  return k0 * (k0 - 1.0) / k1;
}
float terrainFunction(vec3 pos) {
  float fh = -.9 + .05 * (sin(2.0 * pos.x) + sin(2.0 * pos.z));
  float d = pos.y - fh;
  vec3 qos = pos;

  return d;
}
float mandelbulb(in vec3 pos) {
  vec3 z = pos;
  float dr = 1.;
  float r;
  float power = 8. + iTime * .03;

  for (int i = 0; i < 15; i++) {
    r = length(z);
    if (r > 2.)
      break;

    float theta = acos(z.z / r) * power;
    float phi = atan(z.y, z.x) * power;
    float zr = pow(r, power);
    dr = pow(r, power - 1.) * power * dr + 1.;

    z = zr * vec3(sin(theta) * cos(phi), sin(phi) * sin(theta), cos(theta));
    z += pos;
  }
  return .5 * log(r) * r / dr;
}
float map(in vec3 pos) {
  // vec3 aa = vec3(pos.x + 2.6 * sin(.0), pos.y, pos.z + .8 * sin(.0));
  // float rad = .75 + .05 * sin(aa.x * 15.0 + iTime) *
  //                       sin(aa.y * 15.0 + iTime * .7) *
  //                       sin(aa.z * 15.0 + iTime * .3);
  // float sphere = length(aa + vec3(-.3, -.9, .1)) - rad;
  // sphere *= .5;
  float mandelbulbS = mandelbulb(pos - vec3(.0, .25, .0));
  // mandelbulbS *= .5;

  // float ground = terrainFunction(pos);
  // float ground = pos.y + .5;
  // ground *= .5;

  return mandelbulbS;
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
  
  // float time = iTime * .5;
  vec3 ro = vec3(0, .3, 1.7);
  vec3 rd = normalize(vec3(p, -1.));

  vec2 m = iMouse * 1.5;
  ro.yz *= rot2D(-m.y - .2);
  rd.yz *= rot2D(-m.y - .2);
  ro.xz *= rot2D(-m.x - .4);
  rd.xz *= rot2D(-m.x - .4);

  vec3 col = vec3(.4, .75, 1.) - .7 * rd.y;
  // col = mix(col, vec3(0.7, 0.75, 0.8), exp(-10.0 * rd.y));

  float t = castRay(ro, rd);

  if (t > 0.) {
    vec3 pos = ro + t * rd;
    vec3 nor = calcNormal(pos);

    vec3 mate = vec3(.18);

    vec3 sun_dir = normalize(vec3(.8, .4, .2));
    float sun_dif = clamp(dot(nor, sun_dir), 0.0, 1.0);
    // float sun_sha = step(castRay(pos + nor * .001, sun_dir), 0.);
    float sky_dif = clamp(.5 + .5 * dot(nor, vec3(0.0, 1.0, 0.0)), 0.0, 1.0);
    float bou_dif = clamp(.5 + .5 * dot(nor, vec3(0.0, -1.0, 0.0)), 0.0, 1.0);

    col = mate * vec3(7., 4.5, 3.) * sun_dif;// * sun_sha;
    col += mate * vec3(.5, .8, 0.9) * sky_dif;
    col += mate * vec3(0.7, 0.3, 0.2) * bou_dif;
  }

  col = pow(col, vec3(.4545));

  fragColor = vec4(col, 1.);
}