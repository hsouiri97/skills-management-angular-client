import { Component, OnInit } from "@angular/core";
import { MatricesService } from "../../../services/matrices.service";
import { UserMatrix } from "../../../shared/models/UserMatrix";
import { Matrix } from "../../../shared/models/Matrix";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UserOfMatrix } from "src/app/shared/models/UserOfMatrix";

@Component({
  selector: "app-results",
  templateUrl: "./results.component.html",
  styleUrls: ["./results.component.scss"],
})
export class ResultsComponent implements OnInit {
  userMatrixList: UserMatrix[];
  selectedUserMatrixList: UserMatrix[];
  matrices: Matrix[] = [];
  filteredMatrices: Matrix[] = [];
  selectedMatrix: Matrix;
  usersOfMatrix: UserOfMatrix[];
  filteredUsersOfMatrix: UserOfMatrix[];
  modalRef: any;
  errMsg: string;

  constructor(
    private matricesService: MatricesService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.matricesService.getMatrixUserList().subscribe(
      (userMatrixList) => {
        this.userMatrixList = userMatrixList;
        console.log(this.userMatrixList);

        let allMatrices: Matrix[] = this.userMatrixList.map(
          (userMatrix) => userMatrix.skillsMatrix
        );

        allMatrices.forEach((matrix) => {
          if (!this.matrices.map((m) => m.id).includes(matrix.id)) {
            this.matrices.push(matrix);
            this.filteredMatrices.push(matrix);
          }
        });
      },
      (errMsg) => {
        this.errMsg = errMsg;
        console.log(errMsg);
      }
    );
  }

  openResultsModal(modalRef, selectedMatrix: Matrix) {
    this.selectedMatrix = selectedMatrix;
    this.matricesService.getUsersOfMatrix(this.selectedMatrix).subscribe(
      (usersOfMatrix) => {
        this.usersOfMatrix = usersOfMatrix;
        this.filteredUsersOfMatrix = this.usersOfMatrix;
        this.modalRef = this.modalService.open(modalRef, { size: "lg" });
        this.selectedUserMatrixList = this.userMatrixList.filter(
          (userMatrix) => userMatrix.skillsMatrix.id === this.selectedMatrix.id
        );
      },
      (errMsg) => {
        this.errMsg = errMsg;
        console.log(this.errMsg);
      }
    );
  }

  getUserRating(user: UserOfMatrix): number {
    return this.selectedUserMatrixList.filter(
      (um) => um.userId === user.userId
    )[0].averageRating;
  }

  searchKeywordChanged(term: string): void {
    this.filteredMatrices = this.matrices.filter(
      (matrix) =>
        matrix.title.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) !==
        -1
    );
  }

  searchKeywordChanged2(term: string): void {
    this.filteredUsersOfMatrix = this.usersOfMatrix.filter((userOfMatrix) => {
      if (
        userOfMatrix.userFirstName
          .toLocaleLowerCase()
          .indexOf(term.toLocaleLowerCase()) !== -1 ||
        userOfMatrix.userLastName
          .toLocaleLowerCase()
          .indexOf(term.toLocaleLowerCase()) !== -1 ||
        (this.getUserRating(userOfMatrix) !== null &&
          this.getUserRating(userOfMatrix)
            .toString()
            .toLocaleLowerCase()
            .indexOf(term.toLocaleLowerCase()) !== -1)
      ) {
        return userOfMatrix;
      }
    });
  }
}
