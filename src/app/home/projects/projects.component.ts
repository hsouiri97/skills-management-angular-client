import { Component, OnInit, ViewChild } from "@angular/core";
import { Project } from "../../shared/models/project";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { ProjectService } from "../../services/project.service";
import { NgbModal, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-projects",
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.scss"],
})
export class ProjectsComponent implements OnInit {
  project: Project;
  projectCopy: Project;
  projects: Project[];
  projectsCopy: Project[];
  projectsC: Project[];
  filteredProjects: Project[];
  projectForm: FormGroup;
  errMsg: string;
  nameProject: string;
  dd: String;
  df: Date;

  constructor(
    private projectService: ProjectService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) {}

  formErrors = {
    title: "",
    startDate: "",
    expectedEndDate: "",
  };

  validationMessages = {
    title: {
      required: "Le titre du Projet est obligatoire.",
      maxlength: "Le titre peut comporter au maximum 50 caractères.",
    },
    startDate: {
      required: "La date de début du Projet est obligatoire.",
      pattern: "Veuillez saisir une date valide.",
    },
    expectedEndDate: {
      required: "La date de fin prévue du Projet est obligatoire.",
      pattern: "Veuillez saisir une date valide.",
    },
  };

  addProject() {
    const formValue = { ...this.projectForm.value };
    this.dateToString(formValue);
    this.projectCopy.title = this.projectForm.value.title;

    this.projectService.addProject(this.projectCopy).subscribe(
      (p) => {
        this.project = p;
        this.project.startDate = this.formatDate(this.project.startDate);
        this.project.expectedEndDate = this.formatDate(
          this.project.expectedEndDate
        );
        this.projects.push(this.project);
        this.filteredProjects = this.projects;
        this.projectForm.reset();
        this.getProjects();
        // console.log(p);
      },
      (errMsg) => {
        this.errMsg = <any>errMsg;
        console.log(this.errMsg);
        console.log(this.projectCopy);
      }
    );
  }

  updateProject(project: Project) {
    this.projectCopy = project;
    const formValue = { ...project };
    this.dateToString(formValue);

    this.projectService.updateProject(this.projectCopy).subscribe(
      (project) => {
        // const index = this.projects.indexOf(this.project);
        // if (index > -1) {
        //   this.projects.splice(index, 1);
        // }
        // this.project = project;
        // this.project.startDate = this.formatDate(project.startDate);
        // this.project.expectedEndDate = this.formatDate(project.expectedEndDate);
        // this.projectCopy = { ...this.project };
        // this.projects.push(this.projectCopy);
        // this.filteredProjects = this.projects;

        this.getProjects();
        console.log(project);
      },
      (errMsg) => {
        this.errMsg = <any>errMsg;
        console.log(this.errMsg);
        console.log(this.projectCopy);
      }
    );
  }

  private dateToString(formValue: any) {
    this.projectCopy = formValue;
    if (
      formValue.startDate &&
      formValue.startDate.year &&
      formValue.startDate.month &&
      formValue.startDate.day
    ) {
      this.projectCopy.startDate =
        formValue.startDate.year +
        "-" +
        (formValue.startDate.month.toString().length === 1 ? "0" : "") +
        formValue.startDate.month +
        "-" +
        (formValue.startDate.day.toString().length === 1 ? "0" : "") +
        formValue.startDate.day;
    }
    if (
      formValue.expectedEndDate &&
      formValue.expectedEndDate.year &&
      formValue.expectedEndDate.month &&
      formValue.expectedEndDate.day
    ) {
      this.projectCopy.expectedEndDate =
        formValue.expectedEndDate.year +
        "-" +
        (formValue.expectedEndDate.month.toString().length === 1 ? "0" : "") +
        formValue.expectedEndDate.month +
        "-" +
        (formValue.expectedEndDate.day.toString().length === 1 ? "0" : "") +
        formValue.expectedEndDate.day;
    }
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
  // getProjects(){
  //   this.projectService.getProjects().subscribe(
  //     (p) => {
  //       this.projects = p;
  //       this.projectsCopy = { ...this.projects};
  //       this.projectsCopy.forEach((project) => {
  //                 const formValue = { ...project };
  //                 this.dateToString(formValue);
  //                 project.title = project.title;
  //                 project.startDate = this.projectCopy.startDate;
  //                 project.expectedEndDate = this.projectCopy.expectedEndDate;
  //               });
  //       console.log(this.projectsCopy);
  //     },
  //     (errMsg) => {
  //       (this.errMsg = <any>errMsg);
  //       console.log(this.errMsg);
  //     }
  //   )
  // }

  getProjects() {
    this.projectService.getProjects().subscribe(
      (projects) => {
        this.projects = projects;
        this.projects.forEach((p) => {
          const formValue = { ...p };
          this.dateToString(formValue);
          this.projectCopy.title = p.title;
          p;
        });
        this.filteredProjects = this.projects;
        this.createProjectForm();
      },
      (errMsg) => {
        this.errMsg = <any>errMsg;
        console.log(this.errMsg);
      }
    );
  }

  deleteProject(project: Project) {
    this.projectService.deleteProject(project).subscribe(
      (p) => {
        console.log(p);
        const index = this.projects.indexOf(project);

        if (index > -1) {
          this.projects.splice(index, 1);
        }
      },
      (errMsg) => {
        this.errMsg = <any>errMsg;
        console.log(this.errMsg);
      }
    );
  }

  openAddModal(mediumModalContent) {
    this.modalService.open(mediumModalContent);
    this.projectCopy = new Project();
  }

  openUpdateModal(mediumModalContent, project) {
    this.modalService.open(mediumModalContent);
    this.projectCopy = project;
    this.projectCopy.startDate = this.formatDate(project.startDate);
    this.projectCopy.expectedEndDate = this.formatDate(project.expectedEndDate);
    console.log(this.projectCopy);
  }

  openRemoveModal(smallModalContent, project) {
    this.modalService.open(smallModalContent, { size: "sm" });
    this.project = project;
    console.log(this.project);
  }

  createProjectForm(): void {
    this.projectForm = this.formBuilder.group({
      title: ["", [Validators.required, Validators.maxLength(50)]],
      startDate: ["", [Validators.required]],
      expectedEndDate: ["", [Validators.required]],
    });

    this.projectForm.valueChanges.subscribe(() => {
      this.onValueChanged();
    });

    this.onValueChanged();
  }

  onValueChanged() {
    if (!this.projectForm) {
      return;
    }

    const form = this.projectForm;
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

  searchKeywordChanged(term: string): void {
    this.filteredProjects = this.projects.filter((p) => {
      if (
        p.title.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) !== -1
      ) {
        return p;
      }
    });
  }

  ngOnInit() {
    this.getProjects();
  }
}
