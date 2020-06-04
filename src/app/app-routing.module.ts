import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./home/dashboard/dashboard.component";
import { AuthGuard } from "./guards/auth.guard";
import { NotFoundComponent } from "./not-found/not-found.component";

const routes: Routes = [
  { path: "", redirectTo: "home/dashboard", pathMatch: "full" },
  {
    path: "home/dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "index",
    loadChildren: () =>
      import("./index/index.module").then((m) => m.LoginModule),
  },
  {
    path: "home/profile",
    loadChildren: () =>
      import("./home/profile/profile.module").then((m) => m.ProfileModule),
    canActivate: [AuthGuard],
  },
  {
    path: "basic-ui",
    loadChildren: () =>
      import("./basic-ui/basic-ui.module").then((m) => m.BasicUiModule),
  },
  {
    path: "charts",
    loadChildren: () =>
      import("./charts/charts.module").then((m) => m.ChartsDemoModule),
  },
  {
    path: "forms",
    loadChildren: () => import("./forms/form.module").then((m) => m.FormModule),
  },
  {
    path: "tables",
    loadChildren: () =>
      import("./tables/tables.module").then((m) => m.TablesModule),
  },
  {
    path: "icons",
    loadChildren: () =>
      import("./icons/icons.module").then((m) => m.IconsModule),
  },
  {
    path: "general-pages",
    loadChildren: () =>
      import("./general-pages/general-pages.module").then(
        (m) => m.GeneralPagesModule
      ),
  },
  {
    path: "apps",
    loadChildren: () => import("./apps/apps.module").then((m) => m.AppsModule),
  },
  {
    path: "user-pages",
    loadChildren: () =>
      import("./user-pages/user-pages.module").then((m) => m.UserPagesModule),
  },
  {
    path: "error-pages",
    loadChildren: () =>
      import("./error-pages/error-pages.module").then(
        (m) => m.ErrorPagesModule
      ),
  },
  {
    path: "**",
    redirectTo: "/error-pages/404",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
