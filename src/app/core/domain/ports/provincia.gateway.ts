import { Observable } from 'rxjs';
import {
  Provincia,
  CreateProvinciaRequest,
  UpdateProvinciaRequest,
} from '../models/provincia.model';

export abstract class ProvinciaGateway {
  abstract getAllProvincias(): Observable<Provincia[]>;
  abstract getProvinciaById(id: number): Observable<Provincia>;
  abstract getProvinciasByRegion(regionId: number): Observable<Provincia[]>;
  abstract createProvincia(
    provincia: CreateProvinciaRequest
  ): Observable<Provincia>;
  abstract updateProvincia(
    provincia: UpdateProvinciaRequest
  ): Observable<Provincia>;
  abstract deleteProvincia(id: number): Observable<void>;
}
