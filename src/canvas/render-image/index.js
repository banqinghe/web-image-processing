import { initShaders } from '../utils';
import vsText from './shader.vs?raw';
import fsText from './shader.fs?raw';

function initVertexBuffers(gl) {
  const verticesTexCoords = new Float32Array([
    -1.0, 1.0, 0.0, 1.0,
    -1.0, -1.0, 0.0, 0.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, -1.0, 1.0, 0.0,
  ]);

  const ELEMENT_SIZE = verticesTexCoords.BYTES_PER_ELEMENT;

  const vertexTexCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

  const attrPosition = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(attrPosition, 2, gl.FLOAT, false, ELEMENT_SIZE * 4, 0);
  gl.enableVertexAttribArray(attrPosition);

  const attrTexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
  gl.vertexAttribPointer(attrTexCoord, 2, gl.FLOAT, false, ELEMENT_SIZE * 4, ELEMENT_SIZE * 2);
  gl.enableVertexAttribArray(attrTexCoord);
}

function loadTexture(gl, texture, uniformSampler, image) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE0);

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(uniformSampler, 0);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function initTextures(gl, image) {
  const texture = gl.createTexture();
  const uniformSampler = gl.getUniformLocation(gl.program, 'u_Sampler')

  loadTexture(gl, texture, uniformSampler, image);
}

function render(gl, image) {
  if (!initShaders(gl, vsText, fsText)) {
    console.error('Failed to initialize shaders.');
  };

  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  initVertexBuffers(gl);
  initTextures(gl, image);
}

export default render;
