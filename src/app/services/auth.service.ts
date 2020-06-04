import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { ProcessHttpMsgService } from "./process-http-msg.service";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  token: string = null;
  helper = new JwtHelperService();

  constructor(
    private http: HttpClient,
    private processHttpMsgService: ProcessHttpMsgService
  ) {}

  login(username: string, password: string) {
    return this.http
      .post(
        "login",
        {
          username,
          password,
        },
        { observe: "response" }
      )
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  saveToken(token: string): void {
    this.token = token;
    localStorage.setItem("token", this.token);
  }

  loadToken(): void {
    this.token = localStorage.getItem("token");
  }

  isLoggedIn(): boolean {
    this.loadToken();
    if (this.token) {
      return !this.helper.isTokenExpired(this.token);
    }
    return false;
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem("token");
  }
}
