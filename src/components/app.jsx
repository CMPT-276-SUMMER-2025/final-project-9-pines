/**
 * @fileoverview Main App component that serves as the application router and state manager.
 * 
 * This component is responsible for:
 * - Setting up React Router routes for navigation between pages
 * - Managing shared workout data state that persists across page navigation
 * - Providing the workout data to child components that need it
 * 
 * The workoutData state is managed at this level to ensure data consistency
 * when users navigate between the home page and history page.
 * 
 * @author GymWhisper Team
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './HomePage';
import HistoryPage from './historyPage';

/**
 * Main App component that handles routing and shared state management.
 * 
 * @returns {JSX.Element} The main application with routing setup
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