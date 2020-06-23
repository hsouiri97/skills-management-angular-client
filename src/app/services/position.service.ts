import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ProcessHttpMsgService } from "./process-http-msg.service";
import { Observable } from "rxjs";
import { Position } from "../shared/models/Position";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class PositionService {
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  constructor(
    private http: HttpClient,
    private processHttpMsgService: ProcessHttpMsgService
  ) {}

  getPositions(): Observable<Position[]> {
    return this.http
      .get<Position[]>("positions")
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  addProject(position: Position): Observable<Position> {
    return this.http
      .post<Position>("positions", position, this.httpOptions)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  updatePosition(position: Position): Observable<Position> {
    return this.http
      .put<Position>("positions/" + position.id, position, this.httpOptions)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  deletePosition(position: Position): Observable<any> {
    return this.http
      .delete("positions/" + position.id, {
        responseType: "text",
      })
      .pipe(catchError(this.processHttpMsgService.handleError));
  }
}
