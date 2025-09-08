// components/kanban/CardModal.tsx
import { useState, useEffect } from 'react'
import type { Card as CardType, Priority } from '@/types'
import RichTextEditor from './RichTextEditor'
import { useToast } from '@/hooks/useToast'

interface CardModalProps {
  card: CardType | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (cardId: string, data: Partial<CardType>) => Promise<void>
  onDelete: (cardId: string) => Promise<void>
}

const CardModal = ({ card, isOpen, onClose, onUpdate, onDelete }: CardModalProps) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>()
  const [assigneeId, setAssigneeId] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (card) {
      setTitle(card.title)
      setDescription(card.description || '')
      setPriority(card.priority || 'MEDIUM')
      setAssigneeId(card.assigneeId || '')
      setDueDate(card.dueDate ? new Date(card.dueDate).toISOString().split('T')[0] : '')
    }
  }, [card])

  const handleSave = async () => {
    if (!card) return

    setLoading(true)
    try {
      await onUpdate(card.id, {
        title,
        description,
        priority ,
        assigneeId: assigneeId || undefined,
        dueDate: dueDate ? `${new Date(dueDate)}` : undefined
      })
      toast({
        title: "Card atualizado!",
        type: "success"
      })
      onClose()
    } catch (error) {
      toast({
        title: "Erro ao atualizar card",
        type: "error"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!card) return

    if (confirm('Tem certeza que deseja excluir este card?')) {
      setLoading(true)
      try {
        await onDelete(card.id)
        toast({
          title: "Card excluído!",
          type: "success"
        })
        onClose()
      } catch (error) {
        toast({
          title: "Erro ao excluir card",
          type: "error"
        })
      } finally {
        setLoading(false)
      }
    }
  }

  if (!isOpen || !card) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Editar Card</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Título do card"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <RichTextEditor
              value={description}
              onChange={setDescription}
              placeholder="Descreva esta tarefa..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridade
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.valu)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Vencimento
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-gray-200">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 disabled:opacity-50"
            >
              Excluir Card
            </button>
            
            <div className="flex space-x-3">
              <button 
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                disabled={loading || !title.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardModal