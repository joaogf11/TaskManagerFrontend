import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable, BehaviorSubject } from "rxjs"
import { tap } from "rxjs/operators"
import { environment } from "../../environments/environment"
import { User } from "../models/user.model"
import { LoginRequest } from "../models/login-request.model"
import { RegisterRequest } from "../models/register-request.model"
import { AuthResponse } from "../models/auth-response.model"

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
