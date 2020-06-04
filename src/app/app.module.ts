import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ChartsModule } from "ng2-charts";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { SidebarComponent } from "./shared/sidebar/sidebar.component";
import { FooterComponent } from "./shared/footer/footer.component";
import { DashboardComponent } from "./home/dashboard/dashboard.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { TodoComponent } from "./apps/todo-list/todo/todo.component";
import { SpinnerComponent } from "./shared/spinner/spinner.component";
import { ContentAnimateDirective } from "./shared/directives/content-animate.directive";
import { TodoListComponent } from "./apps/todo-list/todo-list.component";

import { APIInterceptor } from "./services/api.interceptor";
import { TokenInterceptor } from "./services/token.interceptor";

import { AuthGuard } from "./guards/auth.guard";
import { NotFoundComponent } from "./not-found/not-found.component";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    DashboardComponent,
    TodoComponent,
    SpinnerComponent,
    ContentAnimateDirective,
    TodoListComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: APIInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    AuthGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
