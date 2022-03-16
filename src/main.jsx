import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { GlobalProvider } from './store';

import { registerSW } from 'virtual:pwa-register';
import CanvasWorker from './canvas-worker?worker';

const intervalMS = 60 * 60 * 1000;

const updateSW = registerSW({
  // automatically update every hour
  onRegistered(r) {
    r &&
      setInterval(() => {
        r.update();
      }, intervalMS);
  },
  onNeedRefresh() {
    if (window.confirm('confirm to refresh')) {
      updateSW();
    }
  },
  onOfflineReady() {
    console.log('offline ready');
  },
});

window.canvasWorker = new CanvasWorker();

ReactDOM.render(
  <GlobalProvider>
    <App />
  </GlobalProvider>,
  document.getElementById('root')
);
