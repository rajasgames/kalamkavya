import React, { ReactNode } from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { create } from 'zustand';
import { X, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

export type ToastVariant = 'success' | 'warning' | 'error';

export interface ToastMessage {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
}

interface ToastStore {
  toasts: ToastMessage[];
  addToast: (message: string, variant: ToastVariant, duration?: number) => void;
  removeToast: (id: string) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, variant, duration) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      // Max 3 toasts visible
      toasts: [...state.toasts, { id, message, variant, duration }].slice(-3),
    }));
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const addToast = useToastStore((state) => state.addToast);

  const showToast = (message: string, variant: ToastVariant, duration?: number) => {
    let finalDuration = duration;
    if (!finalDuration) {
      if (variant === 'error') finalDuration = 5000;
      else if (variant === 'warning') finalDuration = 4000;
      else finalDuration = 3000;
    }
    addToast(message, variant, finalDuration);
  };

  return { showToast };
};

const ICONS = {
  success: <CheckCircle className="text-primary" size={20} />,
  warning: <AlertTriangle className="text-primary" size={20} />,
  error: <AlertCircle className="text-primary" size={20} />,
};

const BORDERS = {
  success: '',
  warning: '',
  error: '',
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <ToastPrimitive.Provider swipeDirection="right">
      {children}

      {toasts.map((toast) => (
        <ToastPrimitive.Root
          key={toast.id}
          duration={toast.duration}
          onOpenChange={(open) => {
            if (!open) removeToast(toast.id);
          }}
          className={`bg-surface border border-subtle ${
            BORDERS[toast.variant]
          } rounded-none p-4 flex items-start gap-3 w-full max-w-[360px] data-[state=open]:animate-toast-slide-in data-[state=closed]:animate-toast-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-toast-swipe-out`}
        >
          <div className="flex-shrink-0 mt-0.5">{ICONS[toast.variant]}</div>
          <ToastPrimitive.Description className="text-sm font-sans text-primary flex-1 leading-snug">
            {toast.message}
          </ToastPrimitive.Description>
          <ToastPrimitive.Close
            className="text-ghost hover:text-primary transition-colors focus:outline-none flex-shrink-0"
            aria-label="Close"
          >
            <X size={16} />
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}

      <ToastPrimitive.Viewport className="fixed bottom-0 right-0 p-4 sm:p-6 flex flex-col gap-3 w-full sm:w-auto max-w-[100vw] z-50 outline-none" />
    </ToastPrimitive.Provider>
  );
};
