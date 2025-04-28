import { Injectable } from "@angular/core"
import type { CanActivate, Router, UrlTree } from "@angular/router"
import type { Observable } from "rxjs"
import type { AuthService } from "./auth.service"

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isLoggedIn()) {
      return true
    }

    this.router.navigate(["/login"])
    return false
  }
}
