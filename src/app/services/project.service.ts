import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ProcessHttpMsgService } from "./process-http-msg.service";
import { Observable } from "rxjs";
import { Project } from "../shared/models/project";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ProjectService {
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  constructor(
    private http: HttpClient,
    private processHttpMsgService: ProcessHttpMsgService
  ) {}

  getProjects(): Observable<Project[]> {
    return this.http
      .get<Project[]>("projects")
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  addProject(project: Project): Observable<Project> {
    return this.http
      .post<Project>("projects", project, this.httpOptions)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  updateProject(project: Project): Observable<Project> {
    return this.http
      .put<Project>("projects/" + project.id, project, this.httpOptions)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  deleteProject(project: Project): Observable<any> {
    return this.http
      .delete("projects/" + project.id, {
        responseType: "text",
      })
      .pipe(catchError(this.processHttpMsgService.handleError));
  }
}
