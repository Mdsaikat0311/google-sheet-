import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global error listener to assist debugging if any asset fails to load
window.addEventListener('error', (event) => {
  console.warn('Global error detected:', event.message);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
