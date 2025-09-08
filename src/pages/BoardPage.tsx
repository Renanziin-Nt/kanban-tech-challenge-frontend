// pages/BoardPage.tsx - COMPLETO COM BOTÃO DE ATIVIDADES
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useBoardData } from '@/hooks/useBoardData'
import Column from '@/components/kanban/Column'
import CardModal from '@/components/kanban/CardModal'
import ActivityFeed from '@/components/kanban/ActivityFeed'

const BoardPage = () => {
  const { boardId } = useParams<{ boardId: string }>()
  const {
    board,
    loading,
    createColumn,
    updateColumn,
    deleteColumn,
    updateCard,
    deleteCard,
    createCard,     
    moveCard,       
    moving,         
  } = useBoardData(boardId || '')
  
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [showActivityFeed, setShowActivityFeed] = useState(false)

  // Listener para abrir modal a partir dos cards
  useEffect(() => {
    const handleOpenCardModal = (event: CustomEvent) => {
      setSelectedCardId(event.detail)
    }
    window.addEventListener('openCardModal', handleOpenCardModal as EventListener)
    return () => {
      window.removeEventListener('openCardModal', handleOpenCardModal as EventListener)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-700 text-lg">Carregando quadro...</span>
        </div>
      </div>
    )
  }

  if (!board) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Quadro não encontrado</h2>
      </div>
    )
  }

  const selectedCard = selectedCardId 
    ? board?.columns.flatMap(col => col.cards)
    .find(card => card.id === selectedCardId) || null : null

  const handleCreateColumn = async () => {
    const title = prompt('Nome da coluna:')
    if (title && title.trim()) {
      try {
        await createColumn(title.trim())
      } catch (error) {
        // Error já é tratado no hook
      }
    }
  }

  return (
    <div className="p-6">
      {/* HEADER COM BOTÕES */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{board.title}</h1>
          {board.description && (
            <p className="text-gray-600 mt-2">{board.description}</p>
          )}
        </div>
        
        {/* BOTÕES DO HEADER */}
        <div className="flex items-center space-x-3">
          {/* BOTÃO DE ATIVIDADES */}
          <button
            onClick={() => setShowActivityFeed(true)}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center space-x-2 shadow-sm"
            title="Ver atividades do quadro"
          >
            <span>📊</span>
            <span>Logs</span>
          </button>
          
          {/* BOTÃO NOVA COLUNA */}
          <button
            onClick={handleCreateColumn}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
          >
            + Nova Coluna
          </button>
        </div>
      </div>

      {/* LOADING OVERLAY - Mostrar quando movendo cards */}
      {moving && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700">Movendo card...</span>
            </div>
          </div>
        </div>
      )}

      {/* COLUNAS DO KANBAN */}
      <div className="flex space-x-6 overflow-x-auto pb-6 scrollbar-thin">
        {board.columns.map((column) => (
          <Column
            key={column.id}
            id={column.id}
            title={column.title}
            cards={column.cards}
            boardId={board.id}
            onEditColumn={updateColumn}
            onDeleteColumn={deleteColumn}
            onCreateCard={createCard}
            onMoveCard={moveCard}
            isMoving={moving}
          />
        ))}
        
        {/* COLUNA PARA ADICIONAR NOVA */}
        <div className="w-80">
          <button
            onClick={handleCreateColumn}
            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center"
          >
            + Adicionar Coluna
          </button>
        </div>
      </div>

      {/* MODAL DO CARD */}
      <CardModal
        card={selectedCard}
        isOpen={!!selectedCard}
        onClose={() => setSelectedCardId(null)}
        onUpdate={async (cardId, data) => {
        await updateCard(cardId, data) 
      }}
        onDelete={deleteCard}
      />

      {/* MODAL DE ATIVIDADES - AQUI ESTÁ! */}
      <ActivityFeed
        boardId={board.id}
        isOpen={showActivityFeed}
        onClose={() => setShowActivityFeed(false)}
      />
    </div>
  )
}

export default BoardPage