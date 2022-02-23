import { useContext, useEffect, useRef } from 'react';
import { globalContext } from '../../store';
import { monaco } from '../../monaco-editor';
import preCode from './pre-code?raw';
import sufCode from './suf-code?raw';
import demoCode from './demo-code?raw';

import './index.css';

function CodeEditor() {
  const { state, dispatch } = useContext(globalContext);

  const isRunnable = state.mode === 'canvas' ? true : false;

  const editor = useRef(null);

  useEffect(() => {
    editor.current = monaco.editor.create(document.getElementById('code-editor'), {
      value: demoCode,
      language: 'javascript',
      tabSize: 2,
      minimap: { enabled: false },
      automaticLayout: true,
      fontSize: 13,
    });
    window.editor = editor.current;
  }, []);

  function handleClickRun() {
    if (!isRunnable) {
      return;
    }
    const source = editor.current.getValue();
    const processFn = new Function('ctx', preCode + source + sufCode);
    processFn(state.ctx);
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
        <button type="button" className="save">保存</button>
      </div>
    </div>
  );
}

export default CodeEditor;
