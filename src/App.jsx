import { useEffect } from 'react';
import { monaco } from './monaco-editor.ts'

import HorizonResizable from './components/HorizonResizable';
import VerticalResizable from './components/VerticalResizable';

import './App.css';

function App() {

  useEffect(() => {
    window.editor = monaco.editor.create(document.getElementById('code-editor'), {
      value: '',
      language: 'javascript',
      minimap: {
        enabled: false,
      },
      automaticLayout: true,
    });
  }, []);

  const elements = [
    <aside className="tool-bar">
      <VerticalResizable elements={[
        <div>1</div>,
        <div>2</div>,
        <div className="code-editor-container">
          <div className="code-editor-header">
            {/* <button onClick={}>获取值</button> */}
          </div>
          <div id="code-editor"></div>,
        </div>
      ]} />
    </aside>,
    <div className="canvas-container">
      <canvas width="600" height="400"></canvas>
    </div>,
  ];

  return (
    <div className="app">
      <div className="header-bar">
        <button>文件</button>
      </div>
      <main className="main-body">
        <HorizonResizable elements={elements} defaultWidthList={['30%', '60%']} />
      </main>
    </div>
  );
}

export default App

