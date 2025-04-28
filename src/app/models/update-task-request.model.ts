import type { TaskPriority } from "./task.model"

export interface UpdateTaskRequest {
  title: string
  description: string
  isCompleted: boolean
  dueDate?: Date
  priority: TaskPriority
}
