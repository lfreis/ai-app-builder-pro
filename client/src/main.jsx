import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Failed to find the root element with ID 'root'. Ensure it exists in your public/index.html file.");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);