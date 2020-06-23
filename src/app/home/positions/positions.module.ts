import { NgModule } from "@angular/core";
import { PositionsComponent } from "./positions.component";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

const routes: Routes = [{ path: "", component: PositionsComponent }];

@NgModule({
  declarations: [PositionsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ],
})
export class PositionsModule {}
