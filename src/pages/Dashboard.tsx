// src/pages/Dashboard.tsx
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useBoards } from '@/hooks/useApi'
import { useToast } from '@/hooks/useToast'

const Dashboard = () => {
  const { boards, loading, createBoard, refetch } = useBoards()
  const { toast } = useToast()
  const [isCreating, setIsCreating] = useState(false)
  const [newBoardTitle, setNewBoardTitle] = useState('')

  useEffect(() => {
    refetch()
  }, [refetch])
   const handleCreateBoard = useCallback(async () => {
    if (!newBoardTitle.trim()) {
      return
    }

    try {
      await createBoard({ title: newBoardTitle })
      setNewBoardTitle('')
      setIsCreating(false)
    } catch (error) {
      // Error is handled in the hook
    }
  }, [newBoardTitle, createBoard, toast])
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Meus Quadros</h1>
        
        <button
          onClick={() => setIsCreating(true)}
          className="btn-primary"
        >
          + Novo Quadro
        </button>
      </div>

      {/* Create Board Modal */}
      {isCreating && (
        <div className="modal-backdrop">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Criar Novo Quadro</h2>
            
            <input
              type="text"
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
              placeholder="Nome do quadro"
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
            />
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsCreating(false)}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateBoard}
                className="btn-primary"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Boards Grid */}
      {boards.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">📋</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum quadro criado</h3>
          <p className="text-gray-600 mb-6">Comece criando seu primeiro quadro Kanban</p>
          <button
            onClick={() => setIsCreating(true)}
            className="btn-primary"
          >
            Criar Primeiro Quadro
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {boards.map((board) => (
            <Link
              key={board.id}
              to={`/board/${board.id}`}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-primary-200 transition-all duration-200 card-hover"
            >
              <h3 className="font-semibold text-gray-900 text-lg mb-2">
                {board.title}
              </h3>
              
              {board.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {board.description}
                </p>
              )}
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>
                  {board.columns.length} coluna{board.columns.length !== 1 ? 's' : ''}
                </span>
                <span>
                  {board.columns.reduce((total, col) => total + col.cards.length, 0)} cards
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard