import { Component, OnInit, ViewChild } from "@angular/core";
import { Skill } from "../../../shared/models/Skill";
import { UnderSkill } from "../../../shared/models/UnderSkill";
import { Matrix } from "../../../shared/models/Matrix";
import { SkillsService } from "../../../services/skills.service";
import { MatricesService } from "../../../services/matrices.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators, NgForm } from "@angular/forms";
import { Observable, of, from } from "rxjs";

@Component({
  selector: "app-skills",
  templateUrl: "./skills.component.html",
  styleUrls: ["./skills.component.scss"],
})
export class SkillsComponent implements OnInit {
  skills: Skill[];
  filteredSkills: Skill[];
  skill: Skill;
  selectedSkill: Skill;
  underSkill: UnderSkill = new UnderSkill();
  matricesOfSkill: Matrix[] = [];
  matricesOfSkillCopy: Matrix[] = [];
  allMatrices: Matrix[] = [];
  eligibleMatrices: Matrix[] = [];
  modalRef: any;
  errMsg: string;
  modalType: string;
  skillForm: FormGroup;
  hasUnderSkills: boolean;
  notificationMessage: string;
  @ViewChild("underSkillForm", { static: false }) underSkillForm: NgForm;
  @ViewChild("notificationModal", { static: false }) notificationModal;
  @ViewChild("errorModal", { static: false }) errorModal;

  formErrors = {
    skillName: "",
  };

  validationMessages = {
    skillName: {
      required: "Le nom de la compétence est obligatoire.",
    },
  };

  constructor(
    private skillsService: SkillsService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private matricesService: MatricesService
  ) {}

  ngOnInit() {
    this.skillsService.getSkills().subscribe(
      (skills) => {
        this.skills = skills;
        this.filteredSkills = this.skills;
      },
      (errMsg) => {
        this.errMsg = errMsg;
        console.log(this.errMsg);
      }
    );
    this.getAllMatrices();
  }

  openViewModal(modalRef, skill: Skill) {
    this.selectedSkill = skill;
    this.modalService.open(modalRef);
  }

  openNewModal(modalRef): void {
    this.modalType = "new";
    this.modalRef = this.modalService.open(modalRef);
    this.createForm();
    this.selectedSkill = new Skill();
    this.selectedSkill.underSkills = [];
  }

  openEditModal(modalRef, selectedSkill: Skill) {
    this.modalType = "edit";
    this.modalRef = this.modalService.open(modalRef);
    this.createForm();
    this.skill = { ...selectedSkill };
    this.selectedSkill = selectedSkill;
    this.hasUnderSkills = true;
  }

  openDeleteModal(modalRef, selectedSkill: Skill): void {
    this.modalRef = this.modalService.open(modalRef, { size: "sm" });
    this.selectedSkill = selectedSkill;
  }

  openAddToMatrixModal(modalRef, selectedSkill: Skill): void {
    this.modalRef = this.modalService.open(modalRef);
    this.selectedSkill = selectedSkill;

    this.getMatricesOfSkill(selectedSkill);
  }

  closeModal(): void {
    //console.log(this.selectedSkill);
    const index = this.filteredSkills.indexOf(this.selectedSkill);
    if (index > -1) {
      this.filteredSkills.splice(index, 0, this.skill);
    }
    this.modalRef.close();
  }

  createForm(): void {
    this.skillForm = this.formBuilder.group({
      name: ["", Validators.required],
      hasUnderSkills: null,
    });
    this.skillForm.valueChanges.subscribe(() => this.onValueChanged());
  }

