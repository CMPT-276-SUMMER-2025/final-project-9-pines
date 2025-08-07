// Sidebar.jsx
import { ArrowLeft } from "lucide-react"; // Icon for closing the sidebar
import { Link } from "react-router-dom"; // For navigation
import ToggleSwitch from "./ToggleSwitch"; // Custom toggle component for dark/light mode
import { useLanguage } from '../contexts/LanguageContext';

// Sidebar component receives state and toggle functions as props from App.jsx
export default function Sidebar({ menuOpen, setMenuOpen, isDark, setIsDark }) {
  const { t } = useLanguage();
  return (
    // Apply 'open' class when sidebar is active
    <aside className={`sidebar${menuOpen ? " open" : ""}`}>
      {/* Header with close button and title */}
      <div className="sidebar-header">
        <button
          onClick={() => setMenuOpen(false)} // Close sidebar on click
          className="icon-btn"
          aria-label={t('closeMenu')}
        >
          <ArrowLeft size={24} /> {/* Left arrow icon */}
        </button>
        <h2>{t('menu')}</h2>
      </div>

      {/* Navigation section */}
      <nav className="sidebar-nav">
        {/* Navigation links */}
        <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
          {t('home')}
        </Link>
        
        <Link to="/history" className="nav-link" onClick={() => setMenuOpen(false)}>
          {t('history')}
        </Link>

        {/* Dark mode toggle row with sun/moon icons */}
        <div className="dark-toggle-row">
          <span>🌞</span> {/* Light mode icon */}
          <ToggleSwitch
            isDark={isDark}
            onToggle={() => setIsDark(d => !d)} // Toggle dark mode state
          />
          <span>🌙</span> {/* Dark mode icon */}
        </div>
      </nav>
    </aside>
  );
}
