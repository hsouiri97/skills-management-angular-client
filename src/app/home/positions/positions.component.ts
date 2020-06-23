import { Component, OnInit } from "@angular/core";
import { PositionService } from "../../services/position.service";
import { DepartmentService } from "../../services/department.service";
import { Position } from "src/app/shared/models/position";
import { Department } from "src/app/shared/models/department";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-positions",
  templateUrl: "./positions.component.html",
  styleUrls: ["./positions.component.scss"],
})
export class PositionsComponent implements OnInit {
  position: Position;
  positionCopy: Position;
  positions: Position[];
  positionsCopy: Position[];
  filteredPositions: Position[];
  positionForm: FormGroup;
  errMsg: string;
  namePosition: string;

  departments: Department[];
  departmentCopy: Department[];
  d: Department;

  constructor(
    private positionService: PositionService,
    private departmentService: DepartmentService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {}

  formErrors = {
    name: "",
    departmentId: "",
  };

  validationMessages = {
    name: {
      required: "Le nom du Poste est obligatoire.",
      maxlength: "Le nom peut comporter au maximum 50 caractères.",
    },
    departmentId: {
      required: "Le département est obligatoire.",
    },
  };

  getPositions() {
    this.positionService.getPositions().subscribe((p) => {
      this.positions = p;
      this.positionsCopy = { ...this.positions };
      this.filteredPositions = this.positions;
      console.log(this.positionsCopy);
    });
  }

  getDepartments() {
    this.departmentService.getDepartments().subscribe((p) => {
      this.departments = p;
      this.departmentCopy = { ...this.departments };
      console.log(this.departmentCopy);
    });
  }

  addPosition() {
    this.positionService.addProject(this.positionForm.value).subscribe(
      (project) => {
        //this.positions.push(this.positionForm.value);
        this.filteredPositions = this.positions;
        this.getPositions();
        console.log(project);
        console.log(this.positionForm.value);
      },
      (errMsg) => {
        this.errMsg = <any>errMsg;
        console.log(this.errMsg);
        console.log(this.positionForm.value);
      }
    );
  }

  updatePosition(position: Position) {
    this.positionCopy = position;
    this.positionService.updatePosition(position).subscribe(
      (position) => {
        this.positionCopy.name = this.positionForm.value.name;
        this.positionCopy.departmentId = this.positionForm.value.departmentId;
        //this.positions.push(this.positionCopy);
        this.getPositions();
        console.log(position);
      },
      (errMsg) => {
        this.errMsg = <any>errMsg;
        console.log(this.errMsg);
      }
    );
  }

  deletePosition(position): void {
    this.positionService.deletePosition(position).subscribe(
      (p) => {
        console.log(this.positionForm);
        const index = this.positions.indexOf(position);

        if (index > -1) {
          this.positions.splice(index, 1);
        }
      },
      (errMsg) => {
        this.errMsg = <any>errMsg;
        console.log(this.errMsg);
      }
    );
  }

  createPositionForm(): void {
    this.positionForm = this.formBuilder.group({
      name: ["", [Validators.required, Validators.maxLength(50)]],
      departmentId: ["", [Validators.required]],
    });

    this.positionForm.valueChanges.subscribe(() => {
      this.onValueChanged();
    });

    this.onValueChanged();
  }

  searchKeywordChanged(term: string): void {
    this.filteredPositions = this.positions.filter((p) => {
      if (p.name.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) !== -1) {
        return p;
      }
    });
  }

  onValueChanged() {
    if (!this.positionForm) {
      return;
    }

    const form = this.positionForm;
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

  openAddModal(mediumModalContent) {
    this.modalService.open(mediumModalContent);
  }

  openUpdateModal(mediumModalContent, position) {
    this.modalService.open(mediumModalContent);
    this.position = position;
    console.log(this.position);
  }

  openRemoveModal(smallModalContent, position) {
    this.modalService.open(smallModalContent, { size: "sm" });
    this.position = position;
    console.log(this.position);
  }

  ngOnInit() {
    this.getPositions();
    this.getDepartments();
    this.createPositionForm();
  }
}
