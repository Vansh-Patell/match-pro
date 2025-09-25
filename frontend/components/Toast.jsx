import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyles = () => {
    const baseStyles = "fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg backdrop-blur-sm border transition-all duration-300";
    
    if (!isVisible) {
      return baseStyles + " opacity-0 translate-x-full";
    }

    switch (type) {
      case 'success':
        return baseStyles + " bg-green-500/20 border-green-500/30 text-green-400";
      case 'error':
        return baseStyles + " bg-red-500/20 border-red-500/30 text-red-400";
      case 'warning':
        return baseStyles + " bg-yellow-500/20 border-yellow-500/30 text-yellow-400";
      default:
        return baseStyles + " bg-blue-500/20 border-blue-500/30 text-blue-400";
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className={getToastStyles()}>
      <div className="flex items-center gap-3">
        <span className="text-lg">{getIcon()}</span>
        <span className="font-medium">{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-2 text-slate-400 hover:text-white transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
};

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const toast = { id, message, type, duration };
    setToasts(prev => [...prev, toast]);
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Make addToast available globally
  React.useEffect(() => {
    window.showToast = addToast;
    return () => {
      delete window.showToast;
    };
  }, []);

  return (
    <div>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export { Toast, ToastContainer };