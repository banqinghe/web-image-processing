const canvas = ctx.canvas;
const { width, height } = canvas;
const imageData = ctx.getImageData(0, 0, width, height);
const data = imageData.data;

const pixels = Array.from({ length: height }, () => []);

for (let i = 0; i < height; i++) {
  for (let j = 0; j < width * 4; j += 4) {
    const [r, g, b, a] = [
      data[i * width * 4 + j],
      data[i * width * 4 + j + 1],
      data[i * width * 4 + j + 2],
      data[i * width * 4 + j + 3],
    ];
    pixels[i][j / 4] = { r, g, b, a };
  }
}
