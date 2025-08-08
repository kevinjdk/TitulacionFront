import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria.model';
import { Region } from '../models/region.model';
import { Provincia } from '../models/provincia.model';

export abstract class PublicDataGateway {
  abstract getAllCategorias(): Observable<Categoria[]>;
  abstract getAllRegiones(): Observable<Region[]>;
  abstract getAllProvincias(): Observable<Provincia[]>;
  abstract getProvinciasByRegion(regionId: number): Observable<Provincia[]>;
}