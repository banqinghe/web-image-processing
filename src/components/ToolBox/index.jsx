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
import { getText } from '../../i18n';

import './index.css';

/**
 * WebGL 处理模块功能按钮
 */
function FunctionButton(props) {
  const { text, processFn, moduleName } = props;
  const { state, dispatch } = useContext(globalContext);
  const t = getText(state.i18n);

  function handleClick() {
    if (state.mode !== 'webgl') {
      message.info(t('Preset modules need to be executed in WebGL mode'));
      return;
    }
    loadImage(state.currentImageUrl)
      .then(image => {
        // 1. process image
        // 2. save module info

        processFn(state.ctx, image);

        // ------------ PERFORMANCE TEST BEGIN: toBlob duration ------------
        let startTime = performance.now();

        state.ctx.canvas.toBlob(blob => {
          // FIXME: 导致重置原图图片无法加载
          // URL.revokeObjectURL(state.currentImageUrl);

          console.log('load blob duration:', performance.now() - startTime);
          // ---------------- PERFORMANCE TEST END ----------------

          dispatch({
            type: 'canvas/updateProcessModule',
            payload: {
              currentImageUrl: URL.createObjectURL(blob),
              processModule: {
                name: moduleName,
                originImage: image,
                processFn,
              },
            },
          });
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

/**
 * 自定义模块按钮的 context menu
 */
function ModuleContextMenu(props) {
  const { visible, x, y } = props.status;
  const { onCancel, onDelete, onImport, onExecute } = props;
  const { state } = useContext(globalContext);
  const t = getText(state.i18n);

  function handleClickWindow(e) {
    climbToWindow(
      e.target,
      el => el.classList.contains('module-context-menu'),
      onCancel
    );
  }

  useEffect(() => {
    window.addEventListener('click', handleClickWindow);
    return () => {
      window.removeEventListener('click', handleClickWindow);
    };
  }, []);

  return ReactDOM.createPortal(
    <div
      className={'module-context-menu' + (visible ? ' visible' : '')}
      style={{ top: y, left: x }}
    >
      <button onClick={onExecute}>{t('Execute')}</button>
      <button onClick={onDelete}>{t('Delete')}</button>
      <button onClick={onImport}>{t('Display Source')}</button>
    </div>,
    document.body
  );
}

/**
 * 工具栏
 */
function ToolBox() {
  const { state, dispatch } = useContext(globalContext);
  const t = getText(state.i18n);

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    moduleName: '',
  });

  function hiddenContextMenu() {
    setContextMenu(prev => ({ ...prev, visible: false }));
  }

  async function handleRunCustomModule(moduleName) {
    if (contextMenu.visible) {
      hiddenContextMenu();
    }

    if (state.mode !== 'canvas') {
      message.info(t('Custom modules need to be executed in Canvas mode'));
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
    getCustomModule(contextMenu.moduleName).then(code => {
      window.editor.setValue(code);
    });
  }

  return (
    <div className="toolbox">
      <div className="toolbox-title">{t('Tool Bar')}</div>
      <ul>
        <li>
          <FunctionButton
            text={t('Grayscale')}
            processFn={grayscale}
            moduleName="Grayscale"
          />
        </li>
        <li>
          <FunctionButton
            text={t('Thresholding')}
            processFn={thresholding}
            moduleName="Thresholding"
          />
        </li>
        <li>
          <FunctionButton
            text={t('Invert Color')}
            processFn={invertColor}
            moduleName="Invert Color"
          />
        </li>
        <li>
          <FunctionButton text="Sobel" processFn={sobel} moduleName="Sobel" />
        </li>
        <li>
          <FunctionButton
            text="Prewitt"
            processFn={prewitt}
            moduleName="Prewitt"
          />
        </li>
        <li>
          <FunctionButton
            text={t('Dilation')}
            processFn={dilation}
            moduleName="Dilation"
          />
        </li>
        <li>
          <FunctionButton
            text={t('Erosion')}
            processFn={erosion}
            moduleName="Erosion"
          />
        </li>
        <li>
          <FunctionButton text={t('Blur')} processFn={blur} moduleName="Blur" />
        </li>
        <li>
          <FunctionButton
            text={t('Sharpen')}
            processFn={sharpen}
            moduleName="Sharpen"
          />
        </li>
      </ul>

      {state.savedModuleList.length > 0 && (
        <div className="custom-module-title">
          <span>{t('Custom Module')}</span>
        </div>
      )}
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
