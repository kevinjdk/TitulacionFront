import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RegionGateway } from '../ports/region.gateway';
import {
  Region,
  CreateRegionRequest,
  UpdateRegionRequest,
} from '../models/region.model';
import { REGION_GATEWAY } from '../tokens/gateway.tokens';

@Injectable()
export class RegionUseCase {
  constructor(@Inject(REGION_GATEWAY) private regionGateway: RegionGateway) {}

  getAllRegiones(): Observable<Region[]> {
    return this.regionGateway.getAllRegiones();
  }

  getRegionById(id: number): Observable<Region> {
    return this.regionGateway.getRegionById(id);
  }

  createRegion(region: CreateRegionRequest): Observable<Region> {
    return this.regionGateway.createRegion(region);
  }

  updateRegion(region: UpdateRegionRequest): Observable<Region> {
    return this.regionGateway.updateRegion(region);
  }

  deleteRegion(id: number): Observable<void> {
    return this.regionGateway.deleteRegion(id);
  }
}
