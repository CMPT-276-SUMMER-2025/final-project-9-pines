/**
 * ToggleSwitch component: Dark/Light mode circular toggle switch
 * Used inside Sidebar for theme switching
 * 
 * Props:
 * - isDark: boolean indicating current dark mode state
 * - onToggle: function to toggle between light and dark modes
 */
export default function ToggleSwitch({ isDark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle dark mode"
      className={`toggle-switch${isDark ? " dark" : ""}`}
    >
      <span className={`thumb${isDark ? " dark" : ""}`} />
    </button>
  );
}