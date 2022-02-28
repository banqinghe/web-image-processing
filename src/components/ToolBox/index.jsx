import { useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { message } from 'antd';
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

import { runCustomModule } from '../../utils/custom-module';
import { deleteCustomModule, getCustomModule } from '../../utils/idb';
import { climbToWindow } from '../../utils/dom';

import './index.css';

function FunctionButton(props) {
  const {
    text,
    processFn,
    moduleName,
  } = props;
  const { state, dispatch } = useContext(globalContext);

  function handleClick() {
    if (state.mode !== 'webgl') {
      return;
    }
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

function ModuleContextMenu(props) {
  const { visible, moduleName, x, y } = props.status;
  const { onCancel, onDelete, onImport, onExecute } = props;

  function handleClickWindow(e) {
    climbToWindow(
      e.target,
      el => el.classList.contains('module-context-menu'),
      onCancel,
    );
  }

  useEffect(() => {
    window.addEventListener('click', handleClickWindow);
    return () => {
      window.removeEventListener('click', handleClickWindow)
    }
  }, []);

  return ReactDOM.createPortal(
    <div
      className={'module-context-menu' + (visible ? ' visible' : '')}
      style={{ top: y, left: x }}
    >
      <button onClick={onExecute}>执行</button>
      <button onClick={onDelete}>删除</button>
      <button onClick={onImport}>显示源代码</button>
    </div>,
    document.body
  );
}

function ToolBox() {
  const { state, dispatch } = useContext(globalContext);

  const [contextMenu, setContextMenu] = useState({ visible: false, moduleName: '' });

  function hiddenContextMenu() {
    setContextMenu(prev => ({ ...prev, visible: false }));
  }

  async function handleRunCustomModule(moduleName) {
    if (contextMenu.visible) {
      hiddenContextMenu();
    }

    if (state.mode !== 'canvas') {
      message.info('自定义模块需在 Canvas 模式执行');
      return;
    }

    const code = await getCustomModule(moduleName);
    runCustomModule(state.ctx, code, dispatch, message.info);
  }

  async function handleContextMenu(e, moduleName) {
    e.preventDefault();
    setContextMenu({ visible: true, moduleName, x: e.clientX, y: e.clientY });
  }

  function handleDeleteModule() {
    hiddenContextMenu();
    deleteCustomModule(contextMenu.moduleName);
    dispatch({
      type: 'module/deleteCustom',
      payload: contextMenu.moduleName,
    });
  }

  function handleImportSource() {
    hiddenContextMenu();
    getCustomModule(contextMenu.moduleName)
      .then(code => {
        window.editor.setValue(code);
      });
  }

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

      {state.savedModuleList.length > 0 &&
        <div className="custom-module-title"><span>自定义模块</span></div>
      }
      <ul id="saved-module-list">
        {state.savedModuleList.map(name => (
          <li key={name}>
            <button
              className="function-button"
              onClick={() => handleRunCustomModule(name)}
              onContextMenu={e => handleContextMenu(e, name)}
            >
              {name}
            </button>
          </li>
        ))}
      </ul>

      <ModuleContextMenu
        status={contextMenu}
        onDelete={handleDeleteModule}
        onImport={handleImportSource}
        onExecute={() => handleRunCustomModule(contextMenu.moduleName)}
        onCancel={hiddenContextMenu}
      />
    </div>
  );
}

export default ToolBox;
