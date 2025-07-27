import React from "react";
import { Menu } from "lucide-react";

/**
 * Header component: renders the app title, menu toggle, and language selector.
 *
 * Props:
 * - onMenuToggle: function to open/close sidebar
 */
export default function Header({ onMenuToggle }) {
  return (
    <header className="header">
      {/* Menu button */}
      <button
        onClick={onMenuToggle}
        className="icon-btn header-menu-btn"
        aria-label="Toggle menu"
      >
        <Menu size={32} />
      </button>

      {/* App title */}
      <h1>Gym Whisper</h1>

      {/* Language selector */}
      <select className="lang-select" aria-label="Select language">
        <option>EN</option>
        <option>ES</option>
        <option>FR</option>
      </select>
    </header>
  );
}
