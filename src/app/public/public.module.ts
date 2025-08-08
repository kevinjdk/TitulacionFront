import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PublicRoutingModule } from './public-routing.module';
import { HomeComponent } from './home/home.component';
import { RecetasComponent } from './recetas/recetas.component';
import { RecetaDetalleComponent } from './receta-detalle/receta-detalle.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { PublicLayoutComponent } from './shared/public-layout/public-layout.component';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ChipModule } from 'primeng/chip';
import { SkeletonModule } from 'primeng/skeleton';
import { ImageModule } from 'primeng/image';
import { MenubarModule } from 'primeng/menubar';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';


// Gateways and Adapters
import { PublicPlatoGateway } from '../core/domain/ports/public-plato.gateway';
import { PublicDataGateway } from '../core/domain/ports/public-data.gateway';
import { PublicPlatoRestAdapter } from '../infrastructure/api/public-plato-rest.adapter';
import { PublicDataRestAdapter } from '../infrastructure/api/public-data-rest.adapter';

// Use Cases
import { PublicPlatoUseCase } from '../core/domain/use-cases/public-plato.usecase';
import { PublicDataUseCase } from '../core/domain/use-cases/public-data.usecase';

// Gateway Tokens
import {
  PUBLIC_PLATO_GATEWAY,
  PUBLIC_DATA_GATEWAY,
} from '../core/domain/tokens/gateway.tokens';

@NgModule({
  declarations: [
    HomeComponent,
    RecetasComponent,
    RecetaDetalleComponent,
    NosotrosComponent,
    HeaderComponent,
    FooterComponent,
    PublicLayoutComponent
    
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    // PrimeNG
    ButtonModule,
    InputTextModule,
    CardModule,
    CarouselModule,
    DropdownModule,
    MultiSelectModule,
    PaginatorModule,
    TagModule,
    DividerModule,
    ChipModule,
    SkeletonModule,
    ImageModule,
    MenubarModule,
    TooltipModule,
    ToastModule
  ],
  providers: [
    // REST Adapters
    PublicPlatoRestAdapter,
    PublicDataRestAdapter,
    MessageService,

    // Gateway Token Providers
    { provide: PUBLIC_PLATO_GATEWAY, useClass: PublicPlatoRestAdapter },
    { provide: PUBLIC_DATA_GATEWAY, useClass: PublicDataRestAdapter },

    // Use Cases
    PublicPlatoUseCase,
    PublicDataUseCase,
  ]
})
export class PublicModule { }