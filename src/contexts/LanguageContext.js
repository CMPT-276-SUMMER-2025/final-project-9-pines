/**
 * @fileoverview Language Context for internationalization (i18n) support.
 * 
 * This context provides language state management and translation functionality
 * throughout the application. It supports English and French languages with
 * automatic persistence of language preference in localStorage.
 * 
 * The context includes:
 * - Current language state (en/fr)
 * - Language switching functionality
 * - Translation function (t) for accessing localized text
 * - Automatic language preference persistence
 * 
 * @author GymWhisper Team
 * @version 1.0.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTranslation } from '../locales/translations';

// Create the language context
const LanguageContext = createContext();

/**
 * Custom hook to access the language context.
 * 
 * @returns {Object} The language context containing language state and translation function
 * @throws {Error} When used outside of LanguageProvider
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

/**
 * Language Provider component that wraps the application to provide
 * internationalization capabilities.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped
 * @returns {JSX.Element} The provider component with language context
 */
export const LanguageProvider = ({ children }) => {
  // Initialize language from localStorage or default to English
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'en';
  });

  // Save language preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function that returns text in the current language
  const t = (key) => getTranslation(language, key);

  // Toggle between English and French
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fr' : 'en');
  };

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 