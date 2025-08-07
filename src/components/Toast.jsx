// src/components/Toast.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Toast component for temporary feedback messages.
 *
 * Props:
 * - toastVisible: boolean to control visibility
 * - message: string to display
 */
export default function Toast({ toastVisible, message }) {
  return (
    <AnimatePresence>
      {toastVisible && (
        <motion.div
          // Prepend your CSS centering translateX
          transformTemplate={({ x, y, scale }, generatedTransform) =>
            `translateX(-50%) ${generatedTransform}`
          }
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="toast"
          role="alert"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
