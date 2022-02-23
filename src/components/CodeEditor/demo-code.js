// Here is a demo that inverts the loaded image
function run(pixels, width, height) {
  const result = JSON.parse(JSON.stringify(pixels));
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      result[i][j].r = 255 - pixels[i][j].r;
      result[i][j].g = 255 - pixels[i][j].g;
      result[i][j].b = 255 - pixels[i][j].b;
      result[i][j].a = pixels[i][j].a;
    }
  }
  return result;
}
