"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
}

type ToastListener = (toast: Omit<ToastItem, "id">) => void;
const toastListeners = new Set<ToastListener>();

export const toast = {
  show: (toastData: Omit<ToastItem, "id">) => {
    toastListeners.forEach((listener) => listener(toastData));
  },
  success: (message: string, title?: string) => {
    toast.show({ type: "success", title: title || "Success", message });
  },
  error: (message: string, title?: string) => {
    toast.show({ type: "error", title: title || "Error", message });
  },
  info: (message: string, title?: string) => {
    toast.show({ type: "info", title: title || "Information", message });
  },
};

interface ToastContextType {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, "id">) => string;
  removeToast: (id: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Graceful fallback to global toast methods
    return {
      toasts: [],
      addToast: (t: Omit<ToastItem, "id">) => {
        toast.show(t);
        return "";
      },
      removeToast: () => {},
      success: toast.success,
      error: toast.error,
      info: toast.info,
    };
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type, title, message }: Omit<ToastItem, "id">) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      setToasts((prev) => [...prev, { id, type, title, message }]);

      // Auto dismiss after 5s
      setTimeout(() => {
        removeToast(id);
      }, 5000);

      return id;
    },
    [removeToast]
  );

  useEffect(() => {
    toastListeners.add(addToast);
    return () => {
      toastListeners.delete(addToast);
    };
  }, [addToast]);

  const success = useCallback(
    (message: string, title?: string) => {
      addToast({ type: "success", title: title || "Success", message });
    },
    [addToast]
  );

  const error = useCallback(
    (message: string, title?: string) => {
      addToast({ type: "error", title: title || "Error", message });
    },
    [addToast]
  );

  const info = useCallback(
    (message: string, title?: string) => {
      addToast({ type: "info", title: title || "Information", message });
    },
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast, success, error, info }}
    >
      {children}
      {/* Toast container floating on screen */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse gap-2.5 p-4 sm:max-w-md sm:p-6"
      >
        {toasts.map((item) => (
          <Toast key={item.id} toast={item} onDismiss={() => removeToast(item.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export interface ToastProps {
  toast: ToastItem;
  onDismiss: () => void;
}

export function Toast({ toast: item, onDismiss }: ToastProps) {
  const typeIcons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />,
    info: <Info className="h-5 w-5 text-sky-600 shrink-0" />,
  };

  const typeBorder: Record<ToastType, string> = {
    success: "border-emerald-200 bg-white",
    error: "border-red-200 bg-white",
    info: "border-sky-200 bg-white",
  };

  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto flex w-full items-start gap-3 rounded-xl border p-4 shadow-lg transition-all animate-in slide-in-from-bottom-5 duration-200",
        typeBorder[item.type]
      )}
    >
      {typeIcons[item.type]}
      <div className="flex-1 space-y-0.5">
        {item.title && (
          <h4 className="text-sm font-semibold text-neutral-900">
            {item.title}
          </h4>
        )}
        <p className="text-xs text-neutral-600 leading-relaxed">
          {item.message}
        </p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="rounded-md p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
