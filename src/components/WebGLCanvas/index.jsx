import { useContext, useEffect, useRef, useState } from 'react';
import { Switch, Radio } from 'antd';
import { globalContext } from '../../store';
import { loadImage } from '../../canvas/utils';
import renderImageGl from '../../canvas/render-image';
import renderImageCanvas from '../../canvas/render-canvas';
import { getText } from '../../i18n';

import './index.css';

function WebGLCanvas() {
  const { state, dispatch } = useContext(globalContext);
  const t = getText(state.i18n);

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

    if (canvasRef.current) {
      canvasRef.current.remove();
    }
    canvasRef.current = canvasContainerRef.current.appendChild(
      document.createElement('canvas')
    );
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
    canvasRef.current.style.width =
      width * scaleRadio * paddingScaleRadio + 'px';
    canvasRef.current.style.height =
      height * scaleRadio * paddingScaleRadio + 'px';

    let ctx;
    if (state.mode === 'canvas') {
      ctx = canvasRef.current.getContext('2d');
      renderImageCanvas(ctx, image);
    } else {
      ctx = canvasRef.current.getContext('webgl2', {
        preserveDrawingBuffer: true,
      });
      renderImageGl(ctx, image);
    }

    dispatch({
      type: 'canvas/updateCtx',
      payload: {
        imageSize: width + '×' + height,
        ctx,
      },
    });
  }

  function renderOriginImage() {
    loadImage(state.imageInfo.url).then(updateCanvasDom).catch(console.error);
  }

  function renderCurrentImage() {
    loadImage(state.currentImageUrl).then(updateCanvasDom).catch(console.error);
  }

  function resetModule() {
    dispatch({
      type: 'canvas/resetProcessModule',
      payload: null,
    });
    renderOriginImage();
  }

  useEffect(renderOriginImage, [state.imageInfo.url]);
  useEffect(renderCurrentImage, [state.mode]);

  return (
    <div className="process-window">
      <div id="canvas-container" ref={canvasContainerRef}>
        {/* <canvas id="render-canvas" /> */}
        <div
          className={
            'origin-image-mask' + (originImageVisible ? ' visible' : '')
          }
        >
          <img
            width={
              canvasRef.current ? canvasRef.current.style.width : undefined
            }
            src={state.imageInfo.url}
            alt="origin image"
          />
        </div>
        <div className="image-info-bar">
          <span title={t('File Name')}>{state.imageInfo.name}</span>
          <span title={t('File Size')}>
            {Math.round(state.imageInfo.fileSize / 2 ** 10) + ' KB'}
          </span>
          <span title={t('Image Size')}>{state.imageInfo.imageSize}</span>
        </div>
      </div>
      <div className="canvas-info-sidebar">
        <div className="info-item origin-image-switch">
          <span className="info-item-title">{t('Compare to Origin')}:</span>
          <Switch
            size="small"
            checked={originImageVisible}
            onChange={checked => setOriginImageVisible(checked)}
          />
        </div>
        <div className="info-item">
          <span className="info-item-title">{t('Render Mode')}:</span>
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
          <p>
            {t('Process Module')}: {state.moduleList.length ? '' : t('None')}
          </p>
          <ul>
            {state.moduleList.map((module, index) => (
              <li key={index}>
                {t(module.name)}
                {module.repeat > 1 ? ' (×' + module.repeat + ')' : ''}
              </li>
            ))}
          </ul>
          <button className="reset-btn" onClick={resetModule}>
            {t('Reset')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default WebGLCanvas;
