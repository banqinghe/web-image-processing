precision highp float;
uniform sampler2D u_Sampler;
uniform vec2 aspect;
varying vec2 v_TexCoord;

void main() {
  vec2 texel = vec2(1.0 / aspect[0], 1.0 / aspect[1]);

  mat3 G[2];
  G[0] = mat3(1.0, 2.0, 1.0, 0.0, 0.0, 0.0, -1.0, -2.0, -1.0);
  G[1] = mat3(1.0, 0.0, -1.0, 2.0, 0.0, -2.0, 1.0, 0.0, -1.0);

  mat3 I;
  float cnv[2];
  vec3 sample;

  /* fetch the 3x3 neighbourhood and use the RGB vector's length as intensity value */
  for(int i = 0; i < 3; i++) {
    for(int j = 0; j < 3; j++) {
      sample = texture2D(u_Sampler, v_TexCoord + texel * vec2(float(i) - 1.0, float(j) - 1.0)).rgb;
      I[i][j] = length(sample);
      // I[i][j] = (sample.r + sample.g + sample.b) / 3.0;
    }
  }

  /* calculate the convolution values for all the masks */
  for(int i = 0; i < 2; i++) {
    float dp3 = dot(G[i][0], I[0]) + dot(G[i][1], I[1]) + dot(G[i][2], I[2]);
    cnv[i] = dp3;
  }

  float result = sqrt(cnv[0] * cnv[0] + cnv[1] * cnv[1]);

  gl_FragColor = vec4(vec3(result), 1.0);
}
