import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./HomePage";
import HistoryPage from "./historyPage";

/**
 * App component: Main application router and state management
 * 
 * Manages workout data state and routing between pages
 */
export default function App() {
  // Move workoutData to the main App component so it's shared across pages
  const [workoutData, setWorkoutData] = useState([]);

  return (
    <Routes>
      <Route path="/" element={<HomePage workoutData={workoutData} setWorkoutData={setWorkoutData} />} />
      <Route path="/history" element={<HistoryPage />} />
    </Routes>
  );
}