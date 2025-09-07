// components/kanban/Card.tsx
import { useDrag, useDrop } from 'react-dnd'
import { useRef } from 'react'
import type { Card as CardType } from '@/types'
import { useBoardData } from '@/hooks/useBoardData'

interface CardProps {
  card: CardType
  boardId: string
  index?: number
  onDrop?: (draggedCardId: string, hoverIndex: number) => void
}

const Card = ({ card, boardId, index = 0, onDrop }: CardProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { board } = useBoardData(boardId)

  // Configurar drag
  // components/kanban/Card.tsx - APENAS AS PARTES RELEVANTES
// Configurar drag
const [{ isDragging }, drag] = useDrag(() => ({
  type: 'CARD',
  item: {
    id: card.id,
    columnId: card.columnId,
    index: card.position || index
  },
  collect: (monitor) => ({
    isDragging: !!monitor.isDragging(),
  }),
  end: (item, monitor) => {
    // DEBUG: Verificar se o drop foi bem sucedido
    const didDrop = monitor.didDrop()
    console.log('Drag ended - didDrop:', didDrop, 'item:', item)
    if (!didDrop) {
      // O card foi arrastado mas não foi solto em um drop target válido
      console.log('Card não foi solto em um local válido')
    }
  }
}), [card.id, card.columnId, card.position, index])

// Configurar drop para reordenação na mesma coluna
const [, drop] = useDrop(() => ({
  accept: 'CARD',
  hover: (draggedItem: { id: string; columnId: string; index: number }) => {
    if (!ref.current) return
    if (draggedItem.id === card.id) return
    if (draggedItem.columnId !== card.columnId) return
    
    console.log('Hover sobre card:', card.title, 'index:', index)
    
    if (onDrop && draggedItem.index !== index) {
      onDrop(draggedItem.id, index)
      draggedItem.index = index
    }
  },
  drop: (item, monitor) => {
    console.log('Drop realizado no card:', card.title)
  }
}), [card.id, card.columnId, index, onDrop])

  drag(drop(ref))

  const getPriorityColor = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-200'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const translatePriority = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case 'HIGH': return 'Alta'
      case 'MEDIUM': return 'Média'
      case 'LOW': return 'Baixa'
      default: return priority || 'Não definida'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  // Função para abrir modal - vamos implementar isso no BoardPage
  const openCardModal = () => {
    // Isso será controlado pelo BoardPage
    const event = new CustomEvent('openCardModal', { detail: card.id })
    window.dispatchEvent(event)
  }

  return (
    <div
      ref={ref}
      className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-pointer transition-all hover:shadow-md hover:border-gray-300 ${
        isDragging ? 'opacity-50 transform rotate-1 shadow-lg scale-105' : ''
      }`}
      onClick={openCardModal}
    >
      {/* Header com título e prioridade */}
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-900 text-sm flex-1 pr-2 line-clamp-2">
          {card.title}
        </h4>
        {card.priority && (
          <span className={`text-xs px-2 py-1 rounded-full border font-medium whitespace-nowrap ${getPriorityColor(card.priority)}`}>
            {translatePriority(card.priority)}
          </span>
        )}
      </div>

      {/* Descrição */}
      {card.description && (
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {card.description.replace(/<[^>]*>/g, '')}
        </p>
      )}

      {/* Data de vencimento */}
      {card.dueDate && (
        <div className="mb-3">
          <span className={`text-xs px-2 py-1 rounded border ${
            new Date(card.dueDate) < new Date() 
              ? 'bg-red-50 text-red-700 border-red-200' 
              : 'bg-blue-50 text-blue-700 border-blue-200'
          }`}>
            📅 {formatDate(card.dueDate)}
          </span>
        </div>
      )}

      {/* Anexos */}
      {card.attachments && card.attachments.length > 0 && (
        <div className="mb-3">
          <span className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded border">
            📎 {card.attachments.length} anexo{card.attachments.length > 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Footer com assignee */}
      <div className="flex items-center justify-between">
        {card.assignee ? (
          <div className="flex items-center gap-2">
            {card.assignee.imageUrl ? (
              <img 
                src={card.assignee.imageUrl} 
                alt={card.assignee.name || 'Usuário'}
                className="w-6 h-6 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                {(card.assignee.name || card.assignee.email || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-xs text-gray-600 truncate max-w-20">
              {card.assignee.name || card.assignee.email?.split('@')[0]}
            </span>
          </div>
        ) : (
          <div className="text-xs text-gray-400">Sem responsável</div>
        )}

        <div className="text-xs text-gray-500">
          {formatDate(card.updatedAt)}
        </div>
      </div>
    </div>
  )
}

export default Card