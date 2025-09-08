// hooks/useBoardData.ts
import { useState, useEffect } from 'react'
import type { Board, Card } from '@/types'
import { boardsApi, columnsApi, cardsApi } from '@/services/api'
import { useToast } from './useToast'

export const useBoardData = (boardId: string) => {
  const [board, setBoard] = useState<Board | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [moving, setMoving] = useState(false)
  useEffect(() => {
    if (boardId) {
      fetchBoard()
    }
  }, [boardId])

  const fetchBoard = async () => {
    try {
      setLoading(true)
      const response = await boardsApi.getById(boardId)
      setBoard(response.data)
      console.log('✅ Board carregado:', response.data)
    } catch (error: any) {
      toast({
        title: "Erro ao carregar quadro",
        description: error.response?.data?.message || "Tente novamente",
        type: "error"
      })
    } finally {
      setLoading(false)
    }
  }

  const createColumn = async (title: string) => {
    try {
      const response = await columnsApi.create({ title, boardId })
      setBoard(prev => prev ? {
        ...prev,
        columns: [...prev.columns, response.data]
      } : null)
      toast({
        title: "Coluna criada com sucesso!",
        type: "success"
      })
      return response.data
    } catch (error: any) {
      toast({
        title: "Erro ao criar coluna",
        description: error.response?.data?.message || "Tente novamente",
        type: "error"
      })
      throw error
    }
  }

  const updateColumn = async (columnId: string, title: string) => {
    try {
      const response = await columnsApi.update(columnId, { title })
      setBoard(prev => prev ? {
        ...prev,
        columns: prev.columns.map(col =>
          col.id === columnId ? { ...col, title } : col
        )
      } : null)
      toast({
        title: "Coluna atualizada!",
        type: "success"
      })
      return response.data
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar coluna",
        description: error.response?.data?.message || "Tente novamente",
        type: "error"
      })
      throw error
    }
  }

  const deleteColumn = async (columnId: string) => {
    try {
      await columnsApi.delete(columnId)
      setBoard(prev => prev ? {
        ...prev,
        columns: prev.columns.filter(col => col.id !== columnId)
      } : null)
      toast({
        title: "Coluna excluída!",
        type: "success"
      })
    } catch (error: any) {
      toast({
        title: "Erro ao excluir coluna",
        description: error.response?.data?.message || "Tente novamente",
        type: "error"
      })
      throw error
    }
  }

  const createCard = async (columnId: string, data: {
    title: string;
    description?: string;
    priority?: string;
    assigneeId?: string;
    dueDate?: Date;
  }) => {
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
      toast({
        title: "Card criado com sucesso!",
        type: "success"
      })
      return response.data
    } catch (error: any) {
      toast({
        title: "Erro ao criar card",
        description: error.response?.data?.message || "Tente novamente",
        type: "error"
      })
      throw error
    }
  }

  const updateCard = async (cardId: string, data: Partial<Card>) => {
    try {
      const response = await cardsApi.update(cardId, data)
      setBoard(prev => {
        if (!prev) return prev

        return {
          ...prev,
          columns: prev.columns.map(col => ({
            ...col,
            cards: col.cards.map(card =>
              card.id === cardId ? { ...card, ...response.data } : card
            )
          }))
        }
      })
      toast({
        title: "Card atualizado!",
        type: "success"
      })
      return response.data
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar card",
        description: error.response?.data?.message || "Tente novamente",
        type: "error"
      })
      throw error
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
      toast({
        title: "Card excluído!",
        type: "success"
      })
    } catch (error: any) {
      toast({
        title: "Erro ao excluir card",
        description: error.response?.data?.message || "Tente novamente",
        type: "error"
      })
      throw error
    }
  }

  
  // hooks/useBoardData.ts - FUNÇÃO moveCard CORRIGIDA
  // hooks/useBoardData.ts - AJUSTE NA FUNÇÃO moveCard
const moveCard = async (cardId: string, sourceColumnId: string, targetColumnId: string, newPosition: number) => {
  // Salvar estado anterior para possível rollback
  const previousBoardState = board

  try {
    // ← ATIVAR ESTADO DE LOADING
    setMoving(true)
    
    // ATUALIZAÇÃO OTIMISTA - Abordagem funcional correta
    setBoard(prevBoard => {
      if (!prevBoard) return prevBoard

      // Encontrar o card e suas colunas
      const sourceColumn = prevBoard.columns.find(col => col.id === sourceColumnId)
      const targetColumn = prevBoard.columns.find(col => col.id === targetColumnId)

      console.log('📦 Estado anterior:', prevBoard?.columns.map(c => ({ title: c.title, cards: c.cards.map(card => ({ id: card.id, title: card.title, position: card.position })) })))

      if (!sourceColumn || !targetColumn) {
        console.log('Colunas não encontradas')
        return prevBoard
      }

      const cardToMove = sourceColumn.cards.find(card => card.id === cardId)
      if (!cardToMove) {
        console.log('Card não encontrado')
        return prevBoard
      }

      // 1. Remover card da coluna origem
      const updatedSourceCards = sourceColumn.cards.filter(card => card.id !== cardId)

      // 2. Adicionar card na coluna destino
      const updatedTargetCards = [...targetColumn.cards]
      updatedTargetCards.splice(newPosition, 0, {
        ...cardToMove,
        columnId: targetColumnId,
        position: newPosition
      })

      // 3. Atualizar posições de todos os cards na coluna destino
      const finalTargetCards = updatedTargetCards.map((card, index) => ({
        ...card,
        position: index
      }))

      // 4. Atualizar posições na coluna origem também (se necessário)
      const finalSourceCards = updatedSourceCards.map((card, index) => ({
        ...card,
        position: index
      }))

      // 5. Construir novo array de colunas
      const updatedColumns = prevBoard.columns.map(col => {
        if (col.id === sourceColumnId) {
          return { ...col, cards: finalSourceCards }
        }
        if (col.id === targetColumnId) {
          return { ...col, cards: finalTargetCards }
        }
        return col
      })

      const newState = {
        ...prevBoard,
        columns: updatedColumns
      }

      console.log('🔄 Novo estado:', newState.columns.map(c => ({
        title: c.title,
        cards: c.cards.map(card => ({ id: card.id, title: card.title, position: card.position }))
      })))

      return newState
    })

    // Chamada para API
    await cardsApi.move(cardId, sourceColumnId, targetColumnId, newPosition)
    console.log('✅ Movimento realizado com sucesso')
    
    toast({
      title: "Card movido com sucesso!",
      type: "success"
    })
    
  } catch (error: any) {
    console.error('❌ Erro ao mover card:', error)

    // Reverter para estado anterior em caso de erro
    setBoard(previousBoardState)

    toast({
      title: "Erro ao mover card",
      description: error.response?.data?.message || "Tente novamente",
      type: "error"
    })
    throw error
  } finally {
    // ← DESATIVAR ESTADO DE LOADING
    setMoving(false)
  }
}


  return {
    board,
    loading,
    createColumn,
    updateColumn,
    deleteColumn,
    createCard,
    updateCard,
    deleteCard,
    moveCard, // ← ADICIONAR ESTA FUNÇÃO
    refetch: fetchBoard,
    moving
  }
}