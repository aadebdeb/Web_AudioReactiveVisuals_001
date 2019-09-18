import { createShader, createProgram, getUniformLocations, createVbo } from './webGlUtils';
import renderFrequencyVertex from '!!raw-loader!./shaders/renderFrequencyVertex.glsl';
import renderFrequencyFragment from '!!raw-loader!./shaders/renderFrequencyFragment.glsl';

export class FrequencyRenderer {
  private program: WebGLProgram;
  private uniformLocs: Map<string, WebGLUniformLocation>;
  private array: Float32Array;
  private vbo: WebGLBuffer;

  constructor(gl: WebGL2RenderingContext, length: number) {
    this.program = createProgram(gl,
      createShader(gl, renderFrequencyVertex, gl.VERTEX_SHADER),
      createShader(gl, renderFrequencyFragment, gl.FRAGMENT_SHADER));
    this.uniformLocs = getUniformLocations(gl, this.program, ['u_minValue', 'u_maxValue', 'u_length']);
    this.array = new Float32Array(length);
    this.vbo = createVbo(gl, this.array, gl.DYNAMIC_DRAW);
  }

  update(gl: WebGL2RenderingContext, analyzer: AnalyserNode) {
    analyzer.getFloatFrequencyData(this.array);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.array);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  render(gl: WebGL2RenderingContext, analyzer: AnalyserNode) {
    gl.useProgram(this.program);
    gl.uniform1f(<WebGLUniformLocation>this.uniformLocs.get('u_minValue'), analyzer.minDecibels);
    gl.uniform1f(<WebGLUniformLocation>this.uniformLocs.get('u_maxValue'), analyzer.maxDecibels);
    gl.uniform1f(<WebGLUniformLocation>this.uniformLocs.get('u_length'), 64);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 1, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(0, 1);
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, 64);
    gl.disableVertexAttribArray(0);
    gl.vertexAttribDivisor(0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }
} 