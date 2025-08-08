import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header-';
import Sidebar from './Side-bar';
import { useLanguage } from '../contexts/LanguageContext';
import { ChevronDown, ChevronRight } from 'lucide-react';

// Import the Gemini summarize API
import { generatePerformanceReport } from '../llm/gemini';

/**
 * HistoryPage component: Displays workout history and provides summary functionality
 * 
 * Features:
 * - Loads workout history from localStorage
 * - Displays workout entries organized by date and time
 * - Provides AI-powered workout summary
 * - Allows CSV export of workout data
 * - Collapsible date and time sections
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
  const [showPerformanceReport, setShowPerformanceReport] = React.useState(false);
  const [summaryText, setSummaryText] = React.useState('');
  const [loadingSummary, setLoadingSummary] = React.useState(false);
  const [summaryError, setSummaryError] = React.useState('');

  // State for collapsible sections
  const [expandedDates, setExpandedDates] = useState(new Set());
  const [expandedTimes, setExpandedTimes] = useState(new Set());

  /**
   * Toggles the expanded state of a date section
   * @param {string} date - The date to toggle
   */
  const toggleDate = (date) => {
    setExpandedDates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(date)) {
        newSet.delete(date);
      } else {
        newSet.add(date);
      }
      return newSet;
    });
  };

  /**
   * Toggles the expanded state of a time section
   * @param {string} dateTimeKey - The date-time key to toggle
   */
  const toggleTime = (dateTimeKey) => {
    setExpandedTimes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dateTimeKey)) {
        newSet.delete(dateTimeKey);
      } else {
        newSet.add(dateTimeKey);
      }
      return newSet;
    });
  };

  /**
   * Organizes workout data by date and time, then by exercise type
   * @param {Array} data - Array of workout sessions
   * @returns {Object} Object organized by date -> time -> exercise type
   */
  const organizeWorkoutDataByDateTime = (data) => {
    if (!data || data.length === 0) return {};
    
    const organized = {};
    
    // Handle the array of workout sessions format from localStorage
    // Each session is [datetime, [workoutEntries]]
    data.forEach((workoutSession, sessionIndex) => {
      if (Array.isArray(workoutSession) && workoutSession.length === 2) {
        const dateTime = workoutSession[0]; // e.g., "2025-08-07 15:03"
        const workoutEntries = workoutSession[1]; // Array of workout entries
        
        // Parse date and time from the session datetime
        const [date, time] = dateTime.split(' ');
        const hour = time ? time.split(':')[0] : '';
        const minute = time ? time.split(':')[1] : '';
        const timeDisplay = time && hour && minute ? `${hour}:${minute}` : 'Unknown Time';
        
        // Process each workout entry in the session
        workoutEntries.forEach((entry, entryIndex) => {
          const parts = entry.split(',');
          const workoutType = parts[0] || '';
          const reps = parts[1] || '';
          const weight = parts[2] || '';
          
          // Determine if NeedsReview is present
          let needsReview = false;
          if (parts.length >= 4 && parts[3] === 'NeedsReview') {
            needsReview = true;
          }
          
          // Debug logging
          console.log('Processing entry:', entry);
          console.log('Session datetime:', dateTime);
          console.log('Parsed date:', date, 'time:', time, 'timeDisplay:', timeDisplay);
          console.log('NeedsReview:', needsReview);
          
          if (!organized[date]) {
            organized[date] = {};
          }
          
          if (!organized[date][timeDisplay]) {
            organized[date][timeDisplay] = {};
          }
          
          if (!organized[date][timeDisplay][workoutType]) {
            organized[date][timeDisplay][workoutType] = [];
          }
          
          // Store the entry with its original index for reference
          organized[date][timeDisplay][workoutType].push({
            entry,
            originalIndex: `${sessionIndex}-${entryIndex}`,
            parts,
            reps,
            weight,
            needsReview,
          });
        });
      }
    });
    
    console.log('Organized data:', organized);
    return organized;
  };

  // Memoize the organized data to avoid recalculating on every render
  const organizedWorkoutData = useMemo(() => {
    return organizeWorkoutDataByDateTime(workoutHistory);
  }, [workoutHistory]);

  /**
   * Generates and triggers download of a CSV file from workout history
   */
  function downloadCSVWorkoutData(){
    // Generates and triggers download of a CSV file from workoutData
    if (!workoutHistory || workoutHistory.length === 0) {
      alert('No workout data to export.');
      return;
    }

    // Prepare CSV header and rows
    const header = 'workoutType,Reps,Weight,Date,Time';
    const rows = workoutHistory.flatMap(session => {
      if (Array.isArray(session) && session.length === 2) {
        const dateTime = session[0]; // e.g., "2025-08-07 15:03"
        const workoutEntries = session[1]; // Array of workout entries
        
        return workoutEntries.map(entry => {
          if (typeof entry === 'string') {
            // Add the session datetime to each entry for export
            return `${entry},${dateTime}`;
          }
          return '';
        }).filter(Boolean);
      }
      return [];
    });
    
    const csvContent = [header, ...rows].join('\r\n');

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'workout_data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return null;
  }

  /**
   * Toggle dark mode on <html> element and save to localStorage
   */
  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDark));
  }, [isDark]);

  /**
   * Load workout history from localStorage on component mount
   */
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('gymWhisperData');
      if (raw) {
        const data = JSON.parse(raw);
        // Data is stored as an array of workout sessions: [["2025-08-07 15:03", ["PushUp,15,Bodyweight", "BenchPress,10,145lbs"]]]
        if (Array.isArray(data)) {
          setWorkoutHistory(data);
        } else {
          setWorkoutHistory([]);
        }
      } else {
        setWorkoutHistory([]);
      }
    } catch (e) {
      console.error('Failed to parse workout history:', e);
      setWorkoutHistory([]);
    }
  }, []);

  /**
   * Handles the summary button click and generates AI summary
   */
  async function handleGeneratePerformanceReport() {
    setLoadingSummary(true);
    setSummaryError('');
    setShowPerformanceReport(true);
    try {
      // Extract workout data from the new format for summary
      const csvRows = workoutHistory.flatMap(session => {
        if (Array.isArray(session) && session.length === 2) {
          const workoutEntries = session[1]; // Array of workout entries
          return workoutEntries.map(entry => {
            if (typeof entry === 'string') {
              // Keep only workoutType, reps, weight for summary
              const parts = entry.split(',');
              return [parts[0], parts[1], parts[2]].join(',');
            }
            return '';
          }).filter(Boolean);
        }
        return [];
      });

      const response = await generatePerformanceReport(csvRows);
      if (response && response.summary) {
        setSummaryText(response.summary);
      } else if (response && response.error) {
        setSummaryError(response.error);
      } else {
        setSummaryError('Failed to get summary.');
      }
    } catch (e) {
      setSummaryError('An error occurred while summarizing.');
    } finally {
      setLoadingSummary(false);
    }
  }

  /**
   * Closes the summary popup and resets state
   */
  function handleClosePerformanceReport() {
    setShowPerformanceReport(false);
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

  /**
   * Formats date for display
   */
  const formatDate = (dateString) => {
    try {
      // Handle the format "2025-08-07 15:03"
      if (dateString && dateString.includes(' ')) {
        const [datePart, timePart] = dateString.split(' ');
        const [year, month, day] = datePart.split('-').map(Number);
        
        // Create date object (month is 0-indexed, so subtract 1)
        const date = new Date(year, month - 1, day);
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
          return dateString; // Return original if invalid
        }
        
        return date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric', 
        });
      }
      
      // Fallback for other date formats
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // Return original if invalid
      }
      
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
      });
    } catch (e) {
      console.error('Date parsing error:', e, 'for dateString:', dateString);
      return dateString; // Return original string if parsing fails
    }
  };

  return (
    <div className="app">
      {/* Top gradient overlay */}
      <div className="top-gradient" />

      {/* Sidebar overlay for click-outside-to-close */}
      <div 
        className={`sidebar-overlay${menuOpen ? ' open' : ''}`}
        onClick={handleSidebarOverlayClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleSidebarOverlayClick(e);
          }
        }}
        aria-label="Close sidebar"
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
          

          {/* Show summary button and back link side by side */}
          {workoutHistory && workoutHistory.length > 0 && (
            <button
              className="summary-btn"
              onClick={handleGeneratePerformanceReport}
              disabled={loadingSummary}
              aria-label="Summarize Workout History"
            >
              {loadingSummary ? 'Reporting...' : t('performanceReport')}
            </button>
          )}

          {/* Summary popup/modal */}
          {showPerformanceReport && (
            <div
              className="summary-popup"
              style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.4)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Workout Performance Report"
            >
              <div
                style={{
                  borderRadius: '16px',
                  padding: '2rem',
                  maxWidth: '90vw',
                  maxHeight: '80vh',
                  overflowY: 'auto',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  minWidth: '300px',
                }}
              >
                <h2 style={{marginTop:0}}>{t('performanceReport')}</h2>
                {loadingSummary ? (
                  <p>Loading summary...</p>
                ) : summaryError ? (
                  <p style={{color: 'red'}}>{summaryError}</p>
                ) : (
                  <p style={{whiteSpace: 'pre-line'}}>{summaryText}</p>
                )}
                <button
                  onClick={handleClosePerformanceReport}
                  style={{
                    marginTop: '1.5rem',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                  }}
                  aria-label="Close Performance Report"
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

                <tbody>
                  {Object.entries(organizedWorkoutData).map(([date, timeData]) => {
                    return (
                      <React.Fragment key={date}>
                        {/* Date Header Row */}
                        <tr className="date-header-row">
                          <td colSpan="3" className="date-header">
                            <div className="header-content">
                              <span>{formatDate(date)}</span>
                            </div>
                          </td>
                        </tr>
                        {/* Time and Exercise Data - Always show */}
                        {Object.entries(timeData).map(([time, exerciseData]) => {
                          const dateTimeKey = `${date}-${time}`;
                          const isTimeExpanded = expandedTimes.has(dateTimeKey);
                          return (
                            <React.Fragment key={`${date}-${time}`}>
                              {/* Time Header Row */}
                              <tr 
                                className="time-header-row clickable"
                                onClick={() => toggleTime(dateTimeKey)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    toggleTime(dateTimeKey);
                                  }
                                }}
                                aria-label={`Toggle ${time}`}
                              >
                                <td colSpan="3" className="time-header">
                                  <div className="header-content">
                                    {isTimeExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                    <div className="time-header-content">
                                      <span className="workout-number">Workout {Object.keys(timeData).indexOf(time) + 1}</span>
                                      <span className="recorded-time">Recorded at {time}</span>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              {/* Exercise Data - Only show if time is expanded */}
                              {isTimeExpanded && Object.entries(exerciseData).map(([exerciseType, sets]) => (
                                <React.Fragment key={`${date}-${time}-${exerciseType}`}>
                                  {/* Exercise Name Row with Reps/Weight */}
                                  <tr className="exercise-header-row">
                                    <td className="exercise-name-header">
                                      {exerciseType}
                                    </td>
                                    <td className="exercise-reps-header">
                                      <span className="exercise-reps-label">Reps</span>
                                    </td>
                                    <td className="exercise-weight-header">
                                      <span className="exercise-weight-label">Weight</span>
                                    </td>
                                  </tr>
                                  {/* Individual Sets */}
                                  {sets.map(({ entry, originalIndex, reps, weight, needsReview }) => (
                                    <tr key={originalIndex} className="set-row">
                                      <td></td>
                                      <td className="reps-cell">
                                        <span className="reps-info">{reps}</span>
                                        {needsReview && (
                                          <div className="review-section">
                                            <span className="review-warning">{t('needsReview')}</span>
                                          </div>
                                        )}
                                      </td>
                                      <td className="weight-cell">
                                        <span className="weight-info">{weight}</span>
                                      </td>
                                    </tr>
                                  ))}
                                </React.Fragment>
                              ))}
                            </React.Fragment>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          
          <Link to="/" className="back-btn" style={{ flexShrink: 0 }}>
            {t('backToHome')}
          </Link>

        </div>
      </main>
    </div>
  );
}