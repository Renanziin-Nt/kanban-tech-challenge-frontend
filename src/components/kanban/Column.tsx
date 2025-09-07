// components/kanban/Column.tsx - CORRIGIDO
import { useDrop } from 'react-dnd'
import type { Card as CardType } from '@/types'
import Card from './Card'
import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/useToast'

interface ColumnProps {
  id: string
  title: string
  cards: CardType[]
  boardId: string
  onEditColumn: (id: string, title: string) => void
  onDeleteColumn: (id: string) => void
  // ← NOVAS PROPS AO INVÉS DE USAR HOOK
  onCreateCard: (columnId: string, data: {
    title: string;
    description?: string;
    priority?: string;
    assigneeId?: string;
    dueDate?: Date;
  }) => Promise<any>
  onMoveCard: (cardId: string, sourceColumnId: string, targetColumnId: string, newPosition: number) => Promise<void>
  isMoving: boolean
}

const Column = ({ 
  id, 
  title, 
  cards, 
  boardId, 
  onEditColumn, 
  onDeleteColumn,
  onCreateCard,    // ← RECEBER COMO PROP
  onMoveCard,      // ← RECEBER COMO PROP
  isMoving         // ← RECEBER COMO PROP
}: ColumnProps) => {
  const { toast } = useToast()
  const [isCreatingCard, setIsCreatingCard] = useState(false)

  // Debug de props
  useEffect(() => {
    console.log(`📋 Coluna "${title}" recebeu novas props:`, {
      cardsCount: cards.length,
      cards: cards.map(c => c.title),
      boardId
    })
  }, [cards, title, boardId])

  // Configurar drop zone para aceitar cards
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'CARD',
    drop: async (item: { id: string; columnId: string; index: number }) => {
      // Se for a mesma coluna, deixa o handleCardDrop cuidar
      if (item.columnId === id) {
        return
      }

      try {
        console.log(`🎯 Movendo card ${item.id} de ${item.columnId} para ${id}`)
        
        // ← USAR A PROP AO INVÉS DO HOOK
        await onMoveCard(item.id, item.columnId, id, cards.length)
        
        toast({
          title: "Card movido!",
          type: "success"
        })
      } catch (error) {
        console.error('Erro ao mover card:', error)
        toast({
          title: "Erro ao mover card",
          type: "error"
        })
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }), [id, cards.length, onMoveCard]) // ← USAR onMoveCard

  // Função para lidar com drop entre cards (reordenação dentro da mesma coluna)
  const handleCardDrop = async (draggedCardId: string, hoverIndex: number) => {
    try {
      console.log(`🔄 Reordenando card ${draggedCardId} para posição ${hoverIndex}`)
      
      // ← USAR A PROP AO INVÉS DO HOOK
      await onMoveCard(draggedCardId, id, id, hoverIndex)
    } catch (error) {
      console.error('Erro ao reordenar card:', error)
      toast({
        title: "Erro ao reordenar card",
        type: "error"
      })
    }
  }

  // Função para criar novo card
  const handleCreateCard = async () => {
    const cardTitle = prompt('Título do card:')
    if (!cardTitle || !cardTitle.trim()) return

    try {
      setIsCreatingCard(true)
      
      // ← USAR A PROP AO INVÉS DO HOOK
      await onCreateCard(id, {
        title: cardTitle.trim(),
        description: '',
        priority: 'MEDIUM',
      })
    } catch (error) {
      // Error já é tratado no hook pai
    } finally {
      setIsCreatingCard(false)
    }
  }

  return (
    <div
      ref={drop}
      className={`w-80 bg-gray-100 rounded-lg p-4 flex flex-col transition-colors min-h-96 relative ${
        isOver ? 'bg-blue-100 ring-2 ring-blue-400 shadow-md' : ''
      } ${isMoving ? 'opacity-50' : ''}`} // ← FEEDBACK VISUAL DURANTE MOVIMENTO
      style={{
        border: isOver ? '2px dashed blue' : undefined,
        background: isOver ? '#dbeafe' : '#f3f4f6'
      }}
    >
      {/* LOADING OVERLAY LOCAL */}
      {isMoving && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-lg z-10">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-blue-600">Movendo...</span>
          </div>
        </div>
      )}

      {/* Header da coluna */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
          <span className="bg-gray-300 text-gray-700 text-xs px-2 py-1 rounded-full">
            {cards.length}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              const newTitle = prompt('Editar nome da coluna:', title)
              if (newTitle && newTitle !== title) {
                onEditColumn(id, newTitle)
              }
            }}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded hover:bg-gray-200"
            title="Editar coluna"
            disabled={isMoving} // ← DESABILITAR DURANTE MOVIMENTO
          >
            ✏️
          </button>
          <button
            onClick={() => {
              if (confirm('Tem certeza que deseja excluir esta coluna? Todos os cards serão removidos.')) {
                onDeleteColumn(id)
              }
            }}
            className="text-gray-500 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
            title="Excluir coluna"
            disabled={isMoving} // ← DESABILITAR DURANTE MOVIMENTO
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Lista de cards */}
      <div className="flex-1 space-y-3 overflow-y-auto scrollbar-thin max-h-96">
        {cards
          .sort((a, b) => a.position - b.position)
          .map((card, index) => (
            <Card
              key={card.id}
              card={card}
              boardId={boardId}
              index={index}
              onDrop={handleCardDrop}
              disabled={isMoving} // ← PASSAR ESTADO DE LOADING
            />
          ))}
        
        {cards.length === 0 && (
          <div className={`text-center text-gray-500 py-8 border-2 border-dashed rounded-lg transition-colors ${
            isOver
              ? 'border-blue-400 bg-blue-50 text-blue-600'
              : 'border-gray-300'
          }`}>
            {isOver ? '✅ Solte aqui!' : 'Arraste cards aqui ➡️'}
          </div>
        )}
      </div>

      {/* Botão para adicionar card */}
      <button
        onClick={handleCreateCard}
        disabled={isCreatingCard || isMoving} // ← DESABILITAR DURANTE MOVIMENTO
        className={`mt-4 w-full text-center py-2 px-4 rounded-lg border-2 border-dashed transition-colors ${
          isCreatingCard || isMoving
            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
            : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50'
        }`}
      >
        {isCreatingCard ? 'Criando...' : '+ Adicionar Card'}
      </button>
    </div>
  )
}

export default Column