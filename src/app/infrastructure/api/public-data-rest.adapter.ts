import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PublicDataGateway } from '../../core/domain/ports/public-data.gateway';
import { Categoria } from '../../core/domain/models/categoria.model';
import { Region } from '../../core/domain/models/region.model';
import { Provincia } from '../../core/domain/models/provincia.model';
import { environment } from '../../../enviroments/environment';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class PublicDataRestAdapter implements PublicDataGateway {
  private apiUrl = environment.backendUrl + '/api';

  constructor(private http: HttpClient) {}

  getAllCategorias(): Observable<Categoria[]> {
    return this.http
      .get<ApiResponse<Categoria[]>>(`${this.apiUrl}/categorias`)
      .pipe(map((response) => response.data));
  }

  getAllRegiones(): Observable<Region[]> {
    return this.http
      .get<ApiResponse<Region[]>>(`${this.apiUrl}/regiones`)
      .pipe(map((response) => response.data));
  }

  getAllProvincias(): Observable<Provincia[]> {
    return this.http
      .get<ApiResponse<Provincia[]>>(`${this.apiUrl}/provincias`)
      .pipe(map((response) => response.data));
  }

  getProvinciasByRegion(regionId: number): Observable<Provincia[]> {
    return this.http
      .get<ApiResponse<Provincia[]>>(`${this.apiUrl}/regiones/${regionId}/provincias`)
      .pipe(map((response) => response.data));
  }
}