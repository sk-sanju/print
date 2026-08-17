import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/App';
import { PWAService } from './services/pwa.service';
import './styles/index.css';

// Initialize PWA service worker registration
PWAService.initPWA(
  () => {
    console.log('New application content available; refresh to update.');
  },
  () => {
    console.log('App is ready for offline usage.');
  }
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
