import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { MessageService } from "primeng/api"
import { AuthService } from "../auth.service"

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html"
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup
  isLoading = false

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm()
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    })
  }

  get email() {
    return this.loginForm.get("email")
  }
  get password() {
    return this.loginForm.get("password")
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return
    }

    this.isLoading = true
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.isLoading = false
        if (response.success) {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Login successful",
          })
          this.router.navigate(["/tasks"])
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.message,
          })
        }
      },
      error: (error) => {
        this.isLoading = false
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error?.message || "An error occurred during login",
        })
      },
    })
  }
}
