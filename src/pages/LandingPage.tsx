// src/pages/LandingPage.tsx
import { Link } from 'react-router-dom'
import { SignedOut, SignInButton } from '@clerk/clerk-react'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-xl font-bold text-gray-900">KanbanFlow</span>
          </div>
          
          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn-primary">
                Entrar
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Organize suas tarefas com 
            <span className="text-primary-600"> eficiência</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            O sistema Kanban perfeito para equipes que precisam de colaboração 
            em tempo real e gestão visual de projetos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="btn-primary text-lg px-8 py-4">
                  Começar Agora
                </button>
              </SignInButton>
            </SignedOut>
            
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-primary-600 text-2xl">📋</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Quadros Dinâmicos</h3>
              <p className="text-gray-600">Crie e personalize colunas ilimitadas para seu fluxo de trabalho</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-primary-600 text-2xl">👥</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Colaboração</h3>
              <p className="text-gray-600">Trabalhe em equipe com atualizações em tempo real</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-primary-600 text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Drag & Drop</h3>
              <p className="text-gray-600">Movimente tarefas intuitivamente entre colunas</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>© 2024 KanbanFlow. Desenvolvido para o desafio técnico.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage