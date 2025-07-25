import { Categoria } from './categoria.model';
import { Region } from './region.model';
import { Provincia } from './provincia.model';

export interface Plato {
  id: number;
  nombre: string;
  descripcion: string;
  ingredientes: string;
  preparacion: string[];
  porciones: number;
  imageUrl?: string;
  categoria: Categoria;
  region: Region;
  provincia: Provincia;
}

export interface CreatePlatoRequest {
  nombre: string;
  descripcion: string;
  ingredientes: string;
  preparacion: string[];
  porciones: number;
  imageUrl?: string;
  categoriaId: number;
  regionId: number;
  provinciaId: number;
}

export interface UpdatePlatoRequest {
  id: number;
  nombre: string;
  descripcion: string;
  ingredientes: string;
  preparacion: string[];
  porciones: number;
  imageUrl?: string;
  categoriaId: number;
  regionId: number;
  provinciaId: number;
}
