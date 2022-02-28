import { useContext, useEffect, useState } from 'react';
import { Popover, Modal, Input, message } from 'antd';
import { globalContext } from '../../store';
import { getNewFileHandle, writeFile } from '../../utils/file';
import { monaco } from '../../monaco-editor';
import { setCustomModule } from '../../utils/idb';
import { runCustomModule } from '../../utils/custom-module';
import demoCode from './demo-code?raw';

import './index.css';

function CodeEditor() {
  const { state, dispatch } = useContext(globalContext);

  const isRunnable = state.mode === 'canvas' ? true : false;

  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [customModuleName, setCustomModuleName] = useState('');

  useEffect(() => {
    if (!window.editor) {
      window.editor = monaco.editor.create(document.getElementById('code-editor'), {
        value: demoCode,
        language: 'javascript',
        tabSize: 2,
        minimap: { enabled: false },
        automaticLayout: true,
        fontSize: 13,
      });
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
      <div className="code-editor-header">
        {/* <span>编辑器</span> */}
      </div>
      <div id="code-editor"></div>
      <div className="code-editor-menu">
        <button
          type="button"
          className={'run ' + (isRunnable ? '' : 'disable')}
          onClick={handleClickRun}
        >
          运行
        </button>
        <Popover
          overlayClassName="save-code-popover"
          overlayStyle={{ paddingBottom: '0' }}
          trigger="click"
          content={
            <div className="popover-card">
              <button onClick={handleClickSaveAsFile}>文件</button>
              <button onClick={() => setSaveModalVisible(true)}>自定义模块</button>
            </div>
          }>
          <button type="button" className="save">
            保存为
          </button>
        </Popover>
      </div>

      <Modal
        title="保存为自定义模块"
        visible={saveModalVisible}
        width={300}
        okText="确认"
        onOk={handleClickSaveAsModule}
        cancelText="取消"
        onCancel={() => setSaveModalVisible(false)}
      >
        <Input 
          placeholder="模块名称"
          value={customModuleName}
          onChange={e => setCustomModuleName(e.target.value)}
        />
      </Modal>
    </div>
  );
}

export default CodeEditor;
