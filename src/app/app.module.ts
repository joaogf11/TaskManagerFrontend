import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"

// PrimeNG Components
import { ButtonModule } from "primeng/button"
import { InputTextModule } from "primeng/inputtext"
import { CardModule } from "primeng/card"
import { TableModule } from "primeng/table"
import { ToastModule } from "primeng/toast"
import { MessageService } from "primeng/api"
import { PasswordModule } from "primeng/password"
import { DialogModule } from "primeng/dialog"
import { ConfirmDialogModule } from "primeng/confirmdialog"
import { ConfirmationService } from "primeng/api"
import { DropdownModule } from "primeng/dropdown"
import { CalendarModule } from "primeng/calendar"
import { CheckboxModule } from "primeng/checkbox"
import { MenubarModule } from "primeng/menubar"
import { ProgressSpinnerModule } from "primeng/progressspinner"
import { TagModule } from "primeng/tag"
import { TooltipModule } from "primeng/tooltip"

// Components
import { AppComponent } from "./app.component"
import { LoginComponent } from "./auth/login/login.component"
import { RegisterComponent } from "./auth/register/register.component"
import { TaskListComponent } from "./tasks/task-list/task-list.component"
import { TaskFormComponent } from "./tasks/task-form/task-form.component"
import { NavbarComponent } from "./shared/navbar/navbar.component"
import { HomeComponent } from "./home/home.component"

// Services and Interceptors
import { AuthInterceptor } from "./auth/auth.interceptor"
import { AppRoutingModule } from "./app-routing.module"

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    TaskListComponent,
    TaskFormComponent,
    NavbarComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,

    // PrimeNG Modules
    ButtonModule,
    InputTextModule,
    CardModule,
    TableModule,
    ToastModule,
    PasswordModule,
    DialogModule,
    ConfirmDialogModule,
    DropdownModule,
    CalendarModule,
    CheckboxModule,
    MenubarModule,
    ProgressSpinnerModule,
    TagModule,
    TooltipModule,
  ],
  providers: [
    MessageService,
    ConfirmationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
