import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConfirmationDialog({ isOpen, onConfirm, onCancel, message }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="confirmation-dialog"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="confirmation-content"
          >
            <h3 style={{ marginBottom: '16px', color: 'var(--color-recording)' }}>Warning</h3>
            <p>{message}</p>
            <div className="confirmation-buttons">
              <button onClick={onCancel} className="workout-btn finalize-cancel">Cancel</button>
              <button onClick={onConfirm} className="workout-btn finalize-confirm">Confirm</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}