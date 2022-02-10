precision highp float;
uniform sampler2D u_Sampler;
uniform vec2 aspect;
varying vec2 v_TexCoord;

const float RADIUS = 20.0;

vec3 getBlurColor(vec2 texel) {
  vec3 color = vec3(0.0);
  float sum = 0.0;
  for (float i = -RADIUS; i <= RADIUS; i++) {
    for (float j = -RADIUS; j <= RADIUS; j++) {
      float weight = (RADIUS - abs(i)) * (RADIUS - abs(j));
      color += texture2D(u_Sampler, v_TexCoord + texel * vec2(i, j)).rgb * weight;
      sum += weight;
    }
  }
  color /= sum;
  return color;
}

void main() {
  vec2 texel = vec2(1.0 / aspect[0], 1.0 / aspect[1]);
  vec4 color = vec4(getBlurColor(texel), texture2D(u_Sampler, v_TexCoord).a);
  gl_FragColor = color;
}
