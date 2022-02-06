precision mediump float;
uniform sampler2D u_Sampler;
uniform float u_Threshold;
varying vec2 v_TexCoord;
void main() {
  vec4 original_texture = texture2D(u_Sampler, v_TexCoord);
  float grayscale = original_texture.r * 0.299 + original_texture.g * 0.587 +
    original_texture.b * 0.114;
  float binary_value = grayscale >= u_Threshold ? 1.0 : 0.0;
  vec4 target_texture = vec4(binary_value, binary_value, binary_value, 1.0);
  gl_FragColor = target_texture;
}
