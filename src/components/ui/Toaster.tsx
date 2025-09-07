// src/components/ui/Toaster.tsx
import { useToast } from '@/hooks/useToast'

export const Toaster = () => {
  const { toasts, remove } = useToast()

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-success-100 border-success-200'
      case 'error': return 'bg-error-100 border-error-200'
      case 'warning': return 'bg-warning-100 border-warning-200'
      case 'info': return 'bg-primary-100 border-primary-200'
      default: return 'bg-gray-100 border-gray-200'
    }
  }

  const getTextColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-success-800'
      case 'error': return 'text-error-800'
      case 'warning': return 'text-warning-800'
      case 'info': return 'text-primary-800'
      default: return 'text-gray-800'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`min-w-80 border rounded-lg p-4 shadow-lg animate-slide-in ${getBgColor(toast.type)}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className={`font-semibold ${getTextColor(toast.type)}`}>
                {toast.title}
              </h4>
              {toast.description && (
                <p className={`mt-1 text-sm ${getTextColor(toast.type)}`}>
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => remove(toast.id)}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}