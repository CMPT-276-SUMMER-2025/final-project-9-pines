import React from "react";
import { motion } from "framer-motion";
import { callGeminiAPI } from '../llm/gemini';
import MicrophoneIcon from '../assets/purplemic.png';

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
    // For each entry, append the current date as a string (ISO format)
    const today = new Date().toISOString().split('T')[0]; // e.g., "2024-06-09"
    for (let i = 0; i < entries.length; i++) {
      entries[i] = entries[i] + "," + today;
    }
    console.log(workoutData)
    if(workoutData === undefined || workoutData === null){
      setWorkoutData([...entries]);
      storeWorkoutDataInLocalStorage(entries)

    }else{
      setWorkoutData(prev => [...prev, ...entries]);
      //update local storage
      storeWorkoutDataInLocalStorage(entries)
    }


  }

  function storeWorkoutDataInLocalStorage(data) {
    console.log(data)
    try {
      const currentDataInLocalStorage = localStorage.getItem('gymWhisperData')
      if(currentDataInLocalStorage === null){
        const jsonString = JSON.stringify([data]);
        localStorage.setItem('gymWhisperData', jsonString);
        return
      }
      const currentData = JSON.parse(currentDataInLocalStorage)
      console.log(currentData)
      const newData = [...currentData, ...data]
      const jsonString = JSON.stringify(newData);
      localStorage.setItem('gymWhisperData', jsonString);
    } catch (e) {
      console.error("Failed to store data in localStorage:", e);
    }
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