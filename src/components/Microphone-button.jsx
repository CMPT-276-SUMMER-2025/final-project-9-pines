import React from "react";
import { Mic } from "lucide-react";
import { motion } from "framer-motion";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { callGeminiAPI } from '../llm/gemini'; // Adjust path if needed

export default function MicrophoneButton({ workoutData, setWorkoutData }) {
  // Get speech recognition state/hooks
  const {
    transcript,
    listening,
    resetTranscript,
  } = useSpeechRecognition();

  // Handle mic toggle: start/stop listening and process transcript
  const handleRecordToggle = async () => {
    if (!listening) {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    } else {
      SpeechRecognition.stopListening();
      try {
        const response = await callGeminiAPI(transcript);
        setWorkoutData((prev) => [...prev, response.result]);
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
    </>
  );
}

