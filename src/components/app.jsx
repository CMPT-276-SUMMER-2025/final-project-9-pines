import { useState, useEffect } from "react";
import { Mic, Menu, ArrowLeft, Trash2, Edit2, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { callGeminiAPI } from '../llm/gemini'; // Keep your actual API import
import "./App.css";
import ToggleSwitch from "./ToggleSwitch";
import Sidebar from "./Side-bar";



export default function App() {
  // UI state
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");

  // Speech recognition & transcription
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  // Workouts list, saved as array of strings for simplicity (CSV format)
  const [workoutData, setWorkoutData] = useState([]);

  // Toggle dark mode on <html>
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Toast auto-hide
  useEffect(() => {
    if (toastVisible) {
      const timer = setTimeout(() => setToastVisible(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [toastVisible]);

  // Handle mic recording toggle
  const handleRecordToggle = async () => {
    if (!listening) {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    } else {
      SpeechRecognition.stopListening();
      // Process transcript with your API
      try {
        const response = await callGeminiAPI(transcript);
        // Assume response.result is a CSV string: "WorkoutType,Reps,Weight"
        setWorkoutData((prev) => [...prev, response.result]);
        setToastVisible(true);
      } catch (error) {
        console.error("LLM API error:", error);
      }
      resetTranscript();
    }
  };

  // Edit workout entry
  const startEditing = (index) => {
    setEditingIndex(index);
    setEditText(workoutData[index]);
  };
  const cancelEditing = () => {
    setEditingIndex(null);
    setEditText("");
  };
  const saveEditing = () => {
    if (editText.trim() === "") return; // ignore empty
    setWorkoutData((prev) => prev.map((item, i) => (i === editingIndex ? editText.trim() : item)));
    setEditingIndex(null);
    setEditText("");
  };

  // Remove workout entry
  const removeEntry = (index) => {
    setWorkoutData((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) cancelEditing();
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="app app-center">
        <h1>Your browser does not support speech recognition</h1>
      </div>
    );
  }

  if (!isMicrophoneAvailable) {
    return (
      <div className="app app-center">
        <h1>Please give microphone permission</h1>
      </div>
    );
  }

  return (
    <div className="app">

    <Sidebar
      menuOpen={menuOpen}
      setMenuOpen={setMenuOpen}
      isDark={isDark}
      setIsDark={setIsDark}
    />

      {/* Header */}
      <header className="header">
        <button
          onClick={() => setMenuOpen(m => !m)}
          className="icon-btn header-menu-btn"
          aria-label="Toggle menu"
        >
          <Menu size={32} />
        </button>
        <h1>Gym Whisper</h1>
        <select className="lang-select" aria-label="Select language">
          <option>EN</option>
          <option>ES</option>
          <option>FR</option>
        </select>
      </header>

      {/* Main Content */}
      <main className="main">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleRecordToggle}
          className={`record-btn${listening ? " recording" : ""}`}
          aria-pressed={listening}
          aria-label={listening ? "Stop recording" : "Start recording"}
        >
          <Mic size={listening ? 64 : 56} className={listening ? "icon-white" : "icon-primary"} />
        </motion.button>

        <p className="status-text" aria-live="polite" aria-atomic="true">
          {listening ? (
            <>
              <span className="record-dot" aria-hidden="true">●</span>
              {transcript || "Listening..."}
            </>
          ) : (
            "Tap the mic to record"
          )}
        </p>

        <button onClick={() => setPanelOpen(true)} className="workout-btn" aria-haspopup="dialog">
          Your Workout
        </button>
      </main>

      {/* Toast */}
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="toast"
            role="alert"
          >
            Added to your workout!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workout Panel */}
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
              <h2 id="workout-panel-title">Your Workout</h2>
              <button onClick={() => setPanelOpen(false)} className="icon-btn" aria-label="Close workout panel">
                <ArrowLeft size={24} className="rotated" />
              </button>
            </div>

            {workoutData.length === 0 ? (
              <div className="empty-workouts">
                <p>No workout data yet</p>
                <p>Record your exercises to see them here</p>
              </div>
            ) : (
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
                      // parse CSV string (WorkoutType,Reps,Weight)
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
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
