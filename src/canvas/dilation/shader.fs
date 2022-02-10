precision highp float;
uniform sampler2D u_Sampler;
uniform vec2 aspect;
varying vec2 v_TexCoord;

vec4 dilation(vec2 texel) {
  float result = 1.0;
  if (
    texture2D(u_Sampler, v_TexCoord + texel * vec2(-1.0, 0.0)).r < 1.0 ||
    texture2D(u_Sampler, v_TexCoord + texel * vec2(0.0, -1.0)).r < 1.0 ||
    texture2D(u_Sampler, v_TexCoord + texel * vec2(1.0, 0.0)).r < 1.0 ||
    texture2D(u_Sampler, v_TexCoord + texel * vec2(0.0, 1.0)).r < 1.0
  ) {
    result = 0.0;
  }
  return vec4(vec3(result), 1.0);
}

void main() {
  vec2 texel = vec2(1.0 / aspect[0], 1.0 / aspect[1]);
  gl_FragColor = dilation(texel);
}
