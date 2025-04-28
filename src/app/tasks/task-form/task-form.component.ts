import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  AfterViewInit,
  OnDestroy,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { TaskService } from "../task.service";
import { Task, TaskPriority } from "../../models/task.model";

@Component({
  selector: "app-task-form",
  templateUrl: "./task-form.component.html",
})
export class TaskFormComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() task: Task | null = null;
  @Input() editMode = false;
  @Output() onSave = new EventEmitter<Task>();
  @Output() onCancel = new EventEmitter<void>();

  taskForm!: FormGroup;
  priorityOptions = [
    { label: "Low", value: TaskPriority.Low },
    { label: "Medium", value: TaskPriority.Medium },
    { label: "High", value: TaskPriority.High },
  ];

  private clickListener: any;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["task"] && this.taskForm) {
      this.updateForm();
    }
  }

  ngAfterViewInit(): void {
    
    this.clickListener = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (target.closest('.p-dropdown') || target.closest('.p-calendar')) {
        document.body.classList.add('overlay-active');

        setTimeout(() => {
          document.body.classList.remove('overlay-active');
        }, 5000);
      }

      if (
        !target.closest('.p-dropdown') &&
        !target.closest('.p-calendar') &&
        !target.closest('.p-dropdown-panel') &&
        !target.closest('.p-datepicker')
      ) {
        document.body.classList.remove('overlay-active');
      }
    };

    document.addEventListener('click', this.clickListener);
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
    document.removeEventListener('click', this.clickListener);
  }
  document.body.classList.remove('overlay-active');
  }

  initForm(): void {
    this.taskForm = this.fb.group({
      title: ["", [Validators.required, Validators.minLength(3)]],
      description: [""],
      priority: [TaskPriority.Medium, Validators.required],
      dueDate: [null],
      isCompleted: [false],
    });

    this.updateForm();
  }

  updateForm(): void {
    if (this.task) {
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description,
        priority: this.task.priority,
        dueDate: this.task.dueDate ? new Date(this.task.dueDate) : null,
        isCompleted: this.task.isCompleted,
      });
    } else {
      this.taskForm.reset({
        title: "",
        description: "",
        priority: TaskPriority.Medium,
        dueDate: null,
        isCompleted: false,
      });
    }
  }

  get title() {
    return this.taskForm.get("title");
  }

  saveTask(): void {
    if (this.taskForm.invalid) {
      return;
    }

    const formValues = this.taskForm.value;

    if (this.editMode && this.task) {
      this.taskService.updateTask(this.task.id, formValues).subscribe({
        next: (result) => {
          if (result.success) {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: "Task updated successfully",
            });
            this.onSave.emit(result.data);
          }
        },
        error: () => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to update task",
          });
        },
      });
    } else {
      this.taskService.createTask(formValues).subscribe({
        next: (task) => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Task created successfully",
          });
          this.onSave.emit(task);
        },
        error: () => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to create task",
          });
        },
      });
    }
  }

  cancel(): void {
    this.onCancel.emit();
  }
}
