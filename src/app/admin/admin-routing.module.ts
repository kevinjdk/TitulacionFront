import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { AuthGuard } from '../core/guards/auth.guard';

// Categoria Components
import { CategoriaListComponent } from './categorias/categoria-list/categoria-list.component';
import { CategoriaFormComponent } from './categorias/categoria-form/categoria-form.component';

// Region Components
import { RegionListComponent } from './regiones/region-list/region-list.component';
import { RegionFormComponent } from './regiones/region-form/region-form.component';

// Provincia Components
import { ProvinciaListComponent } from './provincias/provincia-list/provincia-list.component';
import { ProvinciaFormComponent } from './provincias/provincia-form/provincia-form.component';

// Plato Components
import { PlatoListComponent } from './platos/plato-list/plato-list.component';
import { PlatoFormComponent } from './platos/plato-form/plato-form.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'categorias',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: CategoriaListComponent },
      { path: 'new', component: CategoriaFormComponent },
      { path: 'edit/:id', component: CategoriaFormComponent },
    ],
  },
  {
    path: 'regiones',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: RegionListComponent },
      { path: 'new', component: RegionFormComponent },
      { path: 'edit/:id', component: RegionFormComponent },
    ],
  },
  {
    path: 'provincias',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: ProvinciaListComponent },
      { path: 'new', component: ProvinciaFormComponent },
      { path: 'edit/:id', component: ProvinciaFormComponent },
    ],
  },
  {
    path: 'platos',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: PlatoListComponent },
      { path: 'new', component: PlatoFormComponent },
      { path: 'edit/:id', component: PlatoFormComponent },
    ],
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
