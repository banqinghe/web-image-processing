import { useContext } from 'react';
import { globalContext } from '../../store';
import grayscale from '../../canvas/grayscale';
import thresholding from '../../canvas/thresholding';
import invertColor from '../../canvas/invert-color';
import sobel from '../../canvas/sobel';
import prewitt from '../../canvas/prewitt';
import dilation from '../../canvas/dilation';
import erosion from '../../canvas/erosion';
import blur from '../../canvas/blur';
import sharpen from '../../canvas/sharpen';
import { loadImage } from '../../canvas/utils';

import './index.css';

function FunctionButton(props) {
  const {
    text,
    processFn,
    moduleName,
  } = props;
  const { state, dispatch } = useContext(globalContext);

  function handleClick() {
    loadImage(state.currentImageUrl)
      .then(image => {
        // 1. process image
        // 2. save module info
        processFn(state.ctx, image);
        dispatch({
          type: 'canvas/updateProcessModule',
          payload: {
            currentImageUrl: state.ctx.canvas.toDataURL(),
            processModule: {
              name: moduleName,
              originImage: image,
              processFn,
            },
          },
        });
      })
      .catch(console.error);
  }

  return (
    <button className="function-button" onClick={handleClick}>
      {text}
    </button>
  );
}

function ToolBox() {
  return (
    <div className="toolbox">
      <div className="toolbox-title">工具栏</div>
      <ul>
        <li>
          <FunctionButton text="转灰度" processFn={grayscale} moduleName="grayscale" />
        </li>
        <li>
          <FunctionButton text="二值化" processFn={thresholding} moduleName="thresholding" />
        </li>
        <li>
          <FunctionButton text="反色" processFn={invertColor} moduleName="invert-color" />
        </li>
        <li>
          <FunctionButton text="Sobel" processFn={sobel} moduleName="sobel" />
        </li>
        <li>
          <FunctionButton text="Prewitt" processFn={prewitt} moduleName="prewitt" />
        </li>
        <li>
          <FunctionButton text="膨胀" processFn={dilation} moduleName="dilation" />
        </li>
        <li>
          <FunctionButton text="腐蚀" processFn={erosion} moduleName="erosion" />
        </li>
        <li>
          <FunctionButton text="模糊" processFn={blur} moduleName="blur" />
        </li>
        <li>
          <FunctionButton text="锐化" processFn={sharpen} moduleName="sharpen" />
        </li>
      </ul> 
    </div>
  );
}

export default ToolBox;
