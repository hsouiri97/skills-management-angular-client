import { Component, OnInit, ViewChild } from "@angular/core";
import { MatricesService } from "../../../services/matrices.service";
import { Matrix } from "../../../shared/models/Matrix";
import { User } from "../../../shared/models/User";
import { UserOfMatrix } from "../../../shared/models/UserOfMatrix";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-matrices",
  templateUrl: "./matrices.component.html",
  styleUrls: ["./matrices.component.scss"],
})
export class MatricesComponent implements OnInit {
  matrices: Matrix[];
  filteredMatrices: Matrix[];
  usersOfMatrix: UserOfMatrix[] = [];
  matrix: Matrix;
  selectedMatrix: Matrix;
  errMsg: string;
  modalRef: any;
  modalType: string;
  matrixForm: FormGroup;
  notificationMessage: string;
  @ViewChild("notificationModal", { static: false }) notificationModal;
  @ViewChild("errorModal", { static: false }) errorModal;
  usersToBeAffected: User[] = [];

  formErrors = {
    title: "",
  };

  validationMessages = {
    title: {
      required: "Le titre de la matrice est obligatoire.",
    },
  };

  constructor(
    private matricesService: MatricesService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.matricesService.getMatrices().subscribe(
      (matrices) => {
        this.matrices = matrices;
        this.filteredMatrices = this.matrices;
      },
      (errMsg) => {
        this.errMsg = errMsg;
        console.log(this.errMsg);
      }
    );
  }

  openViewModal(modalRef, selectedMatrix: Matrix): void {
    this.modalType = "view";
    this.modalRef = this.modalService.open(modalRef, { size: "lg" });
    this.selectedMatrix = selectedMatrix;
  }

  openNewModal(modalRef): void {
    this.modalType = "new";
    this.modalRef = this.modalService.open(modalRef, { size: "md" });
    this.createForm();
    this.selectedMatrix = new Matrix();
  }

  openEditModal(modalRef, selectedMatrix: Matrix): void {
    this.modalType = "edit";
    this.modalRef = this.modalService.open(modalRef, { size: "md" });
    this.createForm();
    this.selectedMatrix = new Matrix();
    this.selectedMatrix = selectedMatrix;
  }

  openDeleteModal(modalRef, selectedMatrix: Matrix): void {
    this.modalRef = this.modalService.open(modalRef, { size: "sm" });
    this.selectedMatrix = selectedMatrix;
  }

  openUsersOfMatrixModal(modalRef, selectedMatrix: Matrix): void {
    this.modalRef = this.modalService.open(modalRef, { size: "lg" });
    this.selectedMatrix = selectedMatrix;
    this.getUsersOfMatrix(this.selectedMatrix);
  }

  openAffectToUsersModal(modalRef, selectedMatrix: Matrix): void {
    this.usersToBeAffected = [];
    this.modalRef = this.modalService.open(modalRef, { size: "md" });
    this.selectedMatrix = selectedMatrix;
    this.getUsersOfMatrix(this.selectedMatrix);
  }

  closeModal(): void {
    this.errMsg = null;
    this.modalRef.close();
  }

  createForm(): void {
    this.matrixForm = this.formBuilder.group({
      title: ["", Validators.required],
    });

    this.matrixForm.valueChanges.subscribe(() => {
      this.onValueChanged();
    });

    this.onValueChanged();
  }

