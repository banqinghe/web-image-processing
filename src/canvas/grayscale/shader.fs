precision mediump float;
uniform sampler2D u_Sampler;
uniform float u_r;
uniform float u_g;
uniform float u_b;
varying vec2 v_TexCoord;
void main() {
  vec4 original_texture = texture2D(u_Sampler, v_TexCoord);
  float grayscale = original_texture.r * u_r + original_texture.g * u_g +
    original_texture.b * u_b;
  vec4 target_texture = vec4(grayscale, grayscale, grayscale, 1.0);
  gl_FragColor = target_texture;
}
