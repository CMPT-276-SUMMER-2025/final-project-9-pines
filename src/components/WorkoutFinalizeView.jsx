import React from 'react';

export default function WorkoutFinalizeView({ finalizedWorkout, setShowConfirmDialog, cancelFinalize }) {
  return (
    <div className="finalize-summary">
      <h3>Workout Summary</h3>
      <div className="workout-table-wrapper">
        <table className="workout-table">
          <thead>
            <tr>
              <th scope="col">WorkoutType</th>
              <th scope="col">Reps</th>
              <th scope="col">Weight</th>
            </tr>
          </thead>
          <tbody>
            {finalizedWorkout.map((entry, idx) => {
              const parts = entry.split(",");
              return (
                <tr key={idx}>
                  <td>{parts[0] || ""}</td>
                  <td>{parts[1] || ""}</td>
                  <td>{parts[2] || ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="finalize-actions">
        <button onClick={() => setShowConfirmDialog(true)} className="workout-btn finalize-confirm">
          Confirm & Save
        </button>
        <button onClick={cancelFinalize} className="workout-btn finalize-cancel">
          Back to Edit
        </button>
      </div>
    </div>
  );
}