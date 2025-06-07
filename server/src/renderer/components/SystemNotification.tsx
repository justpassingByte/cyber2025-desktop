import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SystemNotificationProps {
  type?: 'success' | 'error' | 'info';
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseTime?: number;
}

const SystemNotification: React.FC<SystemNotificationProps> = ({
  type = 'info',
  message,
  onClose,
  autoClose = true,
  autoCloseTime = 3000,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) setTimeout(onClose, 300);
      }, autoCloseTime);
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseTime, onClose]);

  let bg, border, text, icon;
  if (type === 'success') {
    bg = 'bg-green-100'; border = 'border-green-500'; text = 'text-green-700';
    icon = (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    );
  } else if (type === 'error') {
    bg = 'bg-red-100'; border = 'border-red-500'; text = 'text-red-700';
    icon = (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  } else if (type === 'info') {
    bg = 'bg-purple-100'; border = 'border-purple-500'; text = 'text-purple-700';
    icon = (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
      </svg>
    );
  } else {
    bg = 'bg-blue-100'; border = 'border-blue-500'; text = 'text-blue-700';
    icon = (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 p-4 shadow-md rounded-md z-50 max-w-md ${bg} border-l-4 ${border} ${text}`}
          role="alert"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {icon}
              <span>{message}</span>
            </div>
            <button
              className="ml-4 text-gray-500 hover:text-gray-700"
              onClick={() => { setVisible(false); if (onClose) setTimeout(onClose, 300); }}
            >×</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SystemNotification; 