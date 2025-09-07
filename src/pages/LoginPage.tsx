// src/pages/LoginPage.tsx
import { useState } from 'react'
import { SignIn } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

const LoginPage = () => {
  const [isSignIn, setIsSignIn] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isSignIn ? 'Bem-vindo de volta' : 'Crie sua conta'}
          </h1>
          <p className="text-gray-600">
            {isSignIn ? 'Entre no seu quadro Kanban' : 'Comece a gerenciar suas tarefas'}
          </p>
        </div>

        {isSignIn ? (
          <SignIn 
            routing="path"
            path="/sign-in"
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'shadow-none bg-transparent',
                headerTitle: 'text-2xl font-bold text-gray-900',
                headerSubtitle: 'text-gray-600',
                formButtonPrimary: 'btn-primary w-full',
                footerActionLink: 'text-primary-600 hover:text-primary-700',
              }
            }}
          />
        ) : (
          <SignIn 
            routing="path"
            path="/sign-up"
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'shadow-none bg-transparent',
                headerTitle: 'text-2xl font-bold text-gray-900',
                headerSubtitle: 'text-gray-600',
                formButtonPrimary: 'btn-primary w-full',
                footerActionLink: 'text-primary-600 hover:text-primary-700',
              }
            }}
          />
        )}

        <div className="text-center mt-6">
          <button
            onClick={() => setIsSignIn(!isSignIn)}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            {isSignIn ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entre'}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              ← Voltar para o início
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage