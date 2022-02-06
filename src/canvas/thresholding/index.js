import { initShaders } from '../utils';
import vsText from '../shader.vs?raw';
import fsText from './shader.fs?raw';

function render(gl, image, customValue) {
  if (!initShaders(gl, vsText, fsText)) {
    console.error('Failed to initialize shaders.');
  };

  const threshold = customValue === undefined ? 0.5 : customValue / 100;
  const uniformThreshold = gl.getUniformLocation(gl.program, 'u_Threshold');
  gl.uniform1f(uniformThreshold, threshold);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

export default render;
