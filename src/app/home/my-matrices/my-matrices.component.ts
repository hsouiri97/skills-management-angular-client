import { Component, OnInit, ViewChild } from "@angular/core";
import { MatricesService } from "../../services/matrices.service";
import { SkillsService } from "../../services/skills.service";
import { UserMatrix } from "../../shared/models/UserMatrix";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-my-matrices",
  templateUrl: "./my-matrices.component.html",
  styleUrls: ["./my-matrices.component.scss"],
})
export class MyMatricesComponent implements OnInit {
  myMatrices: UserMatrix[] = [];
  myFilteredMatrices: UserMatrix[] = [];
  myMatrix: UserMatrix;
  selectedMyMatrix: UserMatrix;
  modalRef: any;
  notificationMessage: string;
  errMsg: string;
  @ViewChild("ratingsForm", { static: false }) ratingsForm: NgForm;
  @ViewChild("notificationModal", { static: false }) notificationModal;
  @ViewChild("errorModal", { static: false }) errorModal;

  constructor(
    private matricesService: MatricesService,
    private skillsService: SkillsService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.matricesService.getMyMatrices().subscribe(
      (myMatrices) => {
        this.myMatrices = myMatrices;
        console.log(myMatrices);

        this.myFilteredMatrices = this.myMatrices;
      },
      (errMsg) => {
        console.log(errMsg);
      }
    );
  }

  openFillMatrixModal(modalRef, myMatrix: UserMatrix): void {
    this.modalRef = this.modalService.open(modalRef, { size: "lg" });
    this.selectedMyMatrix = myMatrix;
    console.log(this.selectedMyMatrix);
  }

  searchKeywordChanged(term: string): void {
    this.myFilteredMatrices = this.myMatrices.filter(
      (matrix) =>
        matrix.skillsMatrix.title
          .toLocaleLowerCase()
          .indexOf(term.toLocaleLowerCase()) !== -1
    );
  }

  logForm(resultsForm: NgForm) {
    const formValue = resultsForm.form.value;
    let keys: string[] = Object.keys(formValue);
    let skillsWithoutUSKeys = keys.filter((key) => key.startsWith("noUS_"));
    let skillsWithUSKeys = keys.filter((key) => !key.startsWith("noUS_"));

    let skillsWithoutUSRatings: number[] = [];
    skillsWithoutUSKeys.forEach((key) => {
      skillsWithoutUSRatings.push(parseInt(formValue[key]));
    });
    console.log("skillsWithoutUSRatings: ", skillsWithoutUSRatings);

    const skillsWithUSIds: number[] = this.selectedMyMatrix.skillsMatrix.skills
      .filter((skill) => skill.underSkills.length > 0)
      .map((skill) => skill.id);

    let skillsWithUSRatings: number[][] = [];
    skillsWithUSIds.forEach((id) => {
      let oneSkillRatings: number[] = [];
      skillsWithUSKeys.forEach((key) => {
        if (key.startsWith(id.toString())) {
          oneSkillRatings.push(parseInt(formValue[key]));
        }
      });
      skillsWithUSRatings.push(oneSkillRatings);
    });
    console.log("skillsWithUSRatings: ", skillsWithUSRatings);

    let skillsWithUSAverageRatings: number[] = [];
    skillsWithUSRatings.forEach((skillRatings) => {
      skillsWithUSAverageRatings.push(
        parseFloat(
          (
            skillRatings.reduce((a: number, b: number) => a + b, 0) /
            skillRatings.length
          ).toFixed(2)
        )
      );
    });

    let allAverages: number[] = skillsWithoutUSRatings.concat(
      skillsWithUSAverageRatings
    );

    console.log("allAverages: ", allAverages);

    let collaboratorAverage: number = parseFloat(
      (
        allAverages.reduce((a: number, b: number) => a + b) / allAverages.length
      ).toFixed(2)
    );
    console.log(collaboratorAverage);
    this.matricesService
      .setRating(this.selectedMyMatrix.skillsMatrix, collaboratorAverage)
      .subscribe(
        (result) => {
          this.modalRef.close();
          this.notificationMessage =
            "Vous avez rempli votre matrice avec succès";
          this.modalRef = this.modalService.open(this.notificationModal, {
            size: "sm",
          });
          setTimeout(() => {
            this.modalRef.close();
            this.notificationMessage = "";
          }, 2000);
        },
        (errMsg) => {
          this.modalRef.close();
          this.errMsg = "Oops! Quelque chose a mal tourné.";
          this.modalRef = this.modalService.open(this.errorModal, {
            size: "sm",
          });
          setTimeout(() => {
            this.modalRef.close();
            this.errMsg = "";
          }, 2000);
        }
      );
  }
}
