import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UtensilsCrossed } from 'lucide-react';

interface FoodOrderNotificationProps {
  customerName: string;
  foodItems: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
  timestamp: number;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseTime?: number;
}

const FoodOrderNotification: React.FC<FoodOrderNotificationProps> = ({
  customerName,
  foodItems,
  totalAmount,
  timestamp,
  onClose,
  autoClose = true,
  autoCloseTime = 5000,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, autoCloseTime);
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseTime, onClose]);

  if (!isVisible) return null;

  const formattedTime = new Date(timestamp).toLocaleTimeString();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="fixed right-4 top-4 z-50 w-80 rounded-lg bg-white shadow-lg border border-gray-200 p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <UtensilsCrossed className="h-4 w-4" />
              </div>
              <h3 className="text-md font-semibold text-gray-900">Đơn hàng mới</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm text-gray-700">
            <span className="font-medium">{customerName}</span> đã đặt một đơn hàng mới vào lúc <span className="font-medium">{formattedTime}</span>.
          </p>
          <div className="border-t border-gray-200 pt-2">
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {foodItems.map((item, index) => (
                <li key={index}>{item.name} x {item.quantity} ({item.price.toLocaleString()} VND)</li>
              ))}
            </ul>
            <p className="text-sm font-semibold text-gray-800 mt-2">Tổng cộng: {totalAmount.toLocaleString()} VND</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FoodOrderNotification; 