import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PublicDataGateway } from '../ports/public-data.gateway';
import { Categoria } from '../models/categoria.model';
import { Region } from '../models/region.model';
import { Provincia } from '../models/provincia.model';

import { PUBLIC_DATA_GATEWAY } from '../tokens/gateway.tokens';

@Injectable()
export class PublicDataUseCase {
  constructor(
    @Inject(PUBLIC_DATA_GATEWAY) private publicDataGateway: PublicDataGateway
  ) {}

  getAllCategorias(): Observable<Categoria[]> {
    return this.publicDataGateway.getAllCategorias();
  }

  getAllRegiones(): Observable<Region[]> {
    return this.publicDataGateway.getAllRegiones();
  }

  getAllProvincias(): Observable<Provincia[]> {
    return this.publicDataGateway.getAllProvincias();
  }

  getProvinciasByRegion(regionId: number): Observable<Provincia[]> {
    return this.publicDataGateway.getProvinciasByRegion(regionId);
  }
}