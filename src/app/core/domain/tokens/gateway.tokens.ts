import { InjectionToken } from '@angular/core';
import { CategoriaGateway } from '../ports/categoria.gateway';
import { RegionGateway } from '../ports/region.gateway';
import { ProvinciaGateway } from '../ports/provincia.gateway';
import { PlatoGateway } from '../ports/plato.gateway';

export const CATEGORIA_GATEWAY = new InjectionToken<CategoriaGateway>(
  'CategoriaGateway'
);
export const REGION_GATEWAY = new InjectionToken<RegionGateway>(
  'RegionGateway'
);
export const PROVINCIA_GATEWAY = new InjectionToken<ProvinciaGateway>(
  'ProvinciaGateway'
);
export const PLATO_GATEWAY = new InjectionToken<PlatoGateway>('PlatoGateway');
