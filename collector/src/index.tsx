import React from 'react';
import ReactDOM from 'react-dom/client';

import "./index.css";
import App from './App';
import { setupTray } from './traySetup';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if(nw){
  console.log(nw);
  setupTray();
}