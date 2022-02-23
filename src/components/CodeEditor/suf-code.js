let pixelsLen = width * height * 4;
let dataIndex = 0;

const result = run(pixels, width, height);

for (let i = 0; i < height; i++) {
  for (let j = 0; j < width; j++) {
    data[dataIndex++] = result[i][j].r;
    data[dataIndex++] = result[i][j].g;
    data[dataIndex++] = result[i][j].b;
    data[dataIndex++] = result[i][j].a;
  }
}

ctx.putImageData(imageData, 0, 0);
