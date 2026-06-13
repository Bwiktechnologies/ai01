import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-[var(--color-success)]" />,
    error: <XCircle className="w-5 h-5 text-[var(--color-error)]" />,
    info: <Info className="w-5 h-5 text-[var(--color-accent)]" />
  };

  const bgs = {
    success: 'bg-[#ECFDF5] border-[#A7F3D0]',
    error: 'bg-[#FEF2F2] border-[#FECACA]',
    info: 'bg-[#FFFBEB] border-[#FDE68A]'
  };

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`fixed top-4 right-4 z-50 flex items-start gap-3 p-4 border rounded-xl shadow-lg max-w-sm ${bgs[type]}`}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <p className="flex-1 text-[14px] font-medium text-[var(--color-text-primary)]">{message}</p>
      <button onClick={onClose} className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
        <X className="w-5 h-5" />
      </button>
    </motion.div>
  );
};

export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-0 right-0 z-50 p-4 pointer-events-none flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast {...toast} onClose={() => removeToast(toast.id)} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
