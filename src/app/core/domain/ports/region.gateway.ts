import { Observable } from 'rxjs';
import {
  Region,
  CreateRegionRequest,
  UpdateRegionRequest,
} from '../models/region.model';

export abstract class RegionGateway {
  abstract getAllRegiones(): Observable<Region[]>;
  abstract getRegionById(id: number): Observable<Region>;
  abstract createRegion(region: CreateRegionRequest): Observable<Region>;
  abstract updateRegion(region: UpdateRegionRequest): Observable<Region>;
  abstract deleteRegion(id: number): Observable<void>;
}
