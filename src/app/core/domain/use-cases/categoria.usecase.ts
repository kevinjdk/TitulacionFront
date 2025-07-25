import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoriaGateway } from '../ports/categoria.gateway';
import {
  Categoria,
  CreateCategoriaRequest,
  UpdateCategoriaRequest,
} from '../models/categoria.model';
import { CATEGORIA_GATEWAY } from '../tokens/gateway.tokens';

@Injectable()
export class CategoriaUseCase {
  constructor(
    @Inject(CATEGORIA_GATEWAY) private categoriaGateway: CategoriaGateway
  ) {}

  getAllCategorias(): Observable<Categoria[]> {
    return this.categoriaGateway.getAllCategorias();
  }

  getCategoriaById(id: number): Observable<Categoria> {
    return this.categoriaGateway.getCategoriaById(id);
  }

  createCategoria(categoria: CreateCategoriaRequest): Observable<Categoria> {
    return this.categoriaGateway.createCategoria(categoria);
  }

  updateCategoria(categoria: UpdateCategoriaRequest): Observable<Categoria> {
    return this.categoriaGateway.updateCategoria(categoria);
  }

  deleteCategoria(id: number): Observable<void> {
    return this.categoriaGateway.deleteCategoria(id);
  }
}
