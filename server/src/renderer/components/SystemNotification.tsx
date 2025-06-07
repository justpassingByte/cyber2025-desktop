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

  let bg, border, text;
  if (type === 'success') {
    bg = 'bg-green-100'; border = 'border-green-500'; text = 'text-green-700';
  } else if (type === 'error') {
    bg = 'bg-red-100'; border = 'border-red-500'; text = 'text-red-700';
  } else {
    bg = 'bg-blue-100'; border = 'border-blue-500'; text = 'text-blue-700';
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
            <div>{message}</div>
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