import { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import Sidebar from "./Side-bar";
import MicrophoneButton from "./Microphone-button";
import Header from "./Header-";
import Toast from "./Toast"; 
import WorkoutPanel from "./WorkoutPanel";
import { useLanguage } from '../contexts/LanguageContext';

/**
 * HomePage component: Main application interface with voice recording and workout management
 * 
 * Props:
 * - workoutData: array of workout entries
 * - setWorkoutData: function to update workout data
 */
export default function HomePage({ workoutData, setWorkoutData }) {
  const { t } = useLanguage();
  
  // UI state
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    // Initialize dark mode from localStorage or system preference
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [panelOpen, setPanelOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  // Speech recognition & transcription
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  /**
   * Toggle dark mode on <html> element and save to localStorage
   */
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem('darkMode', JSON.stringify(isDark));
  }, [isDark]);

  /**
   * Auto-hide toast after 2 seconds
   */
  useEffect(() => {
    if (toastVisible) {
      const timer = setTimeout(() => setToastVisible(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [toastVisible]);

  /**
   * Handles clicking outside the sidebar to close it
   */
  const handleSidebarOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setMenuOpen(false);
    }
  };

  // Handle browser compatibility
  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="app app-center">
        <h1>{t('browserNotSupported')}</h1>
      </div>
    );
  }

  // Handle microphone permission
  if (!isMicrophoneAvailable) {
    return (
      <div className="app app-center">
        <h1>{t('microphonePermission')}</h1>
      </div>
    );
  }

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
        {/* Microphone Button */}
        <MicrophoneButton
          workoutData={workoutData}
          setWorkoutData={setWorkoutData}
          setToastVisible={setToastVisible}
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
          {t('yourWorkout')}
        </button>
      </main>

      {/* Toast */}
      <Toast toastVisible={toastVisible} message={t('addedToWorkout')} />

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