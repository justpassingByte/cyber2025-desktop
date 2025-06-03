import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  widthClass?: string;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 40 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { 
      type: 'spring', 
      stiffness: 400, 
      damping: 30,
      bounce: 0.15
    } 
  },
};

const Modal: React.FC<ModalProps> = ({ open, onClose, children, title, widthClass = 'max-w-lg' }) => {
  // Close on Escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (open && e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
          onClick={onClose}
        >
          <motion.div
            className={`bg-white rounded-xl shadow-2xl border border-border/50 w-full ${widthClass} mx-4 relative overflow-hidden`}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div 
              className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/70 to-primary"
              initial={{ scaleX: 0, transformOrigin: "left" }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
            />
            
            <motion.button
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/80 text-muted-foreground hover:text-foreground hover:bg-slate-100 flex items-center justify-center"
              onClick={onClose}
              aria-label="Đóng"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-4 h-4" />
            </motion.button>
            
            {title && (
              <motion.div 
                className="px-6 pt-6 pb-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h2 className="text-xl font-bold text-foreground">{title}</h2>
              </motion.div>
            )}
            
            <motion.div 
              className="px-6 pb-6 pt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal; 