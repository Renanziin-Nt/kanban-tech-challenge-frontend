// hooks/useBoard.ts
import { useState, useCallback, useEffect } from 'react'
import { useToast } from './useToast'
import { boardsApi, cardsApi } from '@/services/api'
import type { Board } from '@/types'

export const useBoard = (boardId: string) => {
  const [board, setBoard] = useState<Board | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const { toast } = useToast()

  // Carregar board automaticamente
  useEffect(() => {
    if (boardId) {
      fetchBoard()
    }
  }, [boardId])

  const fetchBoard = useCallback(async () => {
    if (!boardId) return
    
    try {
      setLoading(true)
      const response = await boardsApi.getById(boardId)
      setBoard(response.data)
    } catch (err: any) {
      console.error('Erro ao carregar quadro:', err)
      toast({
        title: "Erro ao carregar quadro",
        description: "Tente recarregar a página",
        type: "error"
      })
    } finally {
      setLoading(false)
    }
  }, [boardId, toast])

  const moveCard = async (cardId: string, sourceColumnId: string, targetColumnId: string, newPosition: number) => {
    try {
      // Atualização otimista
      setBoard(prevBoard => {
        if (!prevBoard) return prevBoard

        const sourceColumn = prevBoard.columns.find(col => col.id === sourceColumnId)
        const cardToMove = sourceColumn?.cards.find(card => card.id === cardId)
        
        if (!cardToMove) return prevBoard

        // Remover da coluna origem
        const updatedColumns = prevBoard.columns.map(column => {
          if (column.id === sourceColumnId) {
            return {
              ...column,
              cards: column.cards.filter(card => card.id !== cardId)
            }
          }
          return column
        })

        // Adicionar na coluna destino
        const finalColumns = updatedColumns.map(column => {
          if (column.id === targetColumnId) {
            const newCards = [...column.cards]
            const updatedCard = {
              ...cardToMove,
              columnId: targetColumnId,
              position: newPosition
            }
            
            newCards.splice(newPosition, 0, updatedCard)
            
            // Reordenar posições
            const reorderedCards = newCards.map((card, index) => ({
              ...card,
              position: index
            }))
            
            return {
              ...column,
              cards: reorderedCards
            }
          }
          return column
        })

        return {
          ...prevBoard,
          columns: finalColumns
        }
      })

      // Chamada API
      await cardsApi.move(cardId, sourceColumnId, targetColumnId, newPosition)
      
    } catch (err: any) {
      console.error('Erro ao mover card:', err)
      // Reverter em caso de erro
      await fetchBoard()
      throw err
    }
  }

  const openCardModal = (cardId: string) => {
    setSelectedCardId(cardId)
  }

  const closeCardModal = () => {
    setSelectedCardId(null)
  }

  return {
    board,
    loading,
    selectedCardId,
    fetchBoard,
    moveCard,
    openCardModal,
    closeCardModal,
  }
}