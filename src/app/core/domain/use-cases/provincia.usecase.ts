import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProvinciaGateway } from '../ports/provincia.gateway';
import {
  Provincia,
  CreateProvinciaRequest,
  UpdateProvinciaRequest,
} from '../models/provincia.model';
import { PROVINCIA_GATEWAY } from '../tokens/gateway.tokens';

@Injectable()
export class ProvinciaUseCase {
  constructor(
    @Inject(PROVINCIA_GATEWAY) private provinciaGateway: ProvinciaGateway
  ) {}

  getAllProvincias(): Observable<Provincia[]> {
    return this.provinciaGateway.getAllProvincias();
  }

  getProvinciaById(id: number): Observable<Provincia> {
    return this.provinciaGateway.getProvinciaById(id);
  }

  getProvinciasByRegion(regionId: number): Observable<Provincia[]> {
    return this.provinciaGateway.getProvinciasByRegion(regionId);
  }

  createProvincia(provincia: CreateProvinciaRequest): Observable<Provincia> {
    return this.provinciaGateway.createProvincia(provincia);
  }

  updateProvincia(provincia: UpdateProvinciaRequest): Observable<Provincia> {
    return this.provinciaGateway.updateProvincia(provincia);
  }

  deleteProvincia(id: number): Observable<void> {
    return this.provinciaGateway.deleteProvincia(id);
  }
}
