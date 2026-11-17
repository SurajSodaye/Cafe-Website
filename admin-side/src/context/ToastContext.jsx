import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = "success", duration = 3500) => {
    const id = "toast-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4);
    const newToast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div 
        role="region" 
        aria-live="polite" 
        aria-label="Notifications"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((toast) => {
          let bgColor = "bg-espresso text-cream border-espresso-light";
          let icon = <CheckCircle2 className="w-5 h-5 text-sage flex-shrink-0" />;

          if (toast.type === "error") {
            bgColor = "bg-red-950 text-red-50 border-red-800";
            icon = <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />;
          } else if (toast.type === "warning") {
            bgColor = "bg-amber-950 text-amber-50 border-amber-800";
            icon = <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />;
          } else if (toast.type === "info") {
            bgColor = "bg-espresso-dark text-cream border-espresso-light";
            icon = <Info className="w-5 h-5 text-terracotta flex-shrink-0" />;
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-warm border transition-all duration-200 animate-slide-up ${bgColor}`}
            >
              {icon}
              <div className="flex-1 text-sm font-sans font-medium leading-snug">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-cream/60 hover:text-cream transition-colors p-0.5 rounded focus:outline-none focus:ring-1 focus:ring-terracotta"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
