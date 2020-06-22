import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { ProcessHttpMsgService } from "./process-http-msg.service";
import { Matrix } from "../shared/models/Matrix";
import { UserOfMatrix } from "../shared/models/UserOfMatrix";
import { User } from "../shared/models/User";
import { UserMatrix } from "../shared/models/UserMatrix";

@Injectable({
  providedIn: "root",
})
export class MatricesService {
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  constructor(
    private http: HttpClient,
    private processHttpMsgService: ProcessHttpMsgService
  ) {}

  getMatrices(): Observable<Matrix[]> {
    return this.http
      .get<Matrix[]>("skills-matrices")
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  createMatrix(matrix: Matrix): Observable<Matrix> {
    return this.http
      .post<Matrix>("skills-matrices", matrix, this.httpOptions)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  updateMatrix(matrix: Matrix): Observable<Matrix> {
    return this.http
      .put<Matrix>("skills-matrices/" + matrix.id, matrix, this.httpOptions)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  deleteMatrix(matrix: Matrix): Observable<any> {
    return this.http
      .delete("skills-matrices/" + matrix.id, {
        responseType: "text",
      })
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getUsersOfMatrix(matrix: Matrix): Observable<UserOfMatrix[]> {
    return this.http
      .get<UserOfMatrix[]>("skills-matrices/users-of-matrix/" + matrix.id)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  affectMatrixToUser(matrix: Matrix, user: User) {
    return this.http
      .post(
        `skills-matrices/${matrix.id}/affect-to-user/${user.id}`,
        {},
        {
          responseType: "text",
        }
      )
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getMatricesTitleOnly(): Observable<Matrix[]> {
    return this.http
      .get<Matrix[]>("skills-matrices/title-only")
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getMyMatrices(): Observable<UserMatrix[]> {
    return this.http
      .get<UserMatrix[]>("skills-matrices/my-matrices")
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  setRating(matrix: Matrix, rating: number): Observable<string> {
    return this.http
      .put(
        `skills-matrices/${matrix.id}/set-rating/${rating}`,
        {},
        { responseType: "text" }
      )
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getMatrixUserList(): Observable<UserMatrix[]> {
    return this.http
      .get<UserMatrix[]>("skills-matrices/users-and-ratings")
      .pipe(catchError(this.processHttpMsgService.handleError));
  }
}
