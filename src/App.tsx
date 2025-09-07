// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Toaster } from '@/components/ui/Toaster'
import LandingPage from '@/pages/LandingPage'
import Dashboard from '@/pages/Dashboard'
import BoardPage from '@/pages/BoardPage'
import Navbar from '@/components/layout/Navbar'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import ApiConfig from '@/components/auth/ApiConfig'
function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <ApiConfig /> {/* ✅ Adicione isso */}
          <SignedOut>
            <LandingPage />
          </SignedOut>
          <SignedIn>
            <Navbar />
            <main className="pt-16">
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/board/:boardId" 
                  element={
                    <ProtectedRoute>
                      <BoardPage />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
          </SignedIn>
          <Toaster />
        </div>
      </Router>
    </DndProvider>
  )
}
export default App