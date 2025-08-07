// src/WorkoutPanel.jsx
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trash2, Edit2, Check, X, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// Import the new components
import ConfirmationDialog from './ConfirmationDialog';
import WorkoutFinalizeView from './WorkoutFinalizeView';

/**
 * WorkoutPanel component: displays and manages workout entries
 * 
 * Props:
 * - panelOpen: boolean indicating if panel is open
 * - setPanelOpen: function to open/close panel
 * - workoutData: array of workout entries
 * - setWorkoutData: function to update workout data
 */
export default function WorkoutPanel({
  panelOpen,
  setPanelOpen,
  workoutData,
  setWorkoutData,
}) {
  const { t } = useLanguage();
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [finalizedWorkout, setFinalizedWorkout] = useState(null);

  /**
   * Organizes workout data by workout type for grouped display
   * @param {Array} data - Array of workout entries
   * @returns {Object} Object with workout types as keys and arrays of entries as values
   */
  const organizeWorkoutDataByType = (data) => {
    if (!data || data.length === 0) return {};
    
    const organized = {};
    
    data.forEach((entry, index) => {
      const parts = entry.split(',');
      const workoutType = parts[0] || '';
      
      if (!organized[workoutType]) {
        organized[workoutType] = [];
      }
      
      // Store the entry with its original index for editing/deleting
      organized[workoutType].push({
        entry,
        originalIndex: index,
        parts,
      });
    });
    
    return organized;
  };

  // Memoize the organized data to avoid recalculating on every render
  const organizedWorkoutData = useMemo(() => {
    return organizeWorkoutDataByType(workoutData);
  }, [workoutData]);

  /**
   * Starts editing a workout entry
   * @param {number} index - Index of the entry to edit
   */
  const startEditing = (index) => {
    setEditingIndex(index);
    setEditText(workoutData[index]);
  };

  /**
   * Cancels the current editing operation
   */
  const cancelEditing = () => {
    setEditingIndex(null);
    setEditText('');
  };

  /**
   * Saves the current edit to workout data
   */
  const saveEditing = () => {
    if (editText.trim() === '') return;
    setWorkoutData((prev) =>
      prev?.map((item, i) => (i === editingIndex ? editText.trim() : item)),
    );
    setEditingIndex(null);
    setEditText('');
  };

  /**
   * Stores workout data in localStorage for persistence
   * @param {Array} data - Array of workout entries to store
   */
  function storeWorkoutDataInLocalStorage(data) {
    try {
      // Get current date and time in Los Angeles time (America/Los_Angeles)
      const now = new Date();
      const laDateTime = now.toLocaleString('en-CA', {
        timeZone: 'America/Los_Angeles',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).replace(',', ''); // e.g., "2025-08-07 15:03"
      
      // Create the new workout session with datetime
      const workoutSession = [laDateTime, data];
      
      const currentDataInLocalStorage = localStorage.getItem('gymWhisperData');
      if(currentDataInLocalStorage === null){
        const jsonString = JSON.stringify([workoutSession]);
        localStorage.setItem('gymWhisperData', jsonString);
        return;
      }
      const currentData = JSON.parse(currentDataInLocalStorage);
      const newData = [...currentData, workoutSession];
      const jsonString = JSON.stringify(newData);
      localStorage.setItem('gymWhisperData', jsonString);
    } catch (e) {
      console.error('Failed to store data in localStorage:', e);
    }
  }

  /**
   * Initiates the workout finalization process
   */
  const handleFinalize = () => {
    if (hasNeedsReviewEntries()) {
      alert(t('reviewRequired'));
      return;
    }
    storeWorkoutDataInLocalStorage(workoutData);
    setFinalizing(true);
    setFinalizedWorkout(workoutData);
  };

  /**
   * Confirms the finalization and closes the panel
   */
  const confirmFinalize = () => {
    setShowConfirmDialog(false);
    setFinalizing(false);
    setFinalizedWorkout(null);
    setWorkoutData([]);
    setPanelOpen(false);
  };

  /**
   * Cancels the finalization process
   */
  const cancelFinalize = () => {
    setFinalizing(false);
    setFinalizedWorkout(null);
  };

  /**
   * Removes a workout entry from the list
   * @param {number} index - Index of the entry to remove
   */
  const removeEntry = (index) => {
    setWorkoutData((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) cancelEditing();
  };

  /**
   * Removes the NeedsReview flag from a workout entry
   * @param {number} index - Index of the entry to approve
   */
  const approveEntry = (index) => {
    setWorkoutData((prev) =>
      prev.map((entry, i) => {
        if (i === index) {
          // Remove the NeedsReview flag from the CSV string, but keep the date (if present)
          const parts = entry.split(',');
          // If NeedsReview is present as the 4th part, and there is a 5th part (date)
          if (parts[3] === 'NeedsReview') {
            // Remove the 4th part (NeedsReview), keep the rest
            return [parts[0], parts[1], parts[2], ...(parts.length > 4 ? [parts[4]] : [])].join(',');
          }
        }
        return entry;
      }),
    );
  };

  /**
   * Checks if there are any entries with NeedsReview flag
   */
  const hasNeedsReviewEntries = () => {
    return workoutData?.some(entry => entry.includes('NeedsReview'));
  };

  /**
   * Handles clicking outside the panel to close it
   */
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      if (finalizing) {
        cancelFinalize();
      } else {
        setPanelOpen(false);
      }
    }
  };

  return (
    <AnimatePresence>
      {panelOpen && (
        <>
          {/* Overlay for clicking outside to close */}
          <motion.div
            className="panel-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleOverlayClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleOverlayClick(e);
              }
            }}
            aria-label="Close workout panel"
          />
          
          <motion.div
            className="panel"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="workout-panel-title"
          >
            <div
              className="panel-header"
            >
              <h2 id="workout-panel-title">{finalizing ? 'Finalize Workout' : 'Your Workout'}</h2>
              <button
                onClick={() => finalizing ? cancelFinalize() : setPanelOpen(false)}
                className="icon-btn"
                aria-label={finalizing ? 'Cancel finalize' : 'Close workout panel'}
              >
                <ArrowLeft size={24} className="rotated" />
              </button>
            </div>

            {finalizing ? (
              <WorkoutFinalizeView
                finalizedWorkout={finalizedWorkout}
                setShowConfirmDialog={setShowConfirmDialog}
                cancelFinalize={cancelFinalize}
              />
            ) : (workoutData?.length === 0 || !workoutData) ? (
              <div className="empty-workouts">
                <p>No workout data yet</p>
                <p>Record your exercises to see them here</p>
              </div>
            ) : (
              <>
                <div className="workout-table-wrapper">
                  <table className="workout-table" role="grid" aria-label="Workout entries">
                    <thead>
                      <tr>
                        <th scope="col">Exercise</th>
                        <th scope="col">Sets</th>
                        <th scope="col" aria-label="Actions"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(organizedWorkoutData).map(([workoutType, entries]) => (
                        <React.Fragment key={workoutType}>
                          {/* Exercise Name Row */}
                          <tr className="exercise-header-row">
                            <td colSpan="3" className="exercise-name-header">
                              {workoutType}
                            </td>
                          </tr>
                          {/* Individual Sets */}
                          {entries.map(({ entry, originalIndex, parts }) => {
                            const reps = parts[1] || '';
                            const weight = parts[2] || '';
                            const needsReview = parts[3] === 'NeedsReview';
                            const isEditing = editingIndex === originalIndex;

                            return (
                              <tr key={originalIndex} className={isEditing ? 'editing' : 'set-row'}>
                                <td></td>
                                <td className="set-info-cell">
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      value={editText}
                                      onChange={(e) => setEditText(e.target.value)}
                                      className="edit-input"
                                      aria-label="Edit workout entry"
                                    />
                                  ) : (
                                    <div className="set-info-container">
                                      <span className="set-info">
                                        {reps} x {weight}
                                      </span>
                                      {needsReview && (
                                        <div className="review-section">
                                          <span className="review-warning">{t('needsReview')}</span>
                                          <button
                                            onClick={() => {
                                              approveEntry(originalIndex);
                                            }}
                                            style={{backgroundColor: 'green', color: 'white', borderRadius: '5px', padding: '4px 8px', fontSize: '12px', borderWidth: '0px', marginLeft: '8px'}}
                                            aria-label="Approve this entry"
                                            title="Approve entry"
                                          >
                                            Yes
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </td>
                                <td className="actions-cell">
                                  {isEditing ? (
                                    <>
                                      <button
                                        onClick={saveEditing}
                                        className="icon-btn action-btn"
                                        aria-label="Save edit"
                                        title="Save"
                                      >
                                        <Check size={20} />
                                      </button>
                                      <button
                                        onClick={cancelEditing}
                                        className="icon-btn action-btn"
                                        aria-label="Cancel edit"
                                        title="Cancel"
                                      >
                                        <X size={20} />
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => startEditing(originalIndex)}
                                        className="icon-btn action-btn"
                                        aria-label={`Edit workout entry ${originalIndex + 1}`}
                                        title="Edit"
                                      >
                                        <Edit2 size={20} />
                                      </button>
                                      <button
                                        onClick={() => removeEntry(originalIndex)}
                                        className="icon-btn action-btn"
                                        aria-label={`Delete workout entry ${originalIndex + 1}`}
                                        title="Delete"
                                      >
                                        <Trash2 size={20} />
                                      </button>
                                    </>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="finalize-button-container">
                  <button onClick={handleFinalize} className="workout-btn">
                    Finalize Workout
                  </button>
                </div>
              </>
            )}

            <ConfirmationDialog
              isOpen={showConfirmDialog}
              onConfirm={confirmFinalize}
              onCancel={() => setShowConfirmDialog(false)}
              message="Are you sure you want to export your workout? This action cannot be undone and your current workout will be erased."
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}