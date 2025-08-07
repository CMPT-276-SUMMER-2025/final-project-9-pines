import React from 'react';
import { motion } from 'framer-motion';
import { callGeminiAPI } from '../llm/gemini';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * MicrophoneButton component: handles voice recording and workout data processing
 * 
 * Props:
 * - workoutData: array of workout entries
 * - setWorkoutData: function to update workout data
 * - setToastVisible: function to show/hide toast notifications
 * - transcript: current speech transcript
 * - listening: boolean indicating if currently recording
 * - resetTranscript: function to clear transcript
 * - startListening: function to start speech recognition
 * - stopListening: function to stop speech recognition
 */
export default function MicrophoneButton({
  workoutData,
  setWorkoutData,
  setToastVisible, 
  transcript,      
  listening,       
  resetTranscript, 
  startListening,  
  stopListening,    
}) {
  const { language, t } = useLanguage();

  /**
   * Updates workout data with new entries from CSV string
   * @param {string} csvString - CSV formatted workout data
   */
  function updateWorkoutData(csvString){
    if (!csvString || typeof csvString !== 'string') return;
    // Split by ';' and trim each entry
    const entries = csvString.split(';').map(s => s.trim()).filter(Boolean);
    if (entries.length === 0) return;
    // For each entry, append the current date as a string (ISO format)
    // Get today's date in Los Angeles time (America/Los_Angeles)
    const laDate = new Date().toLocaleDateString('en-CA', { 
      timeZone: 'America/Los_Angeles', 
    }); // e.g., "2024-06-09"
    for (let i = 0; i < entries.length; i++) {
      entries[i] = entries[i] + ',' + laDate;
    }
    if(workoutData === undefined || workoutData === null){
      setWorkoutData([...entries]);
    }else{
      setWorkoutData(prev => [...prev, ...entries]);
    }
  }

  /**
   * Handles recording toggle - starts or stops voice recording
   */
  const handleRecordToggle = async () => {
    if (!listening) {
      resetTranscript();
      // Set language for speech recognition
      const speechConfig = { 
        continuous: true,
        language: language === 'fr' ? 'fr-FR' : 'en-US',
      };
      startListening(speechConfig); 
    } else {
      stopListening(); 
      if(transcript === ''){
        return;
      }
      try {
        const response = await callGeminiAPI(transcript, language);

        updateWorkoutData(response.result); 

        setToastVisible(true);

      } catch (error) {
        console.error('LLM API error:', error);
      }
      resetTranscript();
    }
  };

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Recording popup positioned above the mic */}
      {listening && (
        <div className="recording-popup" style={{ position: 'absolute', top: '-80px', zIndex: 10 }}>
          {t('clickAgainToStop')}
        </div>
      )}

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleRecordToggle}
        className={`record-btn${listening ? ' recording' : ''}`}
        aria-pressed={listening}
        aria-label={listening ? 'Stop recording' : 'Start recording'}
      >
        {/* Simple microphone icon */}
        <svg 
          className={`mic-icon ${listening ? 'icon-white' : 'icon-primary'}`}
          viewBox="0 0 24 24" 
          fill="currentColor"
          style={{ width: '80px', height: '80px' }}
        >
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
        </svg>

        {/* Bouncing dots when recording */}
        {listening && (
          <div className="recording-indicator">
            <div className="bouncing-dot"></div>
            <div className="bouncing-dot"></div>
            <div className="bouncing-dot"></div>
          </div>
        )}
      </motion.button>

      <p className="status-text" aria-live="polite" aria-atomic="true">
        {listening ? (
          <>
            <span className="record-dot" aria-hidden="true">●</span>
            {transcript || t('recording')}
          </>
        ) : (
          t('recordButton')
        )}
      </p>
    </div>
  );
}