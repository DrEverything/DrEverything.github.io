#version 300 es
in vec4 aVertexPosition;

void main(void) { gl_Position = vec4(aVertexPosition.xy, .0, 1.); }