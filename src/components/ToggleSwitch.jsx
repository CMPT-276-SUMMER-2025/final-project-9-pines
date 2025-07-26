// Dark/Light mode circular toggle switch
// Used inside Sidebar

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