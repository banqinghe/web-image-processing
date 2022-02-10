precision mediump float;
uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;

void main() {
  vec4 sample = texture2D(u_Sampler, v_TexCoord);
  gl_FragColor = vec4(1.0 - sample.r, 1.0 - sample.g, 1.0 - sample.b, sample.a);
}
