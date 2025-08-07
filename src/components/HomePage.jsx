import { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import Sidebar from "./Side-bar";
import MicrophoneButton from "./Microphone-button";
import Header from "./Header-";
import Toast from "./Toast"; 
import WorkoutPanel from "./WorkoutPanel";
import { useLanguage } from '../contexts/LanguageContext';

export default function HomePage({ workoutData, setWorkoutData }) {
  const { t } = useLanguage();
  // UI state
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
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

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="app app-center">
        <h1>{t('browserNotSupported')}</h1>
      </div>
    );
  }

  if (!isMicrophoneAvailable) {
    return (
      <div className="app app-center">
        <h1>{t('microphonePermission')}</h1>
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