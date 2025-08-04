import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header-';
import Sidebar from './Side-bar';

export default function HistoryPage() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);
  const [workoutHistory, setWorkoutHistory] = React.useState([]);

  // Toggle dark mode on <html>
  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Load workout history from localStorage
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("gymWhisperData");
      if (raw) {
        const data = JSON.parse(raw);
        // Extract workout data - assuming it's stored as an array of workout entries
        if (Array.isArray(data)) {
          setWorkoutHistory(data);
        } else if (data.workouts && Array.isArray(data.workouts)) {
          setWorkoutHistory(data.workouts);
        } else {
          // If it's a single workout entry, wrap it in an array
          setWorkoutHistory([data]);
        }
      } else {
        setWorkoutHistory([]);
      }
    } catch (e) {
      console.error("Failed to parse workout history:", e);
      setWorkoutHistory([]);
    }
  }, []);

  return (
    <div className="app">
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
          <h1>Workout History</h1>
          <p>View your past workout sessions and exercises.</p>
          
          {workoutHistory.length === 0 ? (
            <div className="empty-history">
              <p>No workout history found.</p>
              <p>Complete and finalize workouts to see them here.</p>
            </div>
          ) : (
            <div className="history-table-wrapper">
              <table className="workout-table" role="grid" aria-label="Workout history">
                <thead>
                  <tr>
                    <th scope="col">Workout Type</th>
                    <th scope="col">Reps</th>
                    <th scope="col">Weight</th>
                    <th scope="col">Date</th>
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
          
          <Link to="/" className="back-btn">
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}