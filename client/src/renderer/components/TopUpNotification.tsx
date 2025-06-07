import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TopUpNotificationProps {
  username: string;
  amount: number;
  message?: string;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseTime?: number;
  isAdminView?: boolean;
}

const TopUpNotification: React.FC<TopUpNotificationProps> = ({
  username,
  amount,
  message,
  onClose,
  autoClose = true,
  autoCloseTime = 5000,
  isAdminView = false,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) {
          setTimeout(onClose, 300); // Allow exit animation to complete
        }
      }, autoCloseTime);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseTime, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 p-4 shadow-md rounded-md z-50 max-w-md ${
            isAdminView 
              ? 'bg-blue-100 border-l-4 border-blue-500 text-blue-700' 
              : 'bg-green-100 border-l-4 border-green-500 text-green-700'
          }`}
          role="alert"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="font-bold text-lg mb-1">
                {isAdminView ? 'Admin Notification: Top-up' : 'Top-up Successful'}
              </div>
              <p className="text-sm">
                <span className="font-semibold">{username}</span> topped up{' '}
                <span className="font-semibold">{amount.toLocaleString()} VND</span>
              </p>
              {message && <p className="text-xs mt-1 text-gray-600">{message}</p>}
            </div>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => {
                setVisible(false);
                if (onClose) {
                  setTimeout(onClose, 300);
                }
              }}
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TopUpNotification; 