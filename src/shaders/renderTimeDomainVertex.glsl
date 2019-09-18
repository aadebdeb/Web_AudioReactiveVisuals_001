#version 300 es

precision highp float;

layout (location = 0) in float i_audio;

out float v_posX;

uniform float u_audioSize;

void main(void) {
    vec2 pos = vec2((float(gl_VertexID) / u_audioSize) * 2.0 - 1.0, i_audio);
    gl_Position = vec4(pos, 0.0, 1.0);
    v_posX = pos.x;
}