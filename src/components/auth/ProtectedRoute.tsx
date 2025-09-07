// src/components/auth/ProtectedRoute.tsx
import { useAuth } from '@clerk/clerk-react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!isSignedIn) {
    return <div>Redirecionando para login...</div>
  }

  return <>{children}</>
}

export default ProtectedRoute