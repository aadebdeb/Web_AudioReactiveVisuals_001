import { createShader, createProgram, getUniformLocations, createVbo } from './webGlUtils';
import renderTimeDomainVertex from '!!raw-loader!./shaders/renderTimeDomainVertex.glsl';
import renderTimeDomainFragment from '!!raw-loader!./shaders/renderTimeDomainFragment.glsl';

export class TimeDomainRenderer {
  private program: WebGLProgram;
  private uniformLocs: Map<string, WebGLUniformLocation>;
  private array: Float32Array;
  private vbo: WebGLBuffer;

  constructor(gl: WebGL2RenderingContext, length: number) {
    this.program = createProgram(gl,
      createShader(gl, renderTimeDomainVertex, gl.VERTEX_SHADER),
      createShader(gl, renderTimeDomainFragment, gl.FRAGMENT_SHADER));
      this.uniformLocs = getUniformLocations(gl, this.program, ['u_audioSize']);
      this.array = new Float32Array(length);
      this.vbo = createVbo(gl, this.array, gl.DYNAMIC_DRAW);
  }

  update(gl: WebGL2RenderingContext, analyzer: AnalyserNode) {
    analyzer.getFloatTimeDomainData(this.array);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.array);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  render(gl: WebGL2RenderingContext) {
    gl.useProgram(this.program);
    gl.uniform1f(<WebGLUniformLocation>this.uniformLocs.get('u_audioSize'), this.array.length);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 1, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINE_STRIP, 0, this.array.length);
    gl.disableVertexAttribArray(0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }
}