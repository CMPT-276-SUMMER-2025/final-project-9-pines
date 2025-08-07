import React from "react";
import { Menu } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import LogoBlue from "../assets/logoblue.png";

/**
 * Header component: renders the app title, menu toggle, and language selector.
 *
 * Props:
 * - onMenuToggle: function to open/close sidebar
 */
export default function Header({ onMenuToggle }) {
  const { language, setLanguage, t } = useLanguage();

  /**
   * Handles language selection change
   * @param {Event} event - The change event from the select element
   */
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

      {/* App title with logo */}
      <div className="header-title">
        <img 
          src={LogoBlue}
          alt="Gym Whisper" 
          className="header-logo"
          onError={(e) => {
            // Fallback to text if image fails to load
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
        <h1 style={{ display: 'none' }}>{t('title')}</h1>
      </div>

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
