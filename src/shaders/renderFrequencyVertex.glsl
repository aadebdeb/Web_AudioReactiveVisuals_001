#version 300 es

precision highp float;

layout (location = 0) in float i_frequency;

out float v_posX;

uniform float u_arraySize;

uniform float u_minValue;
uniform float u_maxValue;
uniform float u_length;

#define TWO_PI 6.28318530718

const int[6] INDICES = int[](
  0, 1, 2,
  3, 2, 1
);

mat2 rotate(float r) {
  float c = cos(r);
  float s = sin(r);
  return mat2(c, s, -s, c);
}

void main(void) {
  int index = INDICES[gl_VertexID];

  float scale = smoothstep(u_minValue, u_maxValue, i_frequency);
  vec2 pos;
  if (index == 0) {
    pos = vec2(0.0, -1.0);
  } else if (index == 1) {
    pos = vec2(1.0, 0.0);
  } else if (index == 2) {
    pos = vec2(-1.0, 0.0);
  } else {
    pos = vec2(0.0, 1.0);
  }

  float size = 2.0 / u_length;

  pos *= vec2(size * 0.5, 0.5) * scale;

  pos.x += (2.0 * (float(gl_InstanceID) + 0.5) / u_length - 1.0);

  gl_Position = vec4(pos, 0.0, 1.0);
  v_posX = pos.x;
}