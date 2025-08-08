import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { AuthGuard } from '../core/guards/auth.guard';

// Auth Components
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

// Categoria Components
import { CategoriaListComponent } from './categorias/categoria-list/categoria-list.component';

// Region Components
import { RegionListComponent } from './regiones/region-list/region-list.component';

// Provincia Components
import { ProvinciaListComponent } from './provincias/provincia-list/provincia-list.component';

// Plato Components
import { PlatoListComponent } from './platos/plato-list/plato-list.component';

const routes: Routes = [
  {
    path: 'auth/login',
    component: LoginComponent,
  },
  {
    path: 'auth/register',
    component: RegisterComponent,
  },
  {
    path: 'dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'categorias',
    canActivate: [AuthGuard],
    children: [{ path: '', component: CategoriaListComponent }],
  },
  {
    path: 'regiones',
    canActivate: [AuthGuard],
    children: [{ path: '', component: RegionListComponent }],
  },
  {
    path: 'provincias',
    canActivate: [AuthGuard],
    children: [{ path: '', component: ProvinciaListComponent }],
  },
  {
    path: 'platos',
    canActivate: [AuthGuard],
    children: [{ path: '', component: PlatoListComponent }],
  },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
