import React from "react";
import { motion } from "framer-motion";
import { callGeminiAPI } from '../llm/gemini';
import MicrophoneIcon from '../assets/mic_icon.png';

export default function MicrophoneButton({
  workoutData,
  setWorkoutData,
  setToastVisible, 
  transcript,      
  listening,       
  resetTranscript, 
  startListening,  
  stopListening    
}) {

  function updateWorkoutData(csvString){
    if (!csvString || typeof csvString !== "string") return;
    // Split by ';' and trim each entry
    const entries = csvString.split(";").map(s => s.trim()).filter(Boolean);
    if (entries.length === 0) return;
    setWorkoutData(prev => [...prev, ...entries]);
  }

  const handleRecordToggle = async () => {
    if (!listening) {
      resetTranscript();
      startListening({ continuous: true }); 
    } else {
      stopListening(); 
      if(transcript === ""){
        return
      }
      try {
        const response = await callGeminiAPI(transcript);

        updateWorkoutData(response.result); 

        setToastVisible(true);

      } catch (error) {
        console.error("LLM API error:", error);
      }
      resetTranscript();
    }
  };

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleRecordToggle}
        className={`record-btn${listening ? " recording" : ""}`}
        aria-pressed={listening}
        aria-label={listening ? "Stop recording" : "Start recording"}
      >
        <img
          src={MicrophoneIcon}
          alt="Microphone Icon"
          width={listening ? 300 : 300}
          className={listening ? "icon-white" : "icon-primary"}
        />
      </motion.button>

      <p className="status-text" aria-live="polite" aria-atomic="true">
        {listening ? (
          <>
            <span className="record-dot" aria-hidden="true">●</span>
            {transcript || "Listening..."} {/* Using the passed prop */}
          </>
        ) : (
          "Tap to record"
        )}
      </p>
    </>
  );
}