// Here is a demo that inverts the loaded image
function run(pixels, width, height) {
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      pixels[i][j].r = 255 - pixels[i][j].r;
      pixels[i][j].g = 255 - pixels[i][j].g;
      pixels[i][j].b = 255 - pixels[i][j].b;
    }
  }
  return pixels;
}
