// src/lib/api.ts
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Variável para armazenar a função getToken
let getTokenFn: (() => Promise<string | null>) | null = null

// Função para configurar a API UMA vez
export const configureApi = (getToken: () => Promise<string | null>) => {
  getTokenFn = getToken
  console.log('✅ API configurada com getToken')
  
  // Configurar interceptor
  api.interceptors.request.use(
    async (config) => {
      if (getTokenFn) {
        try {
          const token = await getTokenFn()
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
            console.log('✅ Token adicionado para:', config.url)
          }
        } catch (error) {
          console.error('❌ Erro ao obter token:', error)
        }
      }
      return config
    }
  )
}