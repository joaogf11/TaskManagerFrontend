export interface Task {
  id: number
  title: string
  description: string
  isCompleted: boolean
  createdAt: Date
  dueDate?: Date
  priority: TaskPriority
}

export enum TaskPriority {
  Low = 0,
  Medium = 1,
  High = 2,
}
