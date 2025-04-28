import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { MessageService } from "primeng/api"
import { AuthService } from "../auth.service"

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup
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
    this.registerForm = this.fb.group(
      {
        username: ["", [Validators.required, Validators.minLength(3)]],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required],
      },
      { validators: this.passwordMatchValidator },
    )
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get("password")?.value
    const confirmPassword = form.get("confirmPassword")?.value
    return password === confirmPassword ? null : { passwordMismatch: true }
  }

  get username() {
    return this.registerForm.get("username")
  }
  get email() {
    return this.registerForm.get("email")
  }
  get password() {
    return this.registerForm.get("password")
  }
  get confirmPassword() {
    return this.registerForm.get("confirmPassword")
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return
    }

    this.isLoading = true
    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.isLoading = false
        if (response.success) {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Registration successful",
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
          detail: error.error?.message || "An error occurred during registration",
        })
      },
    })
  }
}
