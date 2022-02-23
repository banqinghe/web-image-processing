import { useContext, useEffect, useRef, useState } from 'react';
import { Switch, Radio } from 'antd';
import { globalContext } from '../../store';
import { loadImage } from '../../canvas/utils';
import renderImageGl from '../../canvas/render-image';
import renderImageCanvas from '../../canvas/render-canvas';

import './index.css';

const moduleChineseNameDict = {
  'grayscale': '转灰度',
  'thresholding': '二值化',
  'invert-color': '反色',
  'sobel': 'Sobel 边缘检测',
  'prewitt': 'Prewitt 边缘检测',
  'dilation': '膨胀',
  'erosion': '腐蚀',
  'blur': '模糊',
  'sharpen': '锐化',
};

function WebGLCanvas() {
  const { state, dispatch } = useContext(globalContext);

  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);

  const [originImageVisible, setOriginImageVisible] = useState(false);

  function handleChangeMode(e) {
    dispatch({
      type: 'canvas/changeMode',
      payload: e.target.value,
    });
  }

  // canvas 元素大小自适应
  function updateCanvasDom(image) {
    const { width, height } = image;

    dispatch({
      type: 'image/updateInfo',
      payload: {
        ...state.imageInfo,
        imageSize: width + '×' + height,
      },
    });

    if (canvasRef.current) {
      canvasRef.current.remove();
    }
    canvasRef.current =
      canvasContainerRef.current.appendChild(document.createElement('canvas'));
    canvasRef.current.id = 'render-canvas';

    const containerRect = canvasContainerRef.current.getBoundingClientRect();
    const containerAspectRadio = containerRect.width / containerRect.height;
    const canvasAspectRadio = width / height;
    let scaleRadio = 1;
    if (containerAspectRadio > canvasAspectRadio) {
      scaleRadio = containerRect.height / height;
    } else {
      scaleRadio = containerRect.width / width;
    }
    canvasRef.current.width = width;
    canvasRef.current.height = height;
    const paddingScaleRadio = 0.9;
    canvasRef.current.style.width = width * scaleRadio * paddingScaleRadio + 'px';
    canvasRef.current.style.height = height * scaleRadio * paddingScaleRadio + 'px';

    let ctx;
    if (state.mode === 'canvas') {
      ctx = canvasRef.current.getContext('2d');
      renderImageCanvas(ctx, image);
    } else {
      ctx = canvasRef.current.getContext('webgl2', { preserveDrawingBuffer: true });
      renderImageGl(ctx, image);
    }
    dispatch({
      type: 'canvas/updateCtx',
      payload: ctx,
    });
  };

  function renderOriginImage() {
    loadImage(state.imageUrl)
      .then(updateCanvasDom)
      .catch(console.error);
  }

  function renderCurrentImage() {
    loadImage(state.currentImageUrl)
      .then(updateCanvasDom)
      .catch(console.error);
  }

  function resetModule() {
    dispatch({
      type: 'canvas/resetProcessModule',
      payload: null,
    });
    renderOriginImage();
  }

  useEffect(renderOriginImage, [state.imageUrl]);
  useEffect(renderCurrentImage, [state.mode]);

  return (
    <div className="process-window">
      <div id="canvas-container" ref={canvasContainerRef}>
        {/* <canvas id="render-canvas" /> */}
        <div className={'origin-image-mask' + (originImageVisible ? ' visible' : '')}>
          <img
            width={canvasRef.current ? canvasRef.current.style.width : undefined}
            src={state.imageUrl}
            alt="原图"
          />
        </div>
        <div className="image-info-bar">
          <span title="文件名">{state.imageInfo.name}</span>
          <span title="文件大小">{Math.round(state.imageInfo.fileSize / 2 ** 10) + ' KB'}</span>
          <span title="图片尺寸">{state.imageInfo.imageSize}</span>
        </div>
      </div>
      <div className="canvas-info-sidebar">
        <div className="info-item origin-image-switch">
          <span className="info-item-title">对比原图:</span>
          <Switch
            size="small"
            checked={originImageVisible}
            onChange={checked => setOriginImageVisible(checked)}
          />
        </div>
        <div className="info-item">
          <span className="info-item-title">渲染模式:</span>
          <div>
            <Radio.Group
              value={state.mode}
              options={[
                { label: 'WebGL', value: 'webgl' },
                { label: 'Canvas', value: 'canvas' },
              ]}
              optionType="button"
              buttonStyle="solid"
              onChange={handleChangeMode}
            />
          </div>
        </div>
        <div className="info-item module-list">
          <p>处理模块: {state.moduleList.length ? '' : '无'}</p>
          <ul>
            {state.moduleList.map((module, index) => (
              <li key={index}>
                {moduleChineseNameDict[module.name]}
                {module.repeat ? ' (×' + module.repeat + ')' : ''}
              </li>
            ))}
          </ul>
          <button className="reset-btn" onClick={resetModule}>重置</button>
        </div>
      </div>
    </div>
  );
}

export default WebGLCanvas;
