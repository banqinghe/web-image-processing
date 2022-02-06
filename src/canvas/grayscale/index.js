import { initShaders } from '../utils';
import vsText from '../shader.vs?raw';
import fsText from './shader.fs?raw';

/**
 * customValue: {
 *   r: number;
 *   g: number;
 *   b: number;
 * }
 */
function render(gl, image, customValue) {
  if (!initShaders(gl, vsText, fsText)) {
    console.error('Failed to initialize shaders.');
  };

  const uniformR = gl.getUniformLocation(gl.program, 'u_r');
  const uniformG = gl.getUniformLocation(gl.program, 'u_g');
  const uniformB = gl.getUniformLocation(gl.program, 'u_b');
  if (customValue !== undefined) {
    gl.uniform1f(uniformR, customValue.r);
    gl.uniform1f(uniformG, customValue.g);
    gl.uniform1f(uniformB, customValue.b);
  } else {
    gl.uniform1f(uniformR, 0.299);
    gl.uniform1f(uniformG, 0.587);
    gl.uniform1f(uniformB, 0.114);
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

export default render;