  onValueChanged(): void {
    if (!this.skillForm) {
      return;
    }
    const form = this.skillForm;
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

  addUnderSkill(underSkill: UnderSkill): void {
    this.underSkill = underSkill;
    this.selectedSkill.underSkills.push(this.underSkill);

    this.underSkill = new UnderSkill();
  }

  removeUnderSkill(underSkill: UnderSkill): void {
    const index = this.selectedSkill.underSkills.indexOf(underSkill);
    if (index > -1) {
      this.selectedSkill.underSkills.splice(index, 1);
    }
  }

  addNewSkill(): void {
    this.skill = { ...this.selectedSkill };
    if (!this.hasUnderSkills) {
      this.skill.underSkills = [];
    }

    this.skillsService.createSkill(this.skill).subscribe((skill) => {
      this.skill = skill;
      this.skills.push(this.skill);
      this.filteredSkills = this.skills;
      this.errMsg = null;
      this.modalRef.close();

      this.notificationMessage = "Compétence ajoutée avec succès!";
      this.modalRef = this.modalService.open(this.notificationModal, {
        size: "sm",
      });
      setTimeout(() => {
        this.modalRef.close();
        this.notificationMessage = "";
      }, 5000);
    });
  }

  updateSkill(): void {
    this.skill = { ...this.selectedSkill };
    if (!this.hasUnderSkills) {
      this.skill.underSkills = [];
    }
    this.skillsService.updateSkill(this.skill).subscribe(
      (skill) => {
        this.skill = skill;
        const index = this.skills.indexOf(this.selectedSkill);
        if (index > -1) {
          this.skills.splice(index, 1, this.skill);
        }
        this.filteredSkills = this.skills;
        this.errMsg = null;
        this.modalRef.close();

        this.notificationMessage = "Compétence modifiée avec succès!";
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

  deleteSkill(): void {
    this.skillsService.deleteSkill(this.selectedSkill).subscribe(
      (result) => {
        console.log(result);
        const index = this.skills.indexOf(this.selectedSkill);
        if (index > -1) {
          this.skills.splice(index, 1);
        }
        this.filteredSkills = this.skills;
        this.modalRef.close();

        this.notificationMessage = "Compétence supprimé avec succès!";
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
          this.errMsg = "la compétence sélectionnée ne peut pas être supprimée";
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

  private getMatricesOfSkill(selectedSkill: Skill): void {
    this.skillsService.getMatricesOfSkill(selectedSkill).subscribe(
      (matrices) => {
        this.matricesOfSkill = matrices;
        this.matricesOfSkillCopy = [...this.matricesOfSkill];
        this.eligibleMatrices = this.allMatrices.filter(
          (matrix) => !this.matricesOfSkill.map((m) => m.id).includes(matrix.id)
        );
      },
      (errMsg) => {
        this.errMsg = errMsg;
        console.log(this.errMsg);
      }
    );
  }

  private getAllMatrices(): void {
    this.matricesService.getMatricesTitleOnly().subscribe(
      (matrices) => {
        this.allMatrices = matrices;
      },
      (errMsg) => {
        this.errMsg = errMsg;
        console.log(this.errMsg);
      }
    );
  }

  selectMatrix(matrix: Matrix): void {
    const index = this.eligibleMatrices.indexOf(matrix);
    this.matricesOfSkillCopy.push(matrix);
    if (index > -1) {
      this.eligibleMatrices.splice(index, 1);
    }
  }

  removeMatrix(matrix: Matrix): void {
    const index = this.matricesOfSkillCopy.indexOf(matrix);
    if (index > -1) {
      this.matricesOfSkillCopy.splice(index, 1);
    }
    this.eligibleMatrices.push(matrix);
  }

  addAndRemoveFromMatrices(): void {
    let matricesToAdd: Matrix[] = this.matricesOfSkillCopy.filter(
      (matrix) => !this.matricesOfSkill.map((m) => m.id).includes(matrix.id)
    );
    let oldOnes: Matrix[] = this.matricesOfSkillCopy.filter(
      (matrix) => !matricesToAdd.map((m) => m.id).includes(matrix.id)
    );
    let matricesToRemove: Matrix[] = [];
    if (oldOnes.length < this.matricesOfSkill.length) {
      matricesToRemove = this.matricesOfSkill.filter(
        (matrix) => !oldOnes.map((m) => m.id).includes(matrix.id)
      );
    }

    if (matricesToAdd.length > 0 && matricesToRemove.length > 0) {
      let counter1 = 0;
      matricesToAdd.forEach((matrix) =>
        this.skillsService
          .addSkillToMatrix(this.selectedSkill, matrix)
          .subscribe(
            (result) => {
              counter1++;
              if (counter1 === matricesToAdd.length) {
                this.removeFromFromMatrices(matricesToRemove);
              }
            },
            (errMsg) => {
              console.log(errMsg);
            }
          )
      );
    } else if (matricesToAdd.length > 0 && matricesToRemove.length === 0) {
      this.addToMatrices(matricesToAdd);
    } else if (matricesToAdd.length === 0 && matricesToRemove.length > 0) {
      this.removeFromFromMatrices(matricesToRemove);
    }
    //let matricesToRemove: Matrix[] = this.matricesOfSkill.
  }

  private allOk() {
    this.modalRef.close();
    this.notificationMessage = "Super tout a l'air bien!";
    this.modalRef = this.modalService.open(this.notificationModal, {
      size: "sm",
    });
    setTimeout(() => {
      this.modalRef.close();
      this.notificationMessage = "";
    }, 5000);
  }

  private addToMatrices(matrices: Matrix[]): void {
    let counter = 0;

    matrices.forEach((matrix) => {
      this.skillsService.addSkillToMatrix(this.selectedSkill, matrix).subscribe(
        (result) => {
          counter++;
          if (counter === matrices.length) {
            this.allOk();
          }
        },
        (errMsg) => {
          console.log(errMsg);
        }
      );
    });
  }

  private removeFromFromMatrices(matrices: Matrix[]): void {
    let counter = 0;

    matrices.forEach((matrix) => {
      this.skillsService
        .removeSkillFromMatrix(this.selectedSkill, matrix)
        .subscribe(
          (result) => {
            counter++;
            if (counter === matrices.length) {
              this.allOk();
            }
          },
          (errMsg) => {
            console.log(errMsg);
          }
        );
    });
  }

  arraysEquals(): boolean {
    return (
      this.matricesOfSkill.length === this.matricesOfSkillCopy.length &&
      this.matricesOfSkill
        .sort((a: Matrix, b: Matrix) => a.id - b.id)
        .every(
          (value, index) =>
            value ===
            this.matricesOfSkillCopy.sort(
              (a: Matrix, b: Matrix) => a.id - b.id
            )[index]
        )
    );
  }

  searchKeywordChanged(term: string) {
    this.filteredSkills = this.skills.filter(
      (skill) =>
        skill.name.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) !== -1
    );
  }
}
