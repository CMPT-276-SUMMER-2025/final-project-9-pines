import React from "react";
import { motion } from "framer-motion";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { callGeminiAPI } from '../llm/gemini';
import MicrophoneIcon from '../assets/mic_icon.png';

export default function MicrophoneButton({ workoutData, setWorkoutData }) {
  const {
    transcript,
    listening,
    resetTranscript,
  } = useSpeechRecognition();

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
      SpeechRecognition.startListening({ continuous: true });
    } else {
      SpeechRecognition.stopListening();
      if(transcript === ""){
        return
      }
      try {
        const response = await callGeminiAPI(transcript);

        updateWorkoutData(response.result)
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
            {transcript || "Listening..."}
          </>
        ) : (
          "Tap to record"
        )}
      </p>
    </>
  );
}