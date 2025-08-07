import React from "react";
import { Menu } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

/**
 * Header component: renders the app title, menu toggle, and language selector.
 *
 * Props:
 * - onMenuToggle: function to open/close sidebar
 */
export default function Header({ onMenuToggle }) {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <header className="header">
      {/* Menu button */}
      <button
        onClick={onMenuToggle}
        className="icon-btn header-menu-btn"
        aria-label={t('closeMenu')}
      >
        <Menu size={32} />
      </button>

      {/* App title */}
      <h1>{t('title')}</h1>

      {/* Language selector */}
      <select 
        className="lang-select" 
        aria-label={t('language')}
        value={language}
        onChange={handleLanguageChange}
      >
        <option value="en">{t('english')}</option>
        <option value="fr">{t('french')}</option>
      </select>
    </header>
  );
}
