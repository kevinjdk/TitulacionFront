import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CategoriaGateway } from '../../core/domain/ports/categoria.gateway';
import {
  Categoria,
  CreateCategoriaRequest,
  UpdateCategoriaRequest,
} from '../../core/domain/models/categoria.model';
import { environment } from '../../../enviroments/environment';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class CategoriaRestAdapter implements CategoriaGateway {
  private apiUrl = environment.backendUrl + '/api/categorias';

  constructor(private http: HttpClient) {}

  getAllCategorias(): Observable<Categoria[]> {
    return this.http
      .get<ApiResponse<Categoria[]>>(this.apiUrl)
      .pipe(map((response) => response.data));
  }

  getCategoriaById(id: number): Observable<Categoria> {
    return this.http
      .get<ApiResponse<Categoria>>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  createCategoria(categoria: CreateCategoriaRequest): Observable<Categoria> {
    return this.http
      .post<ApiResponse<Categoria>>(this.apiUrl, categoria)
      .pipe(map((response) => response.data));
  }

  updateCategoria(categoria: UpdateCategoriaRequest): Observable<Categoria> {
    return this.http
      .put<ApiResponse<Categoria>>(`${this.apiUrl}/${categoria.id}`, categoria)
      .pipe(map((response) => response.data));
  }

  deleteCategoria(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(map(() => void 0));
  }
}
