import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom'; // Import React Router
import App from './App'; // Import the App component

const rootElement = document.getElementById('root') as HTMLElement;

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
} else {
  console.error('Root element not found');
}
