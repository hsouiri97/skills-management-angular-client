import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ProcessHttpMsgService } from "./process-http-msg.service";
import { Observable } from "rxjs";
import { UserProfile } from "../shared/models/UserProfile";
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

  getProfile(): Observable<UserProfile> {
    return this.http
      .get<UserProfile>("profile")
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  updateProfile(userProfile: UserProfile): Observable<UserProfile> {
    return this.http
      .put<UserProfile>("profile", userProfile, this.httpOptions)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }
}
