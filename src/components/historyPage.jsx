import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header-';
import Sidebar from './Side-bar';
import { useLanguage } from '../contexts/LanguageContext';

// Import the Gemini summarize API
import { summarizeWorkoutCSV } from '../llm/gemini';

/**
 * HistoryPage component: Displays workout history and provides summary functionality
 * 
 * Features:
 * - Loads workout history from localStorage
 * - Displays workout entries in a table format
 * - Provides AI-powered workout summary
 * - Allows CSV export of workout data
 */
export default function HistoryPage() {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [isDark, setIsDark] = React.useState(() => {
    // Initialize dark mode from localStorage or system preference
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [workoutHistory, setWorkoutHistory] = React.useState([]);
  const [showSummary, setShowSummary] = React.useState(false);
  const [summaryText, setSummaryText] = React.useState('');
  const [loadingSummary, setLoadingSummary] = React.useState(false);
  const [summaryError, setSummaryError] = React.useState('');

  /**
   * Generates and triggers download of a CSV file from workout history
   */
  function downloadCSVWorkoutData(){
    // Generates and triggers download of a CSV file from workoutData
    if (!workoutHistory || workoutHistory.length === 0) {
      alert("No workout data to export.");
      return;
    }

    // Prepare CSV header and rows
    const header = "workoutType,Reps,Weight";
    const rows = workoutHistory?.map(row => {
      // If already CSV, just return; else, try to join array
      if (typeof row === "string") return row;
      if (Array.isArray(row)) return row.join(",");
      return "";
    });
    const csvContent = [header, ...rows].join("\r\n");

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "workout_data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return null
  }

  /**
   * Toggle dark mode on <html> element and save to localStorage
   */
  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem('darkMode', JSON.stringify(isDark));
  }, [isDark]);

  /**
   * Load workout history from localStorage on component mount
   */
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("gymWhisperData");
      if (raw) {
        const data = JSON.parse(raw);
        // Data is stored as an array of arrays: [["PushUp,15,Bodyweight,2025-08-06"]]
        if (Array.isArray(data)) {
          // Flatten the array of arrays into a single array of workout entries
          const flattenedData = data.flat();
          setWorkoutHistory(flattenedData);
        } else {
          setWorkoutHistory([]);
        }
      } else {
        setWorkoutHistory([]);
      }
    } catch (e) {
      console.error("Failed to parse workout history:", e);
      setWorkoutHistory([]);
    }
  }, []);

  /**
   * Handles the summary button click and generates AI summary
   */
  async function handleShowSummary() {
    setLoadingSummary(true);
    setSummaryError('');
    setShowSummary(true);
    try {
      // Only pass string entries to the API, or convert objects to CSV strings
      const csvRows = workoutHistory.map(entry => {
        if (typeof entry === "string") return entry;
        if (entry && typeof entry === "object") {
          // Try to convert object to CSV string
          const workoutType = entry.workoutType || entry.type || '';
          const reps = entry.reps || entry.repetitions || '';
          const weight = entry.weight || '';
          // Date is optional for summary
          return [workoutType, reps, weight].join(',');
        }
        return '';
      }).filter(Boolean);

      const response = await summarizeWorkoutCSV(csvRows);
      if (response && response.summary) {
        setSummaryText(response.summary);
      } else if (response && response.error) {
        setSummaryError(response.error);
      } else {
        setSummaryError("Failed to get summary.");
      }
    } catch (e) {
      setSummaryError("An error occurred while summarizing.");
    } finally {
      setLoadingSummary(false);
    }
  }

  /**
   * Closes the summary popup and resets state
   */
  function handleCloseSummary() {
    setShowSummary(false);
    setSummaryText('');
    setSummaryError('');
  }

  /**
   * Handles clicking outside the sidebar to close it
   */
  const handleSidebarOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setMenuOpen(false);
    }
  };

  return (
    <div className="app">
      {/* Top gradient overlay */}
      <div className="top-gradient" />

      {/* Sidebar overlay for click-outside-to-close */}
      <div 
        className={`sidebar-overlay${menuOpen ? " open" : ""}`}
        onClick={handleSidebarOverlayClick}
      />

      {/* Sidebar */}
      <Sidebar
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        isDark={isDark}
        setIsDark={setIsDark}
      />

      {/* Header */}
      <Header onMenuToggle={() => setMenuOpen(m => !m)} />

      {/* Main Content */}
      <main className="main">
        <div className="history-container">
          <h1>{t('workoutHistory')}</h1>
          <p>{t('viewPastSessions')}</p>
          
        

          {/* Summary popup/modal */}
          {showSummary && (
            <div
              className="summary-popup"
              style={{
                position: "fixed",
                top: 0, left: 0, right: 0, bottom: 0,
                background: "rgba(0,0,0,0.4)",
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Workout Summary"
            >
              <div
                style={{
                  borderRadius: "16px",
                  padding: "2rem",
                  maxWidth: "90vw",
                  maxHeight: "80vh",
                  overflowY: "auto",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                  minWidth: "300px"
                }}
              >
                <h2 style={{marginTop:0}}>{t('workoutSummary')}</h2>
                {loadingSummary ? (
                  <p>Loading summary...</p>
                ) : summaryError ? (
                  <p style={{color: "red"}}>{summaryError}</p>
                ) : (
                  <p style={{whiteSpace: "pre-line"}}>{summaryText}</p>
                )}
                <button
                  onClick={handleCloseSummary}
                  style={{
                    marginTop: "1.5rem",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease"
                  }}
                  aria-label="Close Summary"
                >
                  {t('close')}
                </button>
              </div>
            </div>
          )}

          {workoutHistory.length === 0 ? (
            <div className="empty-history">
              <p>{t('noHistoryFound')}</p>
              <p>{t('completeWorkouts')}</p>
            </div>
          ) : (
            <div className="history-table-wrapper">
              <table className="workout-table" role="grid" aria-label="Workout history">
                <thead>
                  <tr>
                    <th scope="col">{t('workoutType')}</th>
                    <th scope="col">{t('reps')}</th>
                    <th scope="col">{t('weight')}</th>
                    <th scope="col">{t('date')}</th>
                  </tr>
                </thead>
                <tbody>
                  {workoutHistory.map((entry, idx) => {
                    // Handle different data formats
                    let workoutType, reps, weight, date;
                    
                    if (typeof entry === 'string') {
                      // If entry is a CSV string like "BenchPress,10,135lbs"
                      const parts = entry.split(',');
                      workoutType = parts[0] || '';
                      reps = parts[1] || '';
                      weight = parts[2] || '';
                      date = parts[3];
                    } else if (entry && typeof entry === 'object') {
                      // If entry is an object
                      workoutType = entry.workoutType || entry.type || '';
                      reps = entry.reps || entry.repetitions || '';
                      weight = entry.weight || '';
                      date = entry.date || entry.timestamp || 'N/A';
                    } else {
                      workoutType = 'Unknown';
                      reps = '';
                      weight = '';
                      date = 'N/A';
                    }

                    return (
                      <tr key={idx}>
                        <td>{workoutType}</td>
                        <td>{reps}</td>
                        <td>{weight}</td>
                        <td>{date}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
            
              <Link to="/" className="back-btn" style={{ flexShrink: 0 }}>
                {t('backToHome')}
              </Link>

              {/* Show summary button and back link side by side */}
              {workoutHistory && workoutHistory.length > 0 && (
                <button
                  className="summary-btn"
                  onClick={handleShowSummary}
                  disabled={loadingSummary}
                  aria-label="Summarize Workout History"
                  style={{marginLeft: "10%"}}
                >
                  {loadingSummary ? "Summarizing..." : t('summarizeWorkoutHistory')}
                </button>
              )}
        </div>
      </main>
    </div>
  );
}