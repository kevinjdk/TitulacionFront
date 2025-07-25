import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlatoGateway } from '../../core/domain/ports/plato.gateway';
import {
  Plato,
  CreatePlatoRequest,
  UpdatePlatoRequest,
} from '../../core/domain/models/plato.model';
import { environment } from '../../../enviroments/environment';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class PlatoRestAdapter implements PlatoGateway {
  private apiUrl = environment.backendUrl + '/api/platos';

  constructor(private http: HttpClient) {}

  getAllPlatos(): Observable<Plato[]> {
    return this.http
      .get<ApiResponse<Plato[]>>(this.apiUrl)
      .pipe(map((response) => response.data));
  }

  getPlatoById(id: number): Observable<Plato> {
    return this.http
      .get<ApiResponse<Plato>>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  createPlato(plato: CreatePlatoRequest): Observable<Plato> {
    return this.http
      .post<ApiResponse<Plato>>(this.apiUrl, plato)
      .pipe(map((response) => response.data));
  }

  updatePlato(plato: UpdatePlatoRequest): Observable<Plato> {
    return this.http
      .put<ApiResponse<Plato>>(`${this.apiUrl}/${plato.id}`, plato)
      .pipe(map((response) => response.data));
  }

  deletePlato(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(map(() => void 0));
  }

  searchPlatosByNombre(nombre: string): Observable<Plato[]> {
    const params = new HttpParams().set('nombre', nombre);
    return this.http
      .get<ApiResponse<Plato[]>>(`${this.apiUrl}/search`, { params })
      .pipe(map((response) => response.data));
  }
}
