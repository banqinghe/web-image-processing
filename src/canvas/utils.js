function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

/**
 * loader vertex shader and fragment shader from file
 */
export function loadShaderSource(vsSourceUrl, fsSourceUrl) {
  return Promise.all([
    fetch(vsSourceUrl).then(res => res.text()),
    fetch(fsSourceUrl).then(res => res.text()),
  ]);
}

/** 
 * initialize shaders 
 */
export function initShaders(gl, vsText, fsText) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsText);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsText);
  
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return false;
  }

  gl.program = shaderProgram;
  gl.useProgram(shaderProgram);
  return true;
}

/**
 * loader image by url
 */
export function loadImage(url) {
  const image = new Image();
  return new Promise((resolve, reject) => {
    image.onload = () => {
      resolve(image);
    };
    image.onerror = () => {
      reject('Failed to load image by url:', url);
    };
    image.src = url;
  });
}
