import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

// Konten tersembunyi hanya setelah JS berjalan, jadi tetap terlihat jika script gagal.
document.documentElement.classList.add('js-ready');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);