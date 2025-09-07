// src/hooks/useToast.ts
import { useState } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { ...toast, id }])
    
    // Auto remove after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, toast.duration || 5000)
  }

  const success = (title: string, description?: string) => {
    toast({ type: 'success', title, description })
  }

  const error = (title: string, description?: string) => {
    toast({ type: 'error', title, description })
  }

  const warning = (title: string, description?: string) => {
    toast({ type: 'warning', title, description })
  }

  const info = (title: string, description?: string) => {
    toast({ type: 'info', title, description })
  }

  const remove = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return {
    toasts,
    toast,
    success,
    error,
    warning,
    info,
    remove,
  }
}