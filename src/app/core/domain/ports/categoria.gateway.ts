import { Observable } from 'rxjs';
import {
  Categoria,
  CreateCategoriaRequest,
  UpdateCategoriaRequest,
} from '../models/categoria.model';

export abstract class CategoriaGateway {
  abstract getAllCategorias(): Observable<Categoria[]>;
  abstract getCategoriaById(id: number): Observable<Categoria>;
  abstract createCategoria(
    categoria: CreateCategoriaRequest
  ): Observable<Categoria>;
  abstract updateCategoria(
    categoria: UpdateCategoriaRequest
  ): Observable<Categoria>;
  abstract deleteCategoria(id: number): Observable<void>;
}
