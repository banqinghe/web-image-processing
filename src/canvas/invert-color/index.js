import { initShaders } from '../utils';
import vsText from '../shader.vs?raw';
import fsText from './shader.fs?raw';

function render(gl, image) {
  // ---------------- PERFORMANCE BEGIN: WebGL render function ----------------
  let startTime = performance.now();

  if (!initShaders(gl, vsText, fsText)) {
    console.error('Failed to initialize shaders.');
  };

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  console.log('render duration:', performance.now() - startTime);
  // -------------------- PERFORMANCE END --------------------
}

export default render;
