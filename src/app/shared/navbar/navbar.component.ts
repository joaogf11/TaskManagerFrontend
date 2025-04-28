import { Component, type OnInit } from "@angular/core"
import type { Router } from "@angular/router"
import type { MenuItem } from "primeng/api"
import type { AuthService } from "../../auth/auth.service"

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] = []
  isLoggedIn = false
  username = ""

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.updateMenu()
    this.authService.currentUser$.subscribe((user) => {
      this.isLoggedIn = !!user
      this.username = user?.username || ""
      this.updateMenu()
    })
  }

  updateMenu(): void {
    if (this.isLoggedIn) {
      this.items = [
        {
          label: "Tasks",
          icon: "pi pi-list",
          routerLink: "/tasks",
        },
      ]
    } else {
      this.items = [
        {
          label: "Home",
          icon: "pi pi-home",
          routerLink: "/",
        },
        {
          label: "Login",
          icon: "pi pi-sign-in",
          routerLink: "/login",
        },
        {
          label: "Register",
          icon: "pi pi-user-plus",
          routerLink: "/register",
        },
      ]
    }
  }

  logout(): void {
    this.authService.logout()
    this.router.navigate(["/login"])
  }
}
