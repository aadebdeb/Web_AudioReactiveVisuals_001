export function createShader(gl: WebGL2RenderingContext, source: string, type: GLint): WebGLProgram {
  const shader = <WebGLShader>gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) + source);
  }
  return shader;
}

export function createProgram(gl: WebGL2RenderingContext, vertShader: WebGLShader, fragShader: WebGLShader): WebGLProgram {
  const program = <WebGLProgram>gl.createProgram();
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(<string>gl.getProgramInfoLog(program));
  }
  return program;
}

export function getUniformLocations(gl: WebGL2RenderingContext, program: WebGLProgram, names: string[]): Map<string, WebGLUniformLocation> {
  const map = new Map();
  names.forEach((name) => map.set(name, gl.getUniformLocation(program, name)));
  return map;
}

export function createVbo(gl: WebGL2RenderingContext, array: Int16Array | Float32Array, usage: number = gl.STATIC_DRAW): WebGLBuffer {
  const vbo = <WebGLBuffer>gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, array, usage);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return vbo;
}