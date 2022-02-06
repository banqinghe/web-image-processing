import { useEffect } from 'react';

import HeaderMenu from './components/HeaderMenu';
import HorizonResizable from './components/HorizonResizable';
import VerticalResizable from './components/VerticalResizable';
import WebGLCanvas from './components/WebGLCanvas';
import ToolBox from './components/ToolBox';
import SupportComponent from './components/SupportComponent';
import { monaco } from './monaco-editor'
import { GlobalProvider } from './store';

// TODO: import antd css
import 'antd/dist/antd.css';
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
      <VerticalResizable defaultHeightList={['30%', '15%', '55%']} elements={[
        <ToolBox />,
        <SupportComponent />,
        <div className="code-editor-container">
          <div className="code-editor-header">
            {/* <button onClick={}>获取值</button> */}
          </div>
          <div id="code-editor"></div>,
        </div>
      ]} />
    </aside>,
    <WebGLCanvas />,
  ];

  return (
    <GlobalProvider>
      <div className="app">
        <HeaderMenu />
        <main className="main-body">
          <HorizonResizable elements={elements} defaultWidthList={['30%', '70%']} />
        </main>
      </div>
    </GlobalProvider>
  );
}

export default App

