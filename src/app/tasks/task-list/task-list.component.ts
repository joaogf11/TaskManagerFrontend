import { Component, type OnInit } from "@angular/core"
import type { MessageService, ConfirmationService } from "primeng/api"
import type { TaskService } from "../task.service"
import { type Task, TaskPriority } from "../../models/task.model"
import type { Table } from "primeng/table"

@Component({
  selector: "app-task-list",
  templateUrl: "./task-list.component.html",
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = []
  selectedTask: Task | null = null
  displayTaskDialog = false
  editMode = false
  isLoading = false

  constructor(
    private taskService: TaskService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.loadTasks()
  }

  loadTasks(): void {
    this.isLoading = true
    this.taskService.getAllTasks().subscribe({
      next: (data) => {
        this.tasks = data
        this.isLoading = false
      },
      error: (error) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load tasks",
        })
        this.isLoading = false
      },
    })
  }

  showAddTaskDialog(): void {
    this.selectedTask = null
    this.editMode = false
    this.displayTaskDialog = true
  }

  editTask(task: Task): void {
    this.selectedTask = { ...task }
    this.editMode = true
    this.displayTaskDialog = true
  }

  hideDialog(): void {
    this.displayTaskDialog = false
  }

  onTaskSaved(task: Task): void {
    this.hideDialog()
    this.loadTasks()
  }

  markAsCompleted(task: Task): void {
    const updatedTask = {
      ...task,
      isCompleted: true,
    }

    this.taskService.updateTask(task.id, updatedTask).subscribe({
      next: (result) => {
        if (result.success) {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Task marked as completed",
          })
          this.loadTasks()
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to update task",
        })
      },
    })
  }

  confirmDelete(task: Task): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the task "${task.title}"?`,
      accept: () => {
        this.deleteTask(task)
      },
    })
  }

  deleteTask(task: Task): void {
    this.taskService.deleteTask(task.id).subscribe({
      next: (result) => {
        if (result.success) {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Task deleted successfully",
          })
          this.loadTasks()
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to delete task",
        })
      },
    })
  }

  getPriorityLabel(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.Low:
        return "Low"
      case TaskPriority.Medium:
        return "Medium"
      case TaskPriority.High:
        return "High"
      default:
        return "Unknown"
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
    const table = document.querySelector("p-table") as unknown as Table
    if (table) {
      table.filterGlobal(filterValue, "contains")
    }
  }
}
