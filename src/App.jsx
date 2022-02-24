import HeaderMenu from './components/HeaderMenu';
import HorizonResizable from './components/HorizonResizable';
import WebGLCanvas from './components/WebGLCanvas';
import ToolSideBar from './components/ToolSideBar';
import { GlobalProvider } from './store';

import 'antd/dist/antd.css';
import './App.css';

function App() {
  return (
    <GlobalProvider>
      <div className="app">
        <HeaderMenu />
        <main className="main-body">
          <HorizonResizable defaultWidthList={['30%', '70%']}>
            <ToolSideBar />
            <WebGLCanvas />
          </HorizonResizable>
        </main>
      </div>
    </GlobalProvider>
  );
}

export default App;
