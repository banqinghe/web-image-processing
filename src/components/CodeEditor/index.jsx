import { useContext, useEffect, useState } from 'react';
import { Popover, Modal, Input, message } from 'antd';
import { globalContext } from '../../store';
import { getNewFileHandle, writeFile } from '../../utils/file';
import { monaco } from '../../monaco-editor';
import { setCustomModule } from '../../utils/idb';
import { runCustomModule } from '../../utils/custom-module';
import { getText } from '../../i18n';
import demoCode from './demo-code?raw';

import './index.css';

function CodeEditor() {
  const { state, dispatch } = useContext(globalContext);
  const t = getText(state.i18n);

  const isRunnable = state.mode === 'canvas' ? true : false;

  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [customModuleName, setCustomModuleName] = useState('');

  useEffect(() => {
    if (!window.editor) {
      window.editor = monaco.editor.create(
        document.getElementById('code-editor'),
        {
          value: demoCode,
          language: 'javascript',
          tabSize: 2,
          minimap: { enabled: false },
          automaticLayout: true,
          fontSize: 13,
        }
      );
    }
  }, []);

  function handleClickRun() {
    if (!isRunnable) {
      return;
    }
    const source = window.editor.getValue();
    runCustomModule(state.ctx, source, dispatch, message.info);
  }

  // 将自定义代码保存为文件
  async function handleClickSaveAsFile() {
    const fileHandle = await getNewFileHandle('Custom-Process-Code');
    await writeFile(fileHandle, window.editor.getValue());
  }

  function handleClickSaveAsModule() {
    setCustomModule(customModuleName, window.editor.getValue());
    dispatch({
      type: 'module/saveCustom',
      payload: customModuleName,
    });
    setSaveModalVisible(false);
  }

  return (
    <div className="code-editor-container">
      <div id="code-editor"></div>
      <div className="code-editor-menu">
        <button
          type="button"
          className={'run ' + (isRunnable ? '' : 'disable')}
          onClick={handleClickRun}
        >
          {t('Run')}
        </button>
        <Popover
          overlayClassName="save-code-popover"
          overlayStyle={{ paddingBottom: '0' }}
          trigger="click"
          content={
            <div className="popover-card">
              <button onClick={handleClickSaveAsFile}>{t('File')}</button>
              <button onClick={() => setSaveModalVisible(true)}>
                {t('Custom Module')}
              </button>
            </div>
          }
        >
          <button type="button" className="save">
            {t('Save As')}
          </button>
        </Popover>
      </div>

      <Modal
        title={t('Save As A Custom Module')}
        visible={saveModalVisible}
        width={300}
        okText={t('OK')}
        onOk={handleClickSaveAsModule}
        cancelText={t('Cancel')}
        onCancel={() => setSaveModalVisible(false)}
      >
        <Input
          placeholder={t('Module Name')}
          value={customModuleName}
          onChange={e => setCustomModuleName(e.target.value)}
        />
      </Modal>
    </div>
  );
}

export default CodeEditor;
