import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, LogIn } from 'lucide-react';

interface LoginNotificationProps {
  customer: {
    id: number;
    name: string;
    email?: string;
  };
  timestamp: number;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseTime?: number;
}

const LoginNotification: React.FC<LoginNotificationProps> = ({
  customer,
  timestamp,
  onClose,
  autoClose = false,
  autoCloseTime = 5000
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, autoCloseTime);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseTime, onClose]);

  const formatTime = (timestamp: number) => {
    const now = new Date(timestamp);
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 right-4 max-w-md w-full bg-green-50 border border-green-200 rounded-lg shadow-lg overflow-hidden z-50"
        >
          <div className="flex items-start p-4">
            <div className="flex-shrink-0 bg-green-100 rounded-full p-2 mr-3">
              <LogIn className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1 pt-0.5">
              <h3 className="text-sm font-medium text-green-800">Đăng nhập thành công</h3>
              <div className="mt-1 flex items-center">
                <User className="h-4 w-4 text-green-600 mr-1" />
                <p className="text-sm text-green-700">
                  <span className="font-semibold">{customer.name}</span> vừa đăng nhập
                </p>
              </div>
              <p className="mt-1 text-xs text-green-600">
                {customer.email ? `Email: ${customer.email}` : 'Không có email'}
              </p>
              <p className="text-xs text-green-500 mt-1">
                {formatTime(timestamp)}
              </p>
            </div>
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="flex-shrink-0 ml-2 text-green-500 hover:text-green-700 focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {autoClose && (
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: autoCloseTime / 1000, ease: 'linear' }}
              className="h-1 bg-green-500"
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginNotification; 