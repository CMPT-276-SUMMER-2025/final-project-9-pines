import { useState, useEffect } from "react";
import { Menu, ArrowLeft, Trash2, Edit2, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { callGeminiAPI } from '../llm/gemini';
import "./App.css";
import ToggleSwitch from "./ToggleSwitch";
import Sidebar from "./Side-bar";
import MicrophoneButton from "./Microphone-button";
import Header from "./Header-";
import backgroundImage from '../assets/background_2.PNG';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [finalizedWorkout, setFinalizedWorkout] = useState(null);

  const { browserSupportsSpeechRecognition, isMicrophoneAvailable } = useSpeechRecognition();
  const [workoutData, setWorkoutData] = useState([]);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDark]);

  useEffect(() => {
    if (toastVisible) {
      const timer = setTimeout(() => setToastVisible(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [toastVisible]);

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditText(workoutData[index]);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditText("");
  };

  const saveEditing = () => {
    if (editText.trim() === "") return;
    setWorkoutData((prev) =>
      prev.map((item, i) => (i === editingIndex ? editText.trim() : item))
    );
    setEditingIndex(null);
    setEditText("");
  };

  const handleFinalize = () => {
    setFinalizing(true);
    setFinalizedWorkout(workoutData);
  };

  function downloadCSVWorkoutData(){
    // Generates and triggers download of a CSV file from workoutData
    if (!workoutData || workoutData.length === 0) {
      alert("No workout data to export.");
      return;
    }

    // Prepare CSV header and rows
    const header = "workoutType,Reps,Weight";
    const rows = workoutData.map(row => {
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

  const confirmFinalize = () => {
    setShowConfirmDialog(false);
    alert("Workout finalized! Ready to save as CSV");
    downloadCSVWorkoutData();
    setFinalizing(false);
    setFinalizedWorkout(null);
    setWorkoutData([]);
    setPanelOpen(false);
  };

  const cancelFinalize = () => {
    setFinalizing(false);
    setFinalizedWorkout(null);
  };

  const removeEntry = (index) => {
    setWorkoutData((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) cancelEditing();
  };

  const ConfirmationDialog = ({ isOpen, onConfirm, onCancel, message }) => (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="confirmation-dialog"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="confirmation-content"
          >
            <h3 style={{ marginBottom: '16px', color: 'var(--color-recording)' }}>Warning</h3>
            <p>{message}</p>
            <div className="confirmation-buttons">
              <button onClick={onCancel} className="workout-btn finalize-cancel">Cancel</button>
              <button onClick={onConfirm} className="workout-btn finalize-confirm">Confirm</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!browserSupportsSpeechRecognition) {
    return <div className="app app-center"><h1>Your browser does not support speech recognition</h1></div>;
  }

  if (!isMicrophoneAvailable) {
    return <div className="app app-center"><h1>Please give microphone permission</h1></div>;
  }

  return (
    <div className="app">
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} isDark={isDark} setIsDark={setIsDark} />
      <Header onMenuToggle={() => setMenuOpen(m => !m)} />

      <main className="main">
        <MicrophoneButton
          workoutData={workoutData}
          setWorkoutData={setWorkoutData}
          setToastVisible={setToastVisible}
        />
        <button onClick={() => setPanelOpen(true)} className="workout-btn" aria-haspopup="dialog">
          Your Workout
        </button>
      </main>

      <AnimatePresence>
        {panelOpen && (
          <motion.div
            className="panel"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="workout-panel-title"
          >
            <div className="panel-header">
              <h2 id="workout-panel-title">{finalizing ? "Finalize Workout" : "Your Workout"}</h2>
              <button
                onClick={() => finalizing ? cancelFinalize() : setPanelOpen(false)}
                className="icon-btn"
                aria-label={finalizing ? "Cancel finalize" : "Close workout panel"}
              >
                <ArrowLeft size={24} className="rotated" />
              </button>
            </div>

            {finalizing ? (
              <div className="finalize-summary">
                <h3>Workout Summary</h3>
                <div className="workout-table-wrapper">
                  <table className="workout-table">
                    <thead>
                      <tr>
                        <th scope="col">WorkoutType</th>
                        <th scope="col">Reps</th>
                        <th scope="col">Weight</th>
                      </tr>
                    </thead>
                    <tbody>
                      {finalizedWorkout.map((entry, idx) => {
                        const parts = entry.split(",");
                        return (
                          <tr key={idx}>
                            <td>{parts[0] || ""}</td>
                            <td>{parts[1] || ""}</td>
                            <td>{parts[2] || ""}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="finalize-actions">
                  <button onClick={() => setShowConfirmDialog(true)} className="workout-btn finalize-confirm">
                    Confirm & Save
                  </button>
                  <button onClick={cancelFinalize} className="workout-btn finalize-cancel">
                    Back to Edit
                  </button>
                </div>
              </div>
            ) : workoutData.length === 0 ? (
              <div className="empty-workouts">
                <p>No workout data yet</p>
                <p>Record your exercises to see them here</p>
              </div>
            ) : (
              <>
                <div className="workout-table-wrapper">
                  <table className="workout-table" role="grid" aria-label="Workout entries">
                    <thead>
                      <tr>
                        <th scope="col">WorkoutType</th>
                        <th scope="col">Reps</th>
                        <th scope="col">Weight</th>
                        <th scope="col" aria-label="Actions"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {workoutData.map((entry, idx) => {
                        const parts = entry.split(",");
                        const workoutType = parts[0] || "";
                        const reps = parts[1] || "";
                        const weight = parts[2] || "";
                        const isEditing = editingIndex === idx;

                        return (
                          <tr key={idx} className={isEditing ? "editing" : ""}>
                            <td>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  className="edit-input"
                                  aria-label="Edit workout entry"
                                />
                              ) : (
                                workoutType
                              )}
                            </td>
                            <td>{isEditing ? "" : reps}</td>
                            <td>{isEditing ? "" : weight}</td>
                            <td className="actions-cell">
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={saveEditing}
                                    className="icon-btn action-btn"
                                    aria-label="Save edit"
                                    title="Save"
                                  >
                                    <Check size={20} />
                                  </button>
                                  <button
                                    onClick={cancelEditing}
                                    className="icon-btn action-btn"
                                    aria-label="Cancel edit"
                                    title="Cancel"
                                  >
                                    <X size={20} />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => startEditing(idx)}
                                    className="icon-btn action-btn"
                                    aria-label={`Edit workout entry ${idx + 1}`}
                                    title="Edit"
                                  >
                                    <Edit2 size={20} />
                                  </button>
                                  <button
                                    onClick={() => removeEntry(idx)}
                                    className="icon-btn action-btn"
                                    aria-label={`Delete workout entry ${idx + 1}`}
                                    title="Delete"
                                  >
                                    <Trash2 size={20} />
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="finalize-button-container">
                  <button onClick={handleFinalize} className="workout-btn">
                    Finalize Workout
                  </button>
                </div>
              </>
            )}

            <ConfirmationDialog
              isOpen={showConfirmDialog}
              onConfirm={confirmFinalize}
              onCancel={() => setShowConfirmDialog(false)}
              message="Are you sure you want to export your workout? This action cannot be undone and your current workout will be erased."
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}