import { Component, OnInit, ViewChild } from "@angular/core";
import { UsersManagementService } from "../../services/users-management.service";
import { User } from "../../shared/models/User";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-users-management",
  templateUrl: "./users-management.component.html",
  styleUrls: ["./users-management.component.scss"],
})
export class UsersManagementComponent implements OnInit {
  users: User[];
  filteredUsers: User[];
  errMsg: string;
  modalType: string;
  user: User;
  userCopy: User = new User();
  collaboratorForm: FormGroup;
  modalRef: any;
  emailAlreadyExists: boolean;
  addSuccess: boolean;
  updateSuccess: boolean;
  deleteSuccess: boolean;
  searchKeyword: string;
  notificationMessage: string;
  @ViewChild("notificationModal", { static: false }) notificationModal;
  @ViewChild("errorModal", { static: false }) errorModal;

  formErrors = {
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    address: "",
    cin: "",
  };

  validationMessages = {
    firstName: {
      required: "Le prénom est obligatoire.",
      maxlength: "Le prénom peut comporter au maximum 20 caractères.",
    },
    lastName: {
      required: "Le nom de famille est obligatoire.",
      maxlength: "Le nom de famille peut comporter au maximum 40 caractères.",
    },
    email: {
      required: "L'email est obligatoire.",
      pattern: "Veuillez saisir une adresse e-mail valide.",
    },
    mobile: {
      required: "Le numéro de mobile est obligatoire.",
      pattern: "Veuillez saisir un numéro de mobile valide.",
    },
    address: {
      required: "L'adresse est obligatoire.",
      maxlength: "L'adresse' peut comporter au maximum 250 caractères.",
    },
    cin: {
      required: "Le CIN est obligatoire.",
      maxlength: "Le CIN doit comporter 6 caractéres.",
      minlength: "Le CIN doit comporter 6 caractéres.",
    },
  };

  constructor(
    private userManagementService: UsersManagementService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.userManagementService.getUsers().subscribe(
      (users) => {
        this.users = users;
        this.users.forEach((user) => {
          user.entryDate = this.formatDate(user.entryDate);
          user.integrationDate = this.formatDate(user.integrationDate);
          user.departureDate = this.formatDate(user.departureDate);
        });
        this.filteredUsers = this.users;
        this.createForm();
      },
      (errMsg) => {
        this.errMsg = errMsg;
      }
    );
    if (this.modalRef) {
      this.modalRef.result.then(() => {
        this.collaboratorForm.reset();
      });
    }
  }

  openNewModal(modalRef) {
    this.modalType = "new";
    this.modalRef = this.modalService.open(modalRef, { size: "lg" });
    this.userCopy = new User();
  }

  openEditModal(modalRef, selectedUser: User) {
    this.modalType = "edit";
    this.modalRef = this.modalService.open(modalRef, { size: "lg" });
    this.userCopy = new User();
    this.userCopy = selectedUser;
    this.user = this.users.filter((user) => this.userCopy.id === user.id)[0];
  }

  openViewModal(modalRef, selectedUser: User) {
    this.modalType = "view";
    this.modalRef = this.modalService.open(modalRef, { size: "lg" });
    this.userCopy = new User();
    this.userCopy = selectedUser;
  }

  openDeleteModal(modalRef, selectedUser: User) {
    this.modalRef = this.modalService.open(modalRef, { size: "sm" });
    this.user = selectedUser;
  }

  closeModal(): void {
    //this.collaboratorForm.reset();
    this.errMsg = null;
    this.emailAlreadyExists = false;
    this.modalRef.close();
  }

  createForm(): void {
    this.collaboratorForm = this.formBuilder.group({
      firstName: ["", [Validators.required, Validators.maxLength(20)]],
      lastName: ["", [Validators.required, Validators.maxLength(40)]],
      gender: "male",
      manager: null,
      yearsOfExperience: 0,
      email: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ],
      mobile: ["", [Validators.required, Validators.pattern("[0-9]*")]],
      diploma: "",
      cin: [
        "",
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      ],
      entryDate: "",
      integrationDate: "",
      departureDate: "",
      username: [{ value: "" }],
    });

    this.collaboratorForm.valueChanges.subscribe(() => {
      this.onValueChanged();
    });

