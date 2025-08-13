import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './ErrorBoundary.jsx'; // 1. Import the ErrorBoundary
import './index.css';

// The root element where the React app will be mounted.
const rootElement = document.getElementById('root');

// Create a root for the React application.
const root = ReactDOM.createRoot(rootElement);

// Render the application.
// The <App /> component is now a child of <ErrorBoundary />.
// Any runtime error occurring in App or any of its descendants will be
// caught by the ErrorBoundary.
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
