import { useContext } from 'react';
import { globalContext } from '../../store';
import grayscale from '../../canvas/grayscale';
import thresholding from '../../canvas/thresholding';
import './index.css';
import { loadImage } from '../../canvas/utils';

function FunctionButton(props) {
  const {
    text,
    processFn,
    moduleName,
  } = props;
  const { state, dispatch } = useContext(globalContext);

  function handleClick() {
    // console.log(state);
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
      <ul>
        <li>
          <FunctionButton text="转灰度" processFn={grayscale} moduleName="grayscale" />
        </li>
        <li>
          <FunctionButton text="二值化" processFn={thresholding} moduleName="thresholding" />
        </li>
      </ul> 
    </div>
  );
}

export default ToolBox;
