/**
 * @fileoverview Main entry point for the GymWhisper React application.
 * 
 * This file initializes the React application and sets up the necessary providers:
 * - HashRouter: For client-side routing compatible with GitHub Pages
 * - LanguageProvider: For internationalization (English/French) support
 * 
 * The application uses HashRouter instead of BrowserRouter to ensure compatibility
 * with GitHub Pages deployment, which doesn't support server-side routing.
 * 
 * @author GymWhisper Team
 * @version 1.0.0
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './globals.css';
import App from './components/app';
import { LanguageProvider } from './contexts/LanguageContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <HashRouter>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </HashRouter>,
);
