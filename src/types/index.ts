export interface User {
  id: string
  clerkId: string
  email: string
  name?: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

export interface Board {
  id: string
  title: string
  description?: string
  createdAt: string
  updatedAt: string
  columns: Column[]
}

export interface Column {
  id: string
  title: string
  position: number
  boardId: string
  createdAt: string
  updatedAt: string
  cards: Card[]
}

export interface Card {
  id: string
  title: string
  description?: string
  priority: Priority
  position: number
  columnId: string
  assigneeId?: string
  creatorId: string
  dueDate?: string
  createdAt: string
  updatedAt: string
  assignee?: User
  creator: User
  attachments?: Attachment[]
  logs?: CardLog[]
  _count?: {
    attachments: number
  }
}

export interface Attachment {
  id: string
  filename: string
  fileUrl: string
  fileSize: number
  mimeType: string
  cardId: string
  createdAt: string
}

export interface CardLog {
  id: string
  action: LogAction
  details?: string
  userId: string
  cardId: string
  createdAt: string
  user: User
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export enum LogAction {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  MOVED = 'MOVED',
  ASSIGNED = 'ASSIGNED',
  UNASSIGNED = 'UNASSIGNED',
  DELETED = 'DELETED'
}

export interface CreateBoardDto {
  title: string
  description?: string
}

export interface CreateColumnDto {
  title: string
  boardId: string
}

export interface CreateCardDto {
  title: string
  description?: string
  priority?: Priority
  columnId: string
  assigneeId?: string
  dueDate?: string
}

export interface MoveCardDto {
  cardId: string
  sourceColumnId: string
  targetColumnId: string
  newPosition: number
}

export interface DragItem {
  type: string
  id: string
  index: number
}

export interface DropResult {
  name: string
  index: number
}