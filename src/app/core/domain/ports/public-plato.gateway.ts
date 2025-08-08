import { Observable } from 'rxjs';
import { Plato } from '../models/plato.model';

export interface PlatosFilter {
  regiones?: number[];
  provincias?: number[];
  categorias?: number[];
  search?: string;
  page?: number;
  size?: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export abstract class PublicPlatoGateway {
  abstract getAllPlatosPublic(filter?: PlatosFilter): Observable<PaginatedResponse<Plato>>;
  abstract getPlatoByIdPublic(id: number): Observable<Plato>;
  abstract searchPlatos(query: string): Observable<Plato[]>;
  abstract getPlatosByCategoria(categoriaId: number): Observable<Plato[]>;
  abstract getPlatosByRegion(regionId: number): Observable<Plato[]>;
  abstract getPlatosByProvincia(provinciaId: number): Observable<Plato[]>;
}