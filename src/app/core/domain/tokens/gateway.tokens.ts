import { InjectionToken } from '@angular/core';
import { CategoriaGateway } from '../ports/categoria.gateway';
import { RegionGateway } from '../ports/region.gateway';
import { ProvinciaGateway } from '../ports/provincia.gateway';
import { PlatoGateway } from '../ports/plato.gateway';
import { PublicPlatoGateway } from '../ports/public-plato.gateway';
import { PublicDataGateway } from '../ports/public-data.gateway';

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

// Nuevos tokens para la parte pública
export const PUBLIC_PLATO_GATEWAY = new InjectionToken<PublicPlatoGateway>(
  'PublicPlatoGateway'
);
export const PUBLIC_DATA_GATEWAY = new InjectionToken<PublicDataGateway>(
  'PublicDataGateway'
);