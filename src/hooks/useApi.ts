import { useState, useEffect, useCallback } from 'react'


import { boardsApi, columnsApi, cardsApi, usersApi, uploadsApi } from '@/services/api'
import type { Board,User, Attachment } from '@/types'






export const useBoards = () => {
  const [boards, setBoards] = useState<Board[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBoards = useCallback(async () => {
    try {
      setLoading(true)
      const response = await boardsApi.getAll()
      setBoards(response.data)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const createBoard = async (data: { title: string; description?: string }) => {
    try {
      const response = await boardsApi.create(data)
      setBoards(prev => [...prev, response.data])
      return response.data
    } catch (err: any) {
      throw err
    }
  }

  const updateBoard = async (id: string, data: { title?: string; description?: string }) => {
    try {
      const response = await boardsApi.update(id, data)
      setBoards(prev => prev.map(board => board.id === id ? response.data : board))
      return response.data
    } catch (err: any) {
      throw err
    }
  }

  const deleteBoard = async (id: string) => {
    try {
      await boardsApi.delete(id)
      setBoards(prev => prev.filter(board => board.id !== id))
    } catch (err: any) {
      throw err
    }
  }

  return {
    boards,
    loading,
    error,
    refetch: fetchBoards,
    createBoard,
    updateBoard,
    deleteBoard,
  }
}

// Hook para board específico
export const useBoard = (boardId: string) => {
  const [board, setBoard] = useState<Board | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  const fetchBoard = useCallback(async () => {
    if (!boardId) return
    
    try {
      setLoading(true)
      const response = await boardsApi.getById(boardId)
      setBoard(response.data)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [boardId, ])

  const createColumn = async (title: string) => {
    if (!boardId) return

    try {
      const response = await columnsApi.create({ title, boardId })
      setBoard(prev => {
        if (!prev) return prev
        return {
          ...prev,
          columns: [...prev.columns, response.data].sort((a, b) => a.position - b.position)
        }
      })
      return response.data
    } catch (err: any) {
      throw err
    }
  }

  const updateColumn = async (columnId: string, title: string) => {
    try {
      const response = await columnsApi.update(columnId, { title })
      setBoard(prev => {
        if (!prev) return prev
        return {
          ...prev,
          columns: prev.columns.map(col => 
            col.id === columnId ? { ...col, title } : col
          )
        }
      })
      return response.data
    } catch (err: any) {
      throw err
    }
  }

  const deleteColumn = async (columnId: string) => {
    try {
      await columnsApi.delete(columnId)
      setBoard(prev => {
        if (!prev) return prev
        return {
          ...prev,
          columns: prev.columns.filter(col => col.id !== columnId)
        }
      })
    } catch (err: any) {
      throw err
    }
  }

  const createCard = async (columnId: string, data: { title: string; description?: string; priority?: string; assigneeId?: string }) => {
    try {
      const response = await cardsApi.create({ ...data, columnId })
      setBoard(prev => {
        if (!prev) return prev
        return {
          ...prev,
          columns: prev.columns.map(col => 
            col.id === columnId 
              ? { ...col, cards: [...col.cards, response.data] }
              : col
          )
        }
      })
      return response.data
    } catch (err: any) {
      throw err
    }
  }

  const updateCard = async (cardId: string, data: { title?: string; description?: string; priority?: string; assigneeId?: string }) => {
    try {
      const response = await cardsApi.update(cardId, data)
      setBoard(prev => {
        if (!prev) return prev
        return {
          ...prev,
          columns: prev.columns.map(col => ({
            ...col,
            cards: col.cards.map(card => 
              card.id === cardId ? response.data : card
            )
          }))
        }
      })
      return response.data
    } catch (err: any) {
      throw err
    }
  }

  const deleteCard = async (cardId: string) => {
    try {
      await cardsApi.delete(cardId)
      setBoard(prev => {
        if (!prev) return prev
        return {
          ...prev,
          columns: prev.columns.map(col => ({
            ...col,
            cards: col.cards.filter(card => card.id !== cardId)
          }))
        }
      })
    } catch (err: any) {
      throw err
    }
  }

  const moveCard = async (cardId: string, sourceColumnId: string, targetColumnId: string, newPosition: number) => {
  try {
    await cardsApi.move(cardId, sourceColumnId, targetColumnId, newPosition)
    await fetchBoard()
    console.log('Card movido!')
  } catch (err: any) {
    console.error('Erro ao mover card:', err)
    throw err
  }
}

  const reorderColumns = async (columnIds: string[]) => {
    try {
      await columnsApi.reorder(boardId, columnIds)
      await fetchBoard()
    } catch (err: any) {
      throw err
    }
  }

  const reorderCards = async (columnId: string, cardIds: string[]) => {
    try {
      await cardsApi.reorder(columnId, cardIds)
      await fetchBoard()
    } catch (err: any) {
      throw err
    }
  }

  useEffect(() => {
    if (boardId) {
      fetchBoard()
    }
  }, [boardId, fetchBoard])

  return {
    board,
    loading,
    error,
    refetch: fetchBoard,
    createColumn,
    updateColumn,
    deleteColumn,
    createCard,
    updateCard,
    deleteCard,
    moveCard,
    reorderColumns,
    reorderCards,
  }
}

// Hook para usuários
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const response = await usersApi.getAll()
      setUsers(response.data)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
  }
}

// Hook para uploads e anexos
export const useAttachments = (cardId: string) => {
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAttachments = useCallback(async () => {
    if (!cardId) return
    
    try {
      setLoading(true)
      const response = await uploadsApi.getCardAttachments(cardId)
      setAttachments(response.data)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [cardId, ])

  const uploadAttachment = async (file: File) => {
    try {
      const response = await uploadsApi.upload(cardId, file)
      setAttachments(prev => [...prev, response.data])
      return response.data
    } catch (err: any) {
      throw err
    }
  }

  const deleteAttachment = async (attachmentId: string) => {
    try {
      await uploadsApi.deleteAttachment(attachmentId)
      setAttachments(prev => prev.filter(att => att.id !== attachmentId))
    } catch (err: any) {
      throw err
    }
  }

  useEffect(() => {
    if (cardId) {
      fetchAttachments()
    }
  }, [cardId, fetchAttachments])

  return {
    attachments,
    loading,
    error,
    refetch: fetchAttachments,
    uploadAttachment,
    deleteAttachment,
  }
}

// Hook para logs de atividade
export const useCardLogs = (cardId: string) => {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLogs = useCallback(async () => {
    if (!cardId) return
    
    try {
      setLoading(true)
      const response = await cardsApi.getLogs(cardId)
      setLogs(response.data)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [cardId, ])

  useEffect(() => {
    if (cardId) {
      fetchLogs()
    }
  }, [cardId, fetchLogs])

  return {
    logs,
    loading,
    error,
    refetch: fetchLogs,
  }
}

// Hook para atividade do board
export const useBoardActivity = (boardId: string) => {
  const [activity, setActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)


  const fetchActivity = useCallback(async () => {
    if (!boardId) return
    
    try {
      setLoading(true)
      const response = await cardsApi.getBoardActivity(boardId)
      setActivity(response.data)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [boardId, ])

  useEffect(() => {
    if (boardId) {
      fetchActivity()
    }
  }, [boardId, fetchActivity])

  return {
    activity,
    loading,
    error,
    refetch: fetchActivity,
  }
}