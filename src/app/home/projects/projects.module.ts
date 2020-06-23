import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProjectsComponent } from "./projects.component";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { DatePipe } from "@angular/common";

const routes: Routes = [{ path: "", component: ProjectsComponent }];

@NgModule({
  declarations: [ProjectsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbDatepickerModule,
  ],
  providers: [DatePipe],
})
export class ProjectsModule {}
