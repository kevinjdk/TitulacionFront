import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { PanelModule } from 'primeng/panel';

// Components
import { AdminLayoutComponent } from './shared/admin-layout/admin-layout.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { CategoriaListComponent } from './categorias/categoria-list/categoria-list.component';
import { RegionListComponent } from './regiones/region-list/region-list.component';
import { ProvinciaListComponent } from './provincias/provincia-list/provincia-list.component';
import { PlatoListComponent } from './platos/plato-list/plato-list.component';

// Gateways and Services
import { CategoriaGateway } from '../core/domain/ports/categoria.gateway';
import { RegionGateway } from '../core/domain/ports/region.gateway';
import { ProvinciaGateway } from '../core/domain/ports/provincia.gateway';
import { PlatoGateway } from '../core/domain/ports/plato.gateway';
import { CategoriaRestAdapter } from '../infrastructure/api/categoria-rest.adapter';
import {
  RegionRestAdapter,
  ProvinciaRestAdapter,
} from '../infrastructure/api/region-rest.adapter';
import { PlatoRestAdapter } from '../infrastructure/api/plato-rest.adapter';

// Use Cases
import { CategoriaUseCase } from '../core/domain/use-cases/categoria.usecase';
import { RegionUseCase } from '../core/domain/use-cases/region.usecase';
import { ProvinciaUseCase } from '../core/domain/use-cases/provincia.usecase';
import { PlatoUseCase } from '../core/domain/use-cases/plato.usecase';

// Gateway Tokens
import {
  CATEGORIA_GATEWAY,
  REGION_GATEWAY,
  PROVINCIA_GATEWAY,
  PLATO_GATEWAY,
} from '../core/domain/tokens/gateway.tokens';

// PrimeNG Services
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminLayoutComponent,
    LoginComponent,
    RegisterComponent,
    CategoriaListComponent,
    RegionListComponent,
    ProvinciaListComponent,
    PlatoListComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    TableModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    DropdownModule,
    InputNumberModule,
    TagModule,
    ChipModule,
    ToolbarModule,
    SplitButtonModule,
    PanelModule,
  ],
  providers: [
    // REST Adapters
    CategoriaRestAdapter,
    RegionRestAdapter,
    ProvinciaRestAdapter,
    PlatoRestAdapter,

    // Gateway Token Providers
    { provide: CATEGORIA_GATEWAY, useClass: CategoriaRestAdapter },
    { provide: REGION_GATEWAY, useClass: RegionRestAdapter },
    { provide: PROVINCIA_GATEWAY, useClass: ProvinciaRestAdapter },
    { provide: PLATO_GATEWAY, useClass: PlatoRestAdapter },

    // Use Cases
    CategoriaUseCase,
    RegionUseCase,
    ProvinciaUseCase,
    PlatoUseCase,

    // PrimeNG Services
    MessageService,
    ConfirmationService,
  ],
})
export class AdminModule {}
