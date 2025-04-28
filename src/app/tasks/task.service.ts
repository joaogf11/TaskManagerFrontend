import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { environment } from "../../environments/environment"
import { Task } from "../models/task.model"
import { CreateTaskRequest } from "../models/create-task-request.model"
import { UpdateTaskRequest } from "../models/update-task-request.model"
import { ServiceResult } from "../models/service-result.model"

@Injectable({
  providedIn: "root",
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/api/tasks`

  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl)
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`)
  }

  createTask(task: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task)
  }

  updateTask(id: number, task: UpdateTaskRequest): Observable<ServiceResult> {
    return this.http.put<ServiceResult>(`${this.apiUrl}/${id}`, task)
  }

  deleteTask(id: number): Observable<ServiceResult> {
    return this.http.delete<ServiceResult>(`${this.apiUrl}/${id}`)
  }
}
