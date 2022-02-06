import { useContext, useState, useEffect, useRef } from 'react';
import { globalContext } from '../../store';
import { loadImage } from '../../canvas/utils';
import renderImage from '../../canvas/render-image'

import './index.css';

function WebGLCanvas() {
  const { state, dispatch } = useContext(globalContext);

  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);

  // canvas 元素大小自适应
  function updateCanvasDom(image) {
    const { width, height } = image;
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
    canvasRef.current.style.width = width * scaleRadio + 'px';
    canvasRef.current.style.height = height * scaleRadio + 'px';
    const ctx = canvasRef.current.getContext('webgl2', { preserveDrawingBuffer: true });
    dispatch({
      type: 'canvas/updateCtx',
      payload: ctx,
    });
    renderImage(ctx, image);
  };

  useEffect(() => {
    // console.log('imageUrl change');
    loadImage(state.imageUrl)
      .then(updateCanvasDom)
      .catch(console.error);
  }, [state.imageUrl]);

  // useEffect(() => {

  // }, [state.currentImageUrl]);

  return (
    <div id="canvas-container" ref={canvasContainerRef}>
      {/* <canvas id="render-canvas" /> */}
    </div>
  );
}

export default WebGLCanvas;
