import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Suppress browser extension errors
const originalError = console.error;
console.error = (...args) => {
  const message = args[0];
  if (typeof message === 'string') {
    // Suppress browser extension errors
    if (message.includes('content-all.js') || 
        message.includes('save-page-from-contextmenu') ||
        message.includes('runtime.lastError')) {
      return;
    }
  }
  originalError.apply(console, args);
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
