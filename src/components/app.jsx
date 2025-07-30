import { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import "./App.css";

import Sidebar from "./Side-bar";
import MicrophoneButton from "./Microphone-button";
import Header from "./Header-";
import Toast from "./Toast"; 
import WorkoutPanel from "./WorkoutPanel"; 

export default function App() {
  // UI state
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  // editingIndex, editText, showConfirmDialog, finalizing, finalizedWorkout states moved to WorkoutPanel

  // Speech recognition & transcription
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  // Workouts list, saved as array of strings (CSV)
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

  

  // startEditing, cancelEditing, saveEditing, handleFinalize, confirmFinalize, cancelFinalize, removeEntry functions moved to WorkoutPanel
  // ConfirmationDialog component definition moved to its own file and used in WorkoutPanel

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

      {/* Sidebar */}
      <Sidebar
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        isDark={isDark}
        setIsDark={setIsDark}
      />

      {/* Header (extracted) */}
      <Header onMenuToggle={() => setMenuOpen(m => !m)} />

      {/* Main Content */}
      <main className="main">
        {/* Microphone Button */}
        <MicrophoneButton
          workoutData={workoutData}
          setWorkoutData={setWorkoutData}
          setToastVisible={setToastVisible}            // ← Trigger the toast here
          transcript={transcript}
          listening={listening}
          resetTranscript={resetTranscript}
          startListening={SpeechRecognition.startListening}
          stopListening={SpeechRecognition.stopListening}
        />

        {/* Open Workout Panel */}
        <button
          onClick={() => setPanelOpen(true)}
          className="workout-btn"
          aria-haspopup="dialog"
        >
          Your Workout
        </button>
      </main>

      {/* Toast (extracted) */}
      <Toast toastVisible={toastVisible} message="Added to your workout!" />

      {/* Workout Panel */}
      <WorkoutPanel
        panelOpen={panelOpen}
        setPanelOpen={setPanelOpen}
        workoutData={workoutData}
        setWorkoutData={setWorkoutData}
      />
    </div>
  );
}