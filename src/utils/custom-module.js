/**
 * 在 Canvas 2D 上下文中运行用户自定义代码模块
 * @param {CanvasRenderingContext2D} ctx 
 * @param {string} code 
 * @param {React.DispatchWithoutAction} dispatch 
 * @param {Function} info 
 */
function runCustomModule(ctx, code, dispatch, info) {
  console.log('invoke run custom module');
  console.time('run custom module');
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

  const func = new Function('pixels', 'width', 'height', `
    return (function() {
      ${code}
      if (typeof run !== 'undefined') {
        return run(pixels, width, height);
      }
      return null;
    })();
  `);

  const result = func(pixels, width, height);

  if (!result) {
    if (info) {
      info(`自定义文件中缺少 run() 函数`);
    }
    return;
  }

  for (let i = 0, dataIndex = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      data[dataIndex++] = result[i][j].r;
      data[dataIndex++] = result[i][j].g;
      data[dataIndex++] = result[i][j].b;
      data[dataIndex++] = result[i][j].a;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  console.timeEnd('run custom module');

  ctx.canvas.toBlob(blob => {
    dispatch({
      type: 'canvas/updateProcessModule',
      payload: {
        currentImageUrl: URL.createObjectURL(blob),
        // originImage 和 processFn 用于 SupportComponent，自定义模块无需使用
        processModule: {
          name: 'custom',
          originImage: null,
          processFn: null,
        }
      },
    });
  });

  // 使用 web worker，但是效率很低

  // window.canvasWorker.onmessage = e => {
  //  const result = e.data;
  // if (!result) {
  //   if (info) {
  //     info(`自定义文件中缺少 run() 函数`);
  //   }
  //   return;
  // }

  // for (let i = 0, dataIndex = 0; i < height; i++) {
  //   for (let j = 0; j < width; j++) {
  //     data[dataIndex++] = result[i][j].r;
  //     data[dataIndex++] = result[i][j].g;
  //     data[dataIndex++] = result[i][j].b;
  //     data[dataIndex++] = result[i][j].a;
  //   }
  // }

  // ctx.putImageData(imageData, 0, 0);

  // console.timeEnd('run custom module');

  // dispatch({
  //   type: 'canvas/updateProcessModule',
  //   payload: {
  //     currentImageUrl: ctx.canvas.toDataURL(),
  //     // originImage 和 processFn 用于 SupportComponent，自定义模块无需使用
  //     processModule: {
  //       name: 'custom',
  //       originImage: null,
  //       processFn: null,
  //     }
  //   },
  // });
  // }

  // window.canvasWorker.postMessage({
  //   customCode: code,
  //   pixels,
  //   width,
  //   height,
  // });
}

export { runCustomModule };
