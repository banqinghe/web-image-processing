import { useState } from 'react';
import HorizonResizable from './components/HorizonResizable';
import VerticalResizable from './components/VerticalResizable';

import './App.css';

function App() {
  
  // const [asideWidth, setAsideWidth] = useState('');

  // function 

  const elements = [
    <aside className="tool-bar">
      <VerticalResizable elements={[
        <div>1</div>,
        <div>2</div>,
        <div>3</div>,
      ]} />
    </aside>,
    (<div className="canvas-container">
      <canvas width="600" height="400"></canvas>
    </div>),
  ];

  return (
    <div className="app">
      <div className="header-bar">
        <button>文件</button>
      </div>
      <main className="main-body">
        <HorizonResizable elements={elements} defaultWidthList={['25%', '75%']} />
      </main>
    </div>
  );
}

export default App

