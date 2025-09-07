// src/components/ApiConfig.tsx
import { useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { configureApi } from '@/lib/api'

const ApiConfig = () => {
  const { getToken, isLoaded } = useAuth()

  useEffect(() => {
    if (isLoaded) {
      console.log('🔧 Configurando API...')
      configureApi(getToken)
      
      // Testar se o token está disponível
      getToken().then(token => {
        console.log('✅ Token test:', token ? `SIM (${token.length} chars)` : 'NÃO')
      })
    }
  }, [getToken, isLoaded])

  return null
}

export default ApiConfig