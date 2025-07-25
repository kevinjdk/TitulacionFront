import { Region } from './region.model';

export interface Provincia {
  id: number;
  nombre: string;
  regionId: number;
  region?: Region;
}

export interface CreateProvinciaRequest {
  nombre: string;
  regionId: number;
}

export interface UpdateProvinciaRequest {
  id: number;
  nombre: string;
  regionId: number;
}
