import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SkillsComponent } from "./skills/skills.component";
import { MatricesComponent } from "./matrices/matrices.component";
import { UserSearchComponent } from "../../shared/user-search/user-search.component";
import { ResultsComponent } from "./results/results.component";

const routes: Routes = [
  { path: "matrices", component: MatricesComponent },
  { path: "skills", component: SkillsComponent },
  { path: "results", component: ResultsComponent },
];

@NgModule({
  declarations: [
    SkillsComponent,
    MatricesComponent,
    UserSearchComponent,
    ResultsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ],
})
export class SkillsAndMatricesModule {}
