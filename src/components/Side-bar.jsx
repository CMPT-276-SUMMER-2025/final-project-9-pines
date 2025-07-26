// Sidebar.jsx
import { ArrowLeft } from "lucide-react"; // Icon for closing the sidebar
import ToggleSwitch from "./ToggleSwitch"; // Custom toggle component for dark/light mode

// Sidebar component receives state and toggle functions as props from App.jsx
export default function Sidebar({ menuOpen, setMenuOpen, isDark, setIsDark }) {
  return (
    // Apply 'open' class when sidebar is active
    <aside className={`sidebar${menuOpen ? " open" : ""}`}>
      {/* Header with close button and title */}
      <div className="sidebar-header">
        <button
          onClick={() => setMenuOpen(false)} // Close sidebar on click
          className="icon-btn"
          aria-label="Close menu"
        >
          <ArrowLeft size={24} /> {/* Left arrow icon */}
        </button>
        <h2>Menu</h2>
      </div>

      {/* Navigation section */}
      <nav className="sidebar-nav">
        {/* Navigation link for tutorials (currently dummy link) */}
        <button className="nav-link" onClick={() => window.open("#", "_self")}>
          Tutorials
        </button>

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
