import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Observable } from "rxjs";
import { Skill } from "../shared/models/Skill";
import { Matrix } from "../shared/models/Matrix";
import { ProcessHttpMsgService } from "./process-http-msg.service";

@Injectable({
  providedIn: "root",
})
export class SkillsService {
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  constructor(
    private http: HttpClient,
    private processHttpMsgService: ProcessHttpMsgService
  ) {}

  getSkills(): Observable<Skill[]> {
    return this.http
      .get<Skill[]>("skills")
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  createSkill(skill: Skill): Observable<Skill> {
    return this.http
      .post<Skill>("skills", skill, this.httpOptions)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  updateSkill(skill: Skill): Observable<Skill> {
    return this.http
      .put<Skill>(`skills/${skill.id}`, skill, this.httpOptions)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  deleteSkill(skill: Skill): Observable<string> {
    return this.http
      .delete(`skills/${skill.id}`, { responseType: "text" })
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getMatricesOfSkill(skill: Skill): Observable<Matrix[]> {
    return this.http
      .get<Matrix[]>(`skills-matrices/of-skill/${skill.id}`)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  addSkillToMatrix(skill: Skill, matrix: Matrix): Observable<string> {
    return this.http
      .post(
        `skills/${skill.id}/add-to-matrix/${matrix.id}`,
        {},
        {
          responseType: "text",
        }
      )
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  removeSkillFromMatrix(skill: Skill, matrix: Matrix): Observable<string> {
    return this.http
      .delete(`skills/${skill.id}/remove-from-matrix/${matrix.id}`, {
        responseType: "text",
      })
      .pipe(catchError(this.processHttpMsgService.handleError));
  }
}
