import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SkillsComponent } from "./skills/skills.component";
import { MatricesComponent } from "./matrices/matrices.component";
import { UserSearchComponent } from "../../shared/user-search/user-search.component";

const routes: Routes = [
  { path: "matrices", component: MatricesComponent },
  { path: "skills", component: SkillsComponent },
];

@NgModule({
  declarations: [SkillsComponent, MatricesComponent, UserSearchComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ],
})
export class SkillsAndMatricesModule {}
