import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { User } from "../shared/models/User";
import { ProcessHttpMsgService } from "./process-http-msg.service";
import { catchError } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UsersManagementService {
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  constructor(
    private http: HttpClient,
    private processHttpMsgService: ProcessHttpMsgService
  ) {}

  getUsers(): Observable<User[]> {
    return this.http
      .get<User[]>("users-management")
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  createUser(user: User): Observable<User> {
    return this.http
      .post<User>("users-management", user, this.httpOptions)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  updateUser(user: User): Observable<User> {
    return this.http
      .put<User>("users-management/" + user.id, user, this.httpOptions)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  deleteUser(user: User): Observable<any> {
    return this.http
      .delete("users-management/" + user.id, {
        responseType: "text",
      })
      .pipe(catchError(this.processHttpMsgService.handleError));
  }
}
