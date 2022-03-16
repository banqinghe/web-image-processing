/**
 * 在 Web Worker 中运行用户自定义代码
 */
function runCodeInWorker(code, pixels, width, height) {
  return new Promise(resolve => {
    window.canvasWorker.onmessage = e => {
      resolve(e.data);
    };

    window.canvasWorker.postMessage({
      customCode: code,
      pixels,
      width,
      height,
    });
  });
}

/**
 * 在主线程中运行
 */
function runCodeInMainThread(code, pixels, width, height) {
  const func = new Function(
    'pixels',
    'width',
    'height',
    `
    ${code}
    if (typeof run === 'function') {
      return run(pixels, width, height);
    }
    return null;
  `
  );
  let result;
  try {
    result = func(pixels, width, height);
  } catch (err) {
    console.error(err);
  }
  return result;
}

/**
 * 将 ImageData.data 的一维形式的转化为 {r: number, g: number, b: number}[height][width] 形式
 */
function getFormattedRGBData(data, width, height) {
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

  return pixels;
}

/**
 * 将新数据渲染至 canvas，保存新图片 URL
 */
function renderAndSave(ctx, imageData, result, dispatch) {
  const { width, height } = ctx.canvas;
  const { data } = imageData;
  for (let i = 0, dataIndex = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      data[dataIndex++] = result[i][j].r;
      data[dataIndex++] = result[i][j].g;
      data[dataIndex++] = result[i][j].b;
      data[dataIndex++] = result[i][j].a;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  ctx.canvas.toBlob(blob => {
    // FIXME: state is undefined
    // URL.revokeObjectURL(state.currentImageUrl);
    dispatch({
      type: 'canvas/updateProcessModule',
      payload: {
        currentImageUrl: URL.createObjectURL(blob),
        // originImage 和 processFn 用于 SupportComponent，自定义模块无需使用
        processModule: {
          name: 'custom',
          originImage: null,
          processFn: null,
        },
      },
    });
  });
}

/**
 * 在 Canvas 2D 上下文中运行用户自定义代码模块
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} code
 * @param {React.DispatchWithoutAction} dispatch
 * @param {Function} info
 */
async function runCustomModule(
  ctx,
  code,
  dispatch,
  showInfo,
  useWorker = false
) {
  // --------------- PERFORMANCE TEST BEGIN: runCustomModule function ---------------
  let funcStartTime = performance.now();

  const canvas = ctx.canvas;
  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  const pixels = getFormattedRGBData(data, width, height);

  // --------------- PERFORMANCE TEST BEGIN: run custom code ---------------
  let runCustomCodeStartTime = performance.now();

  const result = useWorker
    ? await runCodeInWorker(code, pixels, width, height)
    : runCodeInMainThread(code, pixels, width, height);

  console.log(
    'run custom module ' + (useWorker ? 'with worker' : 'without worker'),
    '- duration:',
    performance.now() - runCustomCodeStartTime
  );
  // ----------------------- PERFORMANCE TEST END -----------------------

  if (!result) {
    if (showInfo) {
      showInfo(`自定义文件中缺少 run() 函数或运行错误`);
    }
    return;
  }
  renderAndSave(ctx, imageData, result, dispatch);

  console.log(
    'runCustomModule function ' +
      (useWorker ? 'with worker' : 'without worker'),
    '- duration:',
    performance.now() - funcStartTime
  );
  // ----------------------- PERFORMANCE TEST END -----------------------
}

export { runCustomModule };
