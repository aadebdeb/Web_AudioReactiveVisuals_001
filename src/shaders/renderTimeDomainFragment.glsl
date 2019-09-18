#version 300 es

precision highp float;

in float v_posX;

out vec4 o_color;

vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(6.28318530718 * (t * c + d));
}

void main(void) {
    o_color = vec4(palette(v_posX * 1.0, vec3(0.5), vec3(0.5), vec3(1.0), vec3(0.0, 0.33, 0.67)), 1.0);
}