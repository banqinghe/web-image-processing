import React, { useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { message } from 'antd';
import { globalContext } from '@/store';
import grayscale from '@/canvas/grayscale';
import thresholding from '@/canvas/thresholding';
import invertColor from '@/canvas/invert-color';
import sobel from '@/canvas/sobel';
import prewitt from '@/canvas/prewitt';
import dilation from '@/canvas/dilation';
import erosion from '@/canvas/erosion';
import blur from '@/canvas/blur';
import sharpen from '@/canvas/sharpen';
import { loadImage } from '@/canvas/utils';
import cn from 'classnames';

import { runCustomModule } from '@/utils/custom-module';
import { deleteCustomModule, getCustomModule } from '@/utils/idb';
import { climbToWindow } from '@/utils/dom';
import { getText } from '@/i18n';

export interface FunctionButtonProps {
  text: string;
  processFn: (
    ctx: WebGL2RenderingContext,
    image: HTMLImageElement,
    customValue?: any
  ) => void;
  moduleName: string;
}

/**
 * WebGL 处理模块功能按钮
 */
function FunctionButton(props: FunctionButtonProps) {
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
    <button
      className="w-full px-3 py-1.5 bg-[var(--btn-bg)] rounded whitespace-nowrap hover:bg-[var(--btn-hover-bg)]"
      onClick={handleClick}
    >
      {text}
    </button>
  );
}

export interface ModuleContextMenuProps {
  status: { visible: boolean; x: number; y: number };
  onCancel: () => void;
  onDelete: () => void;
  onImport: () => void;
  onExecute: () => void;
}

/**
 * 自定义模块按钮的 context menu
 */
function ModuleContextMenu(props: ModuleContextMenuProps) {
  const { visible, x, y } = props.status;
  const { onCancel, onDelete, onImport, onExecute } = props;
  const { state } = useContext(globalContext);
  const t = getText(state.i18n);

  const handleClickWindow = (e: MouseEvent) => {
    climbToWindow(
      e.target as Element,
      el => el.classList.contains('module-context-menu'),
      onCancel
    );
  };

  useEffect(() => {
    window.addEventListener('click', handleClickWindow);
    return () => {
      window.removeEventListener('click', handleClickWindow);
    };
  }, []);

  const Button = ({
    onClick,
    children,
  }: React.PropsWithChildren<{
    onClick: React.MouseEventHandler<HTMLButtonElement>;
  }>) => (
    <button
      className="block py-1.5 px-3 w-full text-[13px] text-left hover:bg-[var(--btn-hover-bg)]"
      onClick={onClick}
    >
      {children}
    </button>
  );

  return ReactDOM.createPortal(
    <div
      className={cn(
        'module-context-menu absolute z-100 bg-white border rounded children:[block px-3]',
        visible ? 'block' : 'hidden'
      )}
      style={{ top: y, left: x }}
    >
      <Button onClick={onExecute}>{t('Execute')}</Button>
      <Button onClick={onDelete}>{t('Delete')}</Button>
      <Button onClick={onImport}>{t('Display Source')}</Button>
    </div>,
    document.body
  );
}

/**
 * 工具栏
 */
export default function ToolBox() {
  const { state, dispatch } = useContext(globalContext);
  const t = getText(state.i18n);

  // prettier-ignore
  const presetModules = [
    { text: t('Grayscale'), processFn: grayscale, moduleName: 'Grayscale' },
    { text: t('Thresholding'), processFn: thresholding, moduleName: 'Thresholding'},
    { text: t('Invert Color'), processFn: invertColor, moduleName: 'Invert Color'},
    { text: t('Sobel'), processFn: sobel, moduleName: 'Sobel' },
    { text: t('Prewitt'), processFn: prewitt, moduleName: 'Prewitt' },
    { text: t('Dilation'), processFn: dilation, moduleName: 'Dilation' },
    { text: t('Erosion'), processFn: erosion, moduleName: 'Erosion' },
    { text: t('Blur'), processFn: blur, moduleName: 'Blur' },
    { text: t('Sharpen'), processFn: sharpen, moduleName: 'Sharpen' },
  ];

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    moduleName: '',
    x: 0,
    y: 0,
  });

  const hiddenContextMenu = () => {
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  const handleRunCustomModule = async (moduleName: string) => {
    if (contextMenu.visible) {
      hiddenContextMenu();
    }

    if (state.mode !== 'canvas') {
      message.info(t('Custom modules need to be executed in Canvas mode'));
      return;
    }

    const code = await getCustomModule(moduleName);
    runCustomModule(state.ctx, code, dispatch, message.info);
  };

  const handleContextMenu = async (e, moduleName: string) => {
    e.preventDefault();
    setContextMenu({ visible: true, moduleName, x: e.clientX, y: e.clientY });
  };

  const handleDeleteModule = () => {
    hiddenContextMenu();
    deleteCustomModule(contextMenu.moduleName);
    dispatch({
      type: 'module/deleteCustom',
      payload: contextMenu.moduleName,
    });
  };

  const handleImportSource = () => {
    hiddenContextMenu();
    getCustomModule(contextMenu.moduleName).then(code => {
      window.editor.setValue(code);
    });
  };

  return (
    <div className="toolbox relative h-full">
      <div className="sticky top-0 px-1.5 py-0.5 flex-shrink-0 bg-[var(--divider-bg)] text-[var(--divider-text)] text-xs font-bold">
        {t('Tool Bar')}
      </div>
      {/* TODO: divider 宽度最好是一个变量的形式 */}
      <div className="h-[calc(100%-20px)] overflow-auto">
        <ul className="px-3 py-1.5 grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2.5">
          {presetModules.map(module => (
            <li key={module.moduleName}>
              <FunctionButton
                text={module.text}
                processFn={module.processFn}
                moduleName={module.moduleName}
              />
            </li>
          ))}
        </ul>

        {state.savedModuleList.length > 0 && (
          <div className="mt-4 border-b border-gray-100">
            <span className="inline-block py-0 px-2 leading-6 bg-[var(--title-bg)] text-[13px]">
              {t('Custom Module')}
            </span>
          </div>
        )}
        <ul className="px-3 py-1.5 grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2.5">
          {state.savedModuleList.map((name: string) => (
            <li key={name}>
              <button
                className="w-full px-3 py-1.5 bg-[var(--btn-bg)] rounded whitespace-nowrap hover:bg-[var(--btn-hover-bg)]"
                onClick={() => handleRunCustomModule(name)}
                onContextMenu={e => handleContextMenu(e, name)}
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      </div>

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
