import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DepartmentsComponent } from "./departments.component";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [{ path: "", component: DepartmentsComponent }];

@NgModule({
  declarations: [DepartmentsComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class DepartmentsModule {}