    this.onValueChanged();
  }

  onValueChanged() {
    if (!this.collaboratorForm) {
      return;
    }
    const form = this.collaboratorForm;
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

  addNewUser(): void {
    const formValue = { ...this.collaboratorForm.value };

    this.mapFormToUser(formValue);

    this.userCopy.address = "Veuillez indiquer votre adresse actuelle.";
    this.userCopy.password = "Abcd@1234";
    this.userCopy.confirmPassword = "Abcd@1234";
    if (!this.userCopy.gender) {
      this.userCopy.gender = "male";
    }

    this.userManagementService.createUser(this.userCopy).subscribe(
      (user) => {
        this.user = user;

        this.user.entryDate = this.formatDate(this.user.entryDate);
        this.user.integrationDate = this.formatDate(this.user.integrationDate);
        this.user.departureDate = this.formatDate(this.user.departureDate);
        this.users.push(this.user);
        this.filteredUsers = this.users;
        this.collaboratorForm.reset();
        this.errMsg = null;
        this.emailAlreadyExists = false;
        this.modalRef.close();

        this.notificationMessage = "Collaborateur ajouté avec succès!";
        this.modalRef = this.modalService.open(this.notificationModal, {
          size: "sm",
        });
        setTimeout(() => {
          this.modalRef.close();
          this.notificationMessage = "";
        }, 5000);
      },
      (errMsg) => {
        if (errMsg.startsWith("409")) {
          this.emailTaken();
        } else {
          this.errMsg = errMsg;
        }
      }
    );
  }

  updateUser(): void {
    const formValue = { ...this.collaboratorForm.value };

    this.mapFormToUser(formValue);
    if (!this.userCopy.gender) {
      this.userCopy.gender = "male";
    }

    this.userCopy.address = this.user.address;
    this.userCopy.id = this.user.id;
    console.log(this.userCopy);

    this.userManagementService.updateUser(this.userCopy).subscribe(
      (user) => {
        const index = this.users.indexOf(this.user);
        if (index > -1) {
          this.users.splice(index, 1);
        }

        this.user = user;
        this.user.entryDate = this.formatDate(user.entryDate);
        this.user.integrationDate = this.formatDate(user.integrationDate);
        this.user.departureDate = this.formatDate(user.departureDate);
        this.userCopy = { ...this.user };

        this.users.push(this.userCopy);
        this.filteredUsers = this.users;
        this.errMsg = null;
        this.emailAlreadyExists = false;
        this.modalRef.close();

        this.notificationMessage = "Collaborateur modifié avec succès!";
        this.modalRef = this.modalService.open(this.notificationModal, {
          size: "sm",
        });
        setTimeout(() => {
          this.modalRef.close();
          this.notificationMessage = "";
        }, 5000);
      },
      (errMsg) => {
        if (errMsg.startsWith("409")) {
          this.emailTaken();
        } else {
          this.errMsg = errMsg;
        }
      }
    );
  }

  private emailTaken(): void {
    this.userCopy.entryDate = this.formatDate(this.userCopy.entryDate);
    this.userCopy.integrationDate = this.formatDate(
      this.userCopy.integrationDate
    );
    this.userCopy.departureDate = this.formatDate(this.userCopy.departureDate);
    this.emailAlreadyExists = true;
  }

  deleteUser(): void {
    this.userManagementService.deleteUser(this.user).subscribe(
      (result) => {
        console.log(result);
        const index = this.users.indexOf(this.user);

        if (index > -1) {
          this.users.splice(index, 1);
        }

        this.filteredUsers = this.users;

        this.modalRef.close();

        this.notificationMessage = "Collaborateur supprimé avec succès!";
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
          this.errMsg =
            "le collaborateur sélectionné ne peut pas être supprimée";
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

  private formatDate(stringDate: string): any {
    if (stringDate) {
      let date = new Date(stringDate);

      let formattedDate = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      };

      return formattedDate;
    }
    return null;
  }

  private mapFormToUser(formValue: any) {
    this.userCopy = formValue;
    if (
      formValue.entryDate &&
      formValue.entryDate.year &&
      formValue.entryDate.month &&
      formValue.entryDate.day
    ) {
      this.userCopy.entryDate =
        formValue.entryDate.year +
        "-" +
        (formValue.entryDate.month.toString().length === 1 ? "0" : "") +
        formValue.entryDate.month +
        "-" +
        (formValue.entryDate.day.toString().length === 1 ? "0" : "") +
        formValue.entryDate.day;
    }
    if (
      formValue.integrationDate &&
      formValue.integrationDate.year &&
      formValue.integrationDate.month &&
      formValue.integrationDate.day
    ) {
      this.userCopy.integrationDate =
        formValue.integrationDate.year +
        "-" +
        (formValue.integrationDate.month.toString().length === 1 ? "0" : "") +
        formValue.integrationDate.month +
        "-" +
        (formValue.integrationDate.day.toString().length === 1 ? "0" : "") +
        formValue.integrationDate.day;
    }
    if (
      formValue.departureDate &&
      formValue.departureDate.year &&
      formValue.departureDate.month &&
      formValue.departureDate.day
    ) {
      this.userCopy.departureDate =
        formValue.departureDate.year +
        "-" +
        (formValue.departureDate.month.toString().length === 1 ? "0" : "") +
        formValue.departureDate.month +
        "-" +
        (formValue.departureDate.day.toString().length === 1 ? "0" : "") +
        formValue.departureDate.day;
    }
  }

  searchKeywordChanged(term: string): void {
    this.filteredUsers = this.users.filter((user) => {
      if (
        user.firstName.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) !==
          -1 ||
        user.lastName.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) !==
          -1
      ) {
        return user;
      }
    });
  }

  checkEmailValue(emailValue: string): void {
    if (this.emailAlreadyExists) {
      this.emailAlreadyExists = false;
    }
  }
}
