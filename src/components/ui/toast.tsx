"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export type ToastType = "success" | "error" | "info" | "warning"

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastProps {
  toast: Toast
  onClose: (id: string) => void
}

export function ToastComponent({ toast, onClose }: ToastProps) {
  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        onClose(toast.id)
      }, toast.duration)

      return () => clearTimeout(timer)
    }
  }, [toast.id, toast.duration, onClose])

  const typeStyles = {
    success: "bg-green-500 border-green-600 text-white",
    error: "bg-red-500 border-red-600 text-white",
    info: "bg-blue-500 border-blue-600 text-white",
    warning: "bg-yellow-500 border-yellow-600 text-white",
  }

  const iconStyles = {
    success: "✓",
    error: "✕",
    info: "ℹ",
    warning: "⚠",
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border-2 min-w-[300px] max-w-[500px] animate-slide-in",
        typeStyles[toast.type]
      )}
      role="alert"
    >
      <span className="text-lg font-semibold flex-shrink-0">
        {iconStyles[toast.type]}
      </span>
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 hover:opacity-80 transition-opacity"
        aria-label="Close toast"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

