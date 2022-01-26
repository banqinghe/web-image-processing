import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'

import { registerSW } from 'virtual:pwa-register';

const intervalMS = 60 * 60 * 1000;

const updateSW = registerSW({
  // automatically update every hour
  onRegistered(r) {
    r && setInterval(() => {
      r.update()
    }, intervalMS)
  },
  onNeedRefresh() {
    if(window.confirm('confirm to refresh')) {
      updateSW();
    }
  },
  onOfflineReady() {
    console.log('offline ready');
    // alert('offline ready')
  },
})

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
