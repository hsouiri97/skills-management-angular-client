import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MyMatricesComponent } from "./my-matrices.component";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

const routes: Routes = [{ path: "", component: MyMatricesComponent }];

@NgModule({
  declarations: [MyMatricesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgbModule,
  ],
})
export class MyMatricesModule {}
