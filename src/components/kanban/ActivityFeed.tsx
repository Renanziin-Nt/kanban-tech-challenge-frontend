// components/kanban/ActivityFeed.tsx - VERSÃO COMPLETA COM DADOS REAIS
import { useState, useEffect } from 'react'
import { cardsApi, usersApi, columnsApi } from '@/services/api'
import { useToast } from '@/hooks/useToast'
import type { User, Card, Column } from '@/types'

interface ActivityLog {
  id: string
  cardId: string
  cardTitle?: string
  action: string
  oldValue?: string
  newValue?: string
  userId: string
  userName?: string
  userEmail?: string
  createdAt: string
  details?: any
}

interface EnrichedActivityLog extends ActivityLog {
  card?: Card
  user?: User
  sourceColumn?: Column
  targetColumn?: Column
}

interface ActivityFeedProps {
  boardId: string
  isOpen: boolean
  onClose: () => void
}

const ActivityFeed = ({ boardId, isOpen, onClose }: ActivityFeedProps) => {
  const [logs, setLogs] = useState<EnrichedActivityLog[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen && boardId) {
      fetchLogs()
    }
  }, [isOpen, boardId])

  const fetchLogs = async () => {
    try {
      setLoading(true)
      
      // 1. Buscar logs básicos
      const logsResponse = await cardsApi.getBoardActivity(boardId)
      const rawLogs: ActivityLog[] = logsResponse.data || []
      
      if (rawLogs.length === 0) {
        setLogs([])
        return
      }

      // 2. Extrair IDs únicos para fazer requisições em lote
      const userIds = [...new Set(rawLogs.map(log => log.userId).filter(Boolean))]
      const cardIds = [...new Set(rawLogs.map(log => log.cardId).filter(Boolean))]
      
      // Extrair IDs de colunas dos details (para movimentações)
      const columnIds = new Set<string>()
      rawLogs.forEach(log => {
        if (log.details) {
          try {
            const details = typeof log.details === 'string' ? JSON.parse(log.details) : log.details
            if (details.from) columnIds.add(details.from)
            if (details.to) columnIds.add(details.to)
          } catch (e) {
            // Ignora erros de parse
          }
        }
      })

      // 3. Fazer requisições em paralelo para buscar dados relacionados
      const [usersData, cardsData, columnsData] = await Promise.allSettled([
        Promise.all(userIds.map(id => usersApi.getById(id).catch(err => ({ error: err, id })))),
        Promise.all(cardIds.map(id => cardsApi.getById(id).catch(err => ({ error: err, id })))),
        Promise.all([...columnIds].map(id => columnsApi.getById(id).catch(err => ({ error: err, id }))))
      ])

      // 4. Criar mapas para lookup rápido
      const usersMap = new Map<string, User>()
      const cardsMap = new Map<string, Card>()
      const columnsMap = new Map<string, Column>()

      // Popular mapa de usuários
      if (usersData.status === 'fulfilled') {
        usersData.value.forEach(result => {
          if ('data' in result && result.data) {
            usersMap.set(result.data.id, result.data)
          }
        })
      }

      // Popular mapa de cards
      if (cardsData.status === 'fulfilled') {
        cardsData.value.forEach(result => {
          if ('data' in result && result.data) {
            cardsMap.set(result.data.id, result.data)
          }
        })
      }

      // Popular mapa de colunas
      if (columnsData.status === 'fulfilled') {
        columnsData.value.forEach(result => {
          if ('data' in result && result.data) {
            columnsMap.set(result.data.id, result.data)
          }
        })
      }

      // 5. Enriquecer logs com dados completos
      const enrichedLogs: EnrichedActivityLog[] = rawLogs.map(log => {
        const enriched: EnrichedActivityLog = {
          ...log,
          user: usersMap.get(log.userId),
          card: cardsMap.get(log.cardId)
        }

        // Adicionar informações de colunas para movimentações
        if (log.details) {
          try {
            const details = typeof log.details === 'string' ? JSON.parse(log.details) : log.details
            if (details.from) enriched.sourceColumn = columnsMap.get(details.from)
            if (details.to) enriched.targetColumn = columnsMap.get(details.to)
          } catch (e) {
            // Ignora erros de parse
          }
        }

        return enriched
      })

      setLogs(enrichedLogs)
    } catch (error: any) {
      console.error('Erro ao carregar logs:', error)
      toast({
        title: "Erro ao carregar logs",
        description: error.response?.data?.message || "Tente novamente",
        type: "error"
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'agora mesmo'
    if (diffInMinutes < 60) return `${diffInMinutes}min atrás`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
      case 'created':
        return '➕'
      case 'update':
      case 'updated':
        return '✏️'
      case 'move':
      case 'moved':
        return '↔️'
      case 'delete':
      case 'deleted':
        return '🗑️'
      default:
        return '📝'
    }
  }

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
      case 'created':
        return 'text-green-600 bg-green-50'
      case 'update':
      case 'updated':
        return 'text-blue-600 bg-blue-50'
      case 'move':
      case 'moved':
        return 'text-purple-600 bg-purple-50'
      case 'delete':
      case 'deleted':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const formatLogMessage = (log: EnrichedActivityLog) => {
    // Usar dados reais quando disponível
    const cardTitle = log.card?.title || log.cardTitle || `Card ${log.cardId.slice(0, 8)}...`
    const userName = log.user?.name || log.userName || 'Usuário desconhecido'
    
    switch (log.action.toLowerCase()) {
      case 'create':
      case 'created':
        return {
          primary: `${userName} criou o card`,
          secondary: `"${cardTitle}"`
        }
        
      case 'update':
      case 'updated':
        if (log.oldValue && log.newValue) {
          return {
            primary: `${userName} atualizou o card "${cardTitle}"`,
            secondary: `${log.oldValue} → ${log.newValue}`
          }
        }
        return {
          primary: `${userName} atualizou o card`,
          secondary: `"${cardTitle}"`
        }
        
      case 'move':
      case 'moved':
        if (log.sourceColumn && log.targetColumn) {
          return {
            primary: `${userName} moveu o card "${cardTitle}"`,
            secondary: `de "${log.sourceColumn.title}" para "${log.targetColumn.title}"`
          }
        }
        return {
          primary: `${userName} moveu o card`,
          secondary: `"${cardTitle}"`
        }
        
      case 'delete':
      case 'deleted':
        return {
          primary: `${userName} excluiu o card`,
          secondary: `"${cardTitle}"`
        }
        
      default:
        return {
          primary: `${userName} ${log.action}`,
          secondary: `"${cardTitle}"`
        }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[700px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">📊</span>
            <h2 className="text-xl font-semibold text-gray-900">
              Atividades do Quadro
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-600">Carregando atividades...</span>
              </div>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <span className="text-4xl mb-4 block">📝</span>
                <p className="text-gray-500">Nenhuma atividade encontrada</p>
                <p className="text-sm text-gray-400 mt-2">
                  As ações realizadas no quadro aparecerão aqui
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {logs.map((log, index) => {
                const message = formatLogMessage(log)
                const colorClass = getActionColor(log.action)
                
                return (
                  <div
                    key={log.id || index}
                    className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border"
                  >
                    {/* Ícone da ação */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                      <span className="text-lg">
                        {getActionIcon(log.action)}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      {/* Mensagem principal */}
                      <p className="text-sm text-gray-900 font-medium">
                        {message.primary}
                      </p>
                      
                      {/* Mensagem secundária */}
                      {message.secondary && (
                        <p className="text-sm text-gray-600 mt-1">
                          {message.secondary}
                        </p>
                      )}
                      
                      {/* Informações do usuário */}
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {(log.user?.name || 'U')[0].toUpperCase()}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {log.user?.email || 'Email não disponível'}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {formatDate(log.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {logs.length} {logs.length === 1 ? 'atividade' : 'atividades'}
          </span>
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? '⏳' : '🔄'} Atualizar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ActivityFeed