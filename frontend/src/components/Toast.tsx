import React, { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (type: Toast['type'], message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (type: Toast['type'], message: string, duration = 3000) => {
    const id = Date.now().toString();
    const toast: Toast = { id, type, message, duration };
    
    setToasts(prev => [...prev, toast]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer: React.FC<{
  toasts: Toast[];
  onRemove: (id: string) => void;
}> = ({ toasts, onRemove }) => (
  <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
    {toasts.map(toast => (
      <ToastItem
        key={toast.id}
        toast={toast}
        onClose={() => onRemove(toast.id)}
      />
    ))}
  </div>
);

const ToastItem: React.FC<{
  toast: Toast;
  onClose: () => void;
}> = ({ toast, onClose }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
  };

  const colors = {
    success: {
      bg: 'bg-success/20',
      border: 'border-success',
      icon: 'text-success',
    },
    error: {
      bg: 'bg-danger/20',
      border: 'border-danger',
      icon: 'text-danger',
    },
    info: {
      bg: 'bg-neon-cyan/20',
      border: 'border-neon-cyan',
      icon: 'text-neon-cyan',
    },
    warning: {
      bg: 'bg-warning/20',
      border: 'border-warning',
      icon: 'text-warning',
    },
  };

  const color = colors[toast.type];

  return (
    <div
      className={`${color.bg} border ${color.border} rounded-lg p-4 flex items-start gap-3 animate-slide-up`}
    >
      <div className={color.icon}>{icons[toast.type]}</div>
      <div className="flex-1 text-white text-sm">{toast.message}</div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
