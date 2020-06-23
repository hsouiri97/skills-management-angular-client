import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ProcessHttpMsgService } from "./process-http-msg.service";
import { Observable } from "rxjs";
import { Department } from "../shared/models/department";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class DepartmentService {
  constructor(
    private http: HttpClient,
    private processHttpMsgService: ProcessHttpMsgService
  ) {}

  getDepartments(): Observable<Department[]> {
    return this.http
      .get<Department[]>("departments")
      .pipe(catchError(this.processHttpMsgService.handleError));
  }
}