  onValueChanged(): void {
    if (!this.matrixForm) {
      return;
    }
    const form = this.matrixForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = "";
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + " ";
            }
          }
        }
      }
    }
  }

  addNewMatrix(): void {
    this.matrix = { ...this.matrixForm.value };

    this.matricesService.createMatrix(this.matrix).subscribe(
      (matrix) => {
        this.matrix = matrix;
        this.matrices.push(this.matrix);
        this.filteredMatrices = this.matrices;
        this.matrixForm.reset();
        this.errMsg = null;
        this.modalRef.close();

        this.notificationMessage = "Matrice ajoutée avec succès!";
        this.modalRef = this.modalService.open(this.notificationModal, {
          size: "sm",
        });
        setTimeout(() => {
          this.modalRef.close();
          this.notificationMessage = "";
        }, 5000);
      },
      (errMsg) => {
        this.errMsg = errMsg;
        console.log(this.errMsg);
      }
    );
  }

  updateMatrix(): void {
    this.matrix = { ...this.matrixForm.value };
    this.matrix.id = this.selectedMatrix.id;
    this.matricesService.updateMatrix(this.matrix).subscribe(
      (matrix) => {
        const index = this.matrices.indexOf(this.selectedMatrix);
        if (index > -1) {
          this.matrices.splice(index, 1);
        }
        this.matrix = matrix;
        this.matrices.splice(index, 0, this.matrix);
        this.filteredMatrices = this.matrices;

        this.matrixForm.reset();
        this.errMsg = null;
        this.modalRef.close();

        this.notificationMessage = "Matrice modifiée avec succès!";
        this.modalRef = this.modalService.open(this.notificationModal, {
          size: "sm",
        });
        setTimeout(() => {
          this.modalRef.close();
          this.notificationMessage = "";
        }, 2000);
      },
      (errMsg) => {
        this.errMsg = errMsg;
        console.log(this.errMsg);
      }
    );
  }

  deleteMatrix(): void {
    this.matricesService.deleteMatrix(this.selectedMatrix).subscribe(
      (result) => {
        console.log(result);
        const index = this.matrices.indexOf(this.selectedMatrix);
        if (index > -1) {
          this.matrices.splice(index, 1);
        }
        this.filteredMatrices = this.matrices;
        this.modalRef.close();

        this.notificationMessage = "Matrice supprimé avec succès!";
        this.modalRef = this.modalService.open(this.notificationModal, {
          size: "sm",
        });
        setTimeout(() => {
          this.modalRef.close();
          this.notificationMessage = "";
        }, 5000);
      },
      (errMsg) => {
        this.errMsg = errMsg;

        if (this.errMsg.startsWith("500")) {
          this.modalRef.close();
          this.errMsg = "la matrice sélectionnée ne peut pas être supprimée";
          this.modalRef = this.modalService.open(this.errorModal, {
            size: "sm",
          });
          setTimeout(() => {
            this.modalRef.close();
            this.errMsg = "";
          }, 5000);
        } else {
          console.log(this.errMsg);
        }
      }
    );
  }

  searchKeywordChanged(term: string) {
    this.filteredMatrices = this.matrices.filter(
      (matrix) =>
        matrix.title.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) !==
        -1
    );
  }

  private getUsersOfMatrix(selectedMatrix: Matrix): void {
    this.matricesService.getUsersOfMatrix(selectedMatrix).subscribe(
      (users) => {
        this.usersOfMatrix = users;
      },
      (errMsg) => {
        this.errMsg = errMsg;
        console.log(this.errMsg);
      }
    );
  }

  addToUsersToBeAffected(user: User): void {
    const ids: number[] = this.usersToBeAffected.map((user) => user.id);
    if (!ids.includes(user.id)) {
      this.usersToBeAffected.push(user);
    }
  }

  userAlreadyAffected(id: number): boolean {
    const alreadyAffectedUsersIds: number[] = this.usersOfMatrix.map(
      (user) => user.userId
    );
    return alreadyAffectedUsersIds.includes(id);
  }

  removeUserFromAffectedList(user: User): void {
    const index = this.usersToBeAffected.indexOf(user);
    if (index > -1) {
      this.usersToBeAffected.splice(index, 1);
    }
  }

  affectToMatrix() {
    let users: User[] = this.usersToBeAffected.filter(
      (user) => !this.userAlreadyAffected(user.id)
    );

    if (users.length > 0) {
      let counter: number = 0;
      users.forEach((user) => {
        this.matricesService
          .affectMatrixToUser(this.selectedMatrix, user)
          .subscribe(
            (result) => {
              console.log(result);

              counter++;
              if (counter === users.length) {
                this.errMsg = null;
                this.modalRef.close();

                this.notificationMessage =
                  "La matrice a été affectée avec succès aux collaborateurs!";
                this.modalRef = this.modalService.open(this.notificationModal, {
                  size: "sm",
                });
                setTimeout(() => {
                  this.modalRef.close();
                  this.notificationMessage = "";
                }, 5000);
              }
            },
            (errMsg) => {
              console.log(errMsg);
            }
          );
      });
    } else {
      this.modalRef.close();
      this.errMsg = "Aucun utilisateur pouvant être affecté!";
      this.modalRef = this.modalService.open(this.errorModal, {
        size: "sm",
      });
      setTimeout(() => {
        this.modalRef.close();
        this.errMsg = "";
      }, 5000);
    }
  }
}
