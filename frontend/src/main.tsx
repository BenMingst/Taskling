import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom'; // Import React Router
import App from './App'; // Import the App component

// const rootElement = document.getElementById('root') as HTMLElement;

// thisll create the root elecment, and the ! means that it has to exist. 
// this should make it be routable both in production and development

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
