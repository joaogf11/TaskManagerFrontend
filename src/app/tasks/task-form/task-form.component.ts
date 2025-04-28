import { Component, EventEmitter, Input, type OnChanges, type OnInit, Output, type SimpleChanges } from "@angular/core"
import { type FormBuilder, type FormGroup, Validators } from "@angular/forms"
import type { MessageService } from "primeng/api"
import type { TaskService } from "../task.service"
import { type Task, TaskPriority } from "../../models/task.model"

@Component({
  selector: "app-task-form",
  templateUrl: "./task-form.component.html",
})
export class TaskFormComponent implements OnInit, OnChanges {
  @Input() task: Task | null = null
  @Input() editMode = false
  @Output() onSave = new EventEmitter<Task>()
  @Output() onCancel = new EventEmitter<void>()

  taskForm!: FormGroup
  priorityOptions = [
    { label: "Low", value: TaskPriority.Low },
    { label: "Medium", value: TaskPriority.Medium },
    { label: "High", value: TaskPriority.High },
  ]

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.initForm()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["task"] && this.taskForm) {
      this.updateForm()
    }
  }

  initForm(): void {
    this.taskForm = this.fb.group({
      title: ["", [Validators.required, Validators.minLength(3)]],
      description: [""],
      priority: [TaskPriority.Medium, Validators.required],
      dueDate: [null],
      isCompleted: [false],
    })

    this.updateForm()
  }

  updateForm(): void {
    if (this.task) {
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description,
        priority: this.task.priority,
        dueDate: this.task.dueDate ? new Date(this.task.dueDate) : null,
        isCompleted: this.task.isCompleted,
      })
    } else {
      this.taskForm.reset({
        title: "",
        description: "",
        priority: TaskPriority.Medium,
        dueDate: null,
        isCompleted: false,
      })
    }
  }

  get title() {
    return this.taskForm.get("title")
  }

  saveTask(): void {
    if (this.taskForm.invalid) {
      return
    }

    const formValues = this.taskForm.value

    if (this.editMode && this.task) {
      this.taskService.updateTask(this.task.id, formValues).subscribe({
        next: (result) => {
          if (result.success) {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: "Task updated successfully",
            })
            this.onSave.emit(result.data)
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
    } else {
      this.taskService.createTask(formValues).subscribe({
        next: (task) => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Task created successfully",
          })
          this.onSave.emit(task)
        },
        error: (error) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to create task",
          })
        },
      })
    }
  }

  cancel(): void {
    this.onCancel.emit()
  }
}
