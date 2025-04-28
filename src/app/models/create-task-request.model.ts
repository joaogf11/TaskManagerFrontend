import type { TaskPriority } from "./task.model"

export interface CreateTaskRequest {
  title: string
  description: string
  dueDate?: Date
  priority: TaskPriority
}
