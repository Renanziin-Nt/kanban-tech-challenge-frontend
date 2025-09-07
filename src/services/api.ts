import { api } from '@/lib/api'
import type { Board, Column, Card, User, CardLog, Attachment } from '@/types'
// Boards API
export const boardsApi = {
  getAll: () => api.get<Board[]>('/boards'),
  getById: (id: string) => api.get<Board>(`/boards/${id}`),
  create: (data: { title: string; description?: string }) => api.post<Board>('/boards', data),
  update: (id: string, data: { title?: string; description?: string }) => 
    api.patch<Board>(`/boards/${id}`, data),
  delete: (id: string) => api.delete(`/boards/${id}`),
}

// Columns API
export const columnsApi = {
  getAll: () => api.get<Column[]>('/columns'),
  getById: (id: string) => api.get<Column>(`/columns/${id}`),
  create: (data: { title: string; boardId: string; position?: number }) => 
    api.post<Column>('/columns', data),
  update: (id: string, data: { title?: string; position?: number }) => 
    api.patch<Column>(`/columns/${id}`, data),
  delete: (id: string) => api.delete(`/columns/${id}`),
  reorder: (boardId: string, columnIds: string[]) => 
    api.post(`/columns/reorder/${boardId}`, { columnIds }),
}

// Cards API
export const cardsApi = {
  getAll: () => api.get<Card[]>('/cards'),
  getById: (id: string) => api.get<Card>(`/cards/${id}`),
  getLogs: (id: string) => api.get<CardLog[]>(`/cards/${id}/logs`),
  create: (data: { title: string; description?: string; columnId: string; priority?: string; assigneeId?: string }) => 
    api.post<Card>('/cards', data),
  update: (id: string, data: { title?: string; description?: string; priority?: string; assigneeId?: string }) => 
    api.patch<Card>(`/cards/${id}`, data),
  delete: (id: string) => api.delete(`/cards/${id}`),
  move: (cardId: string, sourceColumnId: string, targetColumnId: string, newPosition: number) => 
    api.post('/cards/move', { cardId, sourceColumnId, targetColumnId, newPosition }),
  reorder: (columnId: string, cardIds: string[]) => 
    api.post(`/cards/reorder/${columnId}`, { cardIds }),
  getBoardActivity: (boardId: string) => 
    api.get<any[]>(`/cards/board/${boardId}/activity`),
}

// Users API
export const usersApi = {
  getAll: () => api.get<User[]>('/users'),
  getMe: () => api.get<User>('/users/me'),
  getById: (id: string) => api.get<User>(`/users/${id}`),
  create: (data: Partial<User>) => api.post<User>('/users', data),
  update: (id: string, data: Partial<User>) => api.patch<User>(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
}

// Uploads API
export const uploadsApi = {
  upload: (cardId: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post<Attachment>(`/uploads/${cardId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  getCardAttachments: (cardId: string) => 
    api.get<Attachment[]>(`/uploads/card/${cardId}`),
  getFile: (filename: string) => 
    api.get(`/uploads/file/${filename}`, { responseType: 'blob' }),
  deleteAttachment: (id: string) => 
    api.delete(`/uploads/attachment/${id}`),
}