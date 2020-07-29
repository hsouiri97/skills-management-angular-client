import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { ProcessHttpMsgService } from "./process-http-msg.service";
import { catchError } from "rxjs/operators";
import { decode } from "punycode";

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
    this.loadToken();
    if (this.token !== "") {
      this.saveToken("");
    }
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

  isAdmin(): boolean {
    this.loadToken();
    let admin: boolean = false;
    if (this.token) {
      const decodedToken = this.helper.decodeToken(this.token);
      if (decodedToken.authorities) {
        decodedToken.authorities.forEach((a) => {
          if (a.authority === "ROLE_ADMIN") {
            admin = true;
          }
        });
      }
    }
    return admin;
  }

  getUsername(): string {
    this.loadToken();
    if (this.token) {
      const decodedToken = this.helper.decodeToken(this.token);
      if (decodedToken.sub) {
        return decodedToken.sub;
      }
      return "";
    }
    return "";
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem("token");
  }
}
