import { useContext, useState, useEffect, useRef } from 'react';
import { globalContext } from '../../store';
import renderImage from '../../canvas/render-image'

import './index.css';

function WebGLCanvas() {
  const { state } = useContext(globalContext);

  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);

  useEffect(() => {
    const image = new Image();
    
    image.onload = () => {
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
      renderImage(canvasRef.current.getContext('webgl2'), image);
    };

    image.onerror = () => {
      console.error('Failed to load image');
    };

    image.src = state.imageUrl;
  }, [state]);

  return (
    <div id="canvas-container" ref={canvasContainerRef}>
      {/* <canvas id="render-canvas" /> */}
    </div>
  );
}

export default WebGLCanvas;
