#version 300 es
precision mediump float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

vec3 ray_march(in vec3 ro, in vec3 rd) {
  float total_distance_traveled = 0.0;
  const int NUMBER_OF_STEPS = 32;
  const float MINIMUM_HIT_DISTANCE = 0.001;
  const float MAXIMUM_TRACE_DISTANCE = 100.0;

  for (int i = 0; i < NUMBER_OF_STEPS; ++i) {
    vec3 current_position = ro + total_distance_traveled * rd;
    float distance_to_closest =
        length(current_position - vec3(.0, .0, .1)) - 1.;

    if (distance_to_closest < MINIMUM_HIT_DISTANCE) {
      return vec3(1.0, 0.0, 0.0);
    }

    if (total_distance_traveled > MAXIMUM_TRACE_DISTANCE) {
      break;
    }

    total_distance_traveled += distance_to_closest;
  }

  return vec3(0.0);
}

void main(void) {
  vec2 st = (2. * gl_FragCoord.xy - iResolution.xy) / iResolution.y;

  vec3 ro = vec3(0, 0, -3);         // ray origin
  vec3 rd = normalize(vec3(st, 1)); // ray direction
  vec3 color = ray_march(ro, rd);

  fragColor = vec4(color, 1.);
}