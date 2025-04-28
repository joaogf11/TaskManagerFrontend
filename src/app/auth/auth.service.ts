import { Injectable } from "@angular/core"
import type { HttpClient } from "@angular/common/http"
import { type Observable, BehaviorSubject } from "rxjs"
import { tap } from "rxjs/operators"
import { environment } from "../../environments/environment"
import type { User } from "../models/user.model"
import type { LoginRequest } from "../models/login-request.model"
import type { RegisterRequest } from "../models/register-request.model"
import type { AuthResponse } from "../models/auth-response.model"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`
  private currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()

  constructor(private http: HttpClient) {
    this.loadUserFromStorage()
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      this.currentUserSubject.next(user)
    }
  }

  login(loginRequest: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginRequest).pipe(
      tap((response) => {
        if (response.success) {
          this.storeUserData(response)
        }
      }),
    )
  }

  register(registerRequest: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, registerRequest).pipe(
      tap((response) => {
        if (response.success) {
          this.storeUserData(response)
        }
      }),
    )
  }

  logout(): void {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    this.currentUserSubject.next(null)
  }

  isLoggedIn(): boolean {
    return !!this.getToken()
  }

  getToken(): string | null {
    return localStorage.getItem("token")
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value
  }

  private storeUserData(response: AuthResponse): void {
    localStorage.setItem("token", response.token)

    const user: User = {
      username: response.username,
      email: response.email,
    }

    localStorage.setItem("user", JSON.stringify(user))
    this.currentUserSubject.next(user)
  }
}
