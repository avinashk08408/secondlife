import React from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-[#FAF8F2]/95 border border-[#DCD6C9] shadow-xl shadow-[#1F211F]/10 backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#2E5E4E]" />}
              {isWarning && <AlertCircle className="w-5 h-5 text-[#8D5A44]" />}
              {!isSuccess && !isWarning && <Info className="w-5 h-5 text-[#535550]" />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold font-display text-[#1F211F] tracking-wide">
                {toast.title}
              </h4>
              <p className="text-xs text-[#535550] mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="shrink-0 p-1 text-[#73756F] hover:text-[#1F211F] transition-colors rounded-md"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
