// src/components/WorkoutPanel.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Trash2, Edit2, Check, X } from "lucide-react"; // Import necessary icons

/**
 * WorkoutPanel displays and manages the user's workout entries.
 * It includes functionality for viewing, editing, and deleting entries.
 *
 * Props:
 * - panelOpen: boolean indicating if the panel is open
 * - setPanelOpen: function to change the panel's open state
 * - workoutData: array of workout entries (strings, CSV format)
 * - setWorkoutData: function to update the workoutData array
 */
export default function WorkoutPanel({
  panelOpen,
  setPanelOpen,
  workoutData,
  setWorkoutData,
}) {
  // State for editing functionality, now local to WorkoutPanel
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");

  // Edit workout entry functions, now local to WorkoutPanel
  const startEditing = (index) => {
    setEditingIndex(index);
    setEditText(workoutData[index]);
  };
  const cancelEditing = () => {
    setEditingIndex(null);
    setEditText("");
  };
  const saveEditing = () => {
    if (editText.trim() === "") return;
    setWorkoutData((prev) =>
      prev.map((item, i) => (i === editingIndex ? editText.trim() : item))
    );
    setEditingIndex(null);
    setEditText("");
  };

  // Remove workout entry function, now local to WorkoutPanel
  const removeEntry = (index) => {
    setWorkoutData((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) cancelEditing(); // If the deleted item was being edited
  };

  return (
    <AnimatePresence>
      {panelOpen && (
        <motion.div
          className="panel"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "tween", duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="workout-panel-title"
        >
          <div className="panel-header">
            <h2 id="workout-panel-title">Your Workout</h2>
            <button
              onClick={() => setPanelOpen(false)}
              className="icon-btn"
              aria-label="Close workout panel"
            >
              <ArrowLeft size={24} className="rotated" />
            </button>
          </div>

          {workoutData.length === 0 ? (
            <div className="empty-workouts">
              <p>No workout data yet</p>
              <p>Record your exercises to see them here</p>
            </div>
          ) : (
            <div className="workout-table-wrapper">
              <table
                className="workout-table"
                role="grid"
                aria-label="Workout entries"
              >
                <thead>
                  <tr>
                    <th scope="col">WorkoutType</th>
                    <th scope="col">Reps</th>
                    <th scope="col">Weight</th>
                    <th scope="col" aria-label="Actions"></th>
                  </tr>
                </thead>
                <tbody>
                  {workoutData.map((entry, idx) => {
                    // parse CSV string (WorkoutType,Reps,Weight)
                    const parts = entry.split(",");
                    const workoutType = parts[0] || "";
                    const reps = parts[1] || "";
                    const weight = parts[2] || "";

                    const isEditing = editingIndex === idx;

                    return (
                      <tr key={idx} className={isEditing ? "editing" : ""}>
                        <td>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="edit-input"
                              aria-label="Edit workout entry"
                            />
                          ) : (
                            workoutType
                          )}
                        </td>
                        <td>{isEditing ? "" : reps}</td>
                        <td>{isEditing ? "" : weight}</td>
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
                                onClick={() => startEditing(idx)}
                                className="icon-btn action-btn"
                                aria-label={`Edit workout entry ${idx + 1}`}
                                title="Edit"
                              >
                                <Edit2 size={20} />
                              </button>
                              <button
                                onClick={() => removeEntry(idx)}
                                className="icon-btn action-btn"
                                aria-label={`Delete workout entry ${idx + 1}`}
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
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}