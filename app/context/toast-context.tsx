import { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from "react"
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react"

type ToastVariant = "success" | "error" | "warning" | "info"

type ToastPhase = "enter" | "visible" | "exit"

interface Toast {
  id: string
  message: string
  variant: ToastVariant
  phase: ToastPhase
}

interface ToastContextType {
  toast: (message: string, variant?: ToastVariant) => void
  success: (message: string) => void
  error: (message: string) => void
  warning: (message: string) => void
  info: (message: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

const TOAST_DURATION = 4000
const EXIT_DURATION = 300

const variantStyles: Record<ToastVariant, string> = {
  success: "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200",
  error: "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200",
  warning: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200",
  info: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200",
}

const variantIcons: Record<ToastVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const removeToast = useCallback((id: string) => {
    timersRef.current.delete(id)
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const startExit = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, phase: "exit" as ToastPhase } : t))
    )
    setTimeout(() => removeToast(id), EXIT_DURATION)
  }, [removeToast])

  const addToast = useCallback(
    (message: string, variant: ToastVariant = "info") => {
      const id = Math.random().toString(36).slice(2) + Date.now().toString(36)
      setToasts((prev) => [...prev, { id, message, variant, phase: "enter" }])
      requestAnimationFrame(() => {
        setToasts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, phase: "visible" } : t))
        )
      })
      const timer = setTimeout(() => startExit(id), TOAST_DURATION)
      timersRef.current.set(id, timer)
    },
    [startExit]
  )

  const dismissToast = useCallback((id: string) => {
    const existing = timersRef.current.get(id)
    if (existing) clearTimeout(existing)
    timersRef.current.delete(id)
    startExit(id)
  }, [startExit])

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer))
    }
  }, [])

  const contextValue: ToastContextType = {
    toast: addToast,
    success: useCallback((msg: string) => addToast(msg, "success"), [addToast]),
    error: useCallback((msg: string) => addToast(msg, "error"), [addToast]),
    warning: useCallback((msg: string) => addToast(msg, "warning"), [addToast]),
    info: useCallback((msg: string) => addToast(msg, "info"), [addToast]),
  }

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      <div className="fixed top-16 left-4 right-4 sm:left-auto sm:right-4 z-[100] flex flex-col gap-2 max-w-sm w-auto sm:w-full pointer-events-none">
        {toasts.map((t) => {
          const Icon = variantIcons[t.variant]
          const phaseClass =
            t.phase === "exit"
              ? "translate-x-[120%] opacity-0"
              : "translate-x-0 opacity-100"
          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg transition-all duration-300 ease-in-out ${phaseClass} ${variantStyles[t.variant]}`}
              style={t.phase === "enter" ? { transform: "translateX(120%)", opacity: 0 } : undefined}
            >
              <Icon className="h-5 w-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium flex-1">{t.message}</p>
              <button
                onClick={() => dismissToast(t.id)}
                className="shrink-0 rounded-md p-0.5 opacity-70 hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
