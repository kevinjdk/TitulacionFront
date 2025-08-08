import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RecetasComponent } from './recetas/recetas.component';
import { RecetaDetalleComponent } from './receta-detalle/receta-detalle.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { PublicLayoutComponent } from './shared/public-layout/public-layout.component';

const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: 'inicio', component: HomeComponent },
      { path: 'recetas', component: RecetasComponent },
      { path: 'receta/:id', component: RecetaDetalleComponent },
      { path: 'nosotros', component: NosotrosComponent },
      { path: '', redirectTo: 'inicio', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }