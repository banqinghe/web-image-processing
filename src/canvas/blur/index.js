import { initShaders } from '../utils';
import vsText from '../shader.vs?raw';
import fsText from './shader.fs?raw';

function render(gl, image, customValue = 10) {
  const radiusPrefix = 'const float RADIUS = ';

  const fsTextArr = fsText.split('\n');
  fsTextArr.forEach((line, index) => {
    if (line.startsWith(radiusPrefix)) {
      fsTextArr[index] = radiusPrefix + customValue +  '.0;';
    }
  });

  if (!initShaders(gl, vsText, fsTextArr.join('\n'))) {
    console.error('Failed to initialize shaders.');
  };

  const uniformAspect = gl.getUniformLocation(gl.program, 'aspect');
  gl.uniform2fv(uniformAspect, new Float32Array([image.width, image.height]));

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

export default render;
