import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ProcessHttpMsgService } from "./process-http-msg.service";
import { Observable } from "rxjs";
import { User } from "../shared/models/User";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  constructor(
    private http: HttpClient,
    private processHttpMsgService: ProcessHttpMsgService
  ) {}

  getProfile(): Observable<User> {
    return this.http
      .get<User>("profile")
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  updateProfile(User: User): Observable<User> {
    return this.http
      .put<User>("profile", User, this.httpOptions)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }
}
