import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UsersManagementComponent } from "./users-management.component";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap";

const routes: Routes = [{ path: "", component: UsersManagementComponent }];

@NgModule({
  declarations: [UsersManagementComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
  ],
})
export class UsersManagementModule {}
