import { Provincia } from './provincia.model';

export interface Region {
  id: number;
  nombre: string;
  provincias?: Provincia[];
}

export interface CreateRegionRequest {
  nombre: string;
}

export interface UpdateRegionRequest {
  id: number;
  nombre: string;
}
