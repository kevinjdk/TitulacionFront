import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RegionGateway } from '../../core/domain/ports/region.gateway';
import { ProvinciaGateway } from '../../core/domain/ports/provincia.gateway';
import {
  Region,
  CreateRegionRequest,
  UpdateRegionRequest,
} from '../../core/domain/models/region.model';
import {
  Provincia,
  CreateProvinciaRequest,
  UpdateProvinciaRequest,
} from '../../core/domain/models/provincia.model';
import { environment } from '../../../enviroments/environment';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class RegionRestAdapter implements RegionGateway {
  private apiUrl = environment.backendUrl + '/api/regiones';

  constructor(private http: HttpClient) {}

  getAllRegiones(): Observable<Region[]> {
    return this.http
      .get<ApiResponse<Region[]>>(this.apiUrl)
      .pipe(map((response) => response.data));
  }

  getRegionById(id: number): Observable<Region> {
    return this.http
      .get<ApiResponse<Region>>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  createRegion(region: CreateRegionRequest): Observable<Region> {
    return this.http
      .post<ApiResponse<Region>>(this.apiUrl, region)
      .pipe(map((response) => response.data));
  }

  updateRegion(region: UpdateRegionRequest): Observable<Region> {
    return this.http
      .put<ApiResponse<Region>>(`${this.apiUrl}/${region.id}`, region)
      .pipe(map((response) => response.data));
  }

  deleteRegion(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(map(() => void 0));
  }
}

@Injectable({
  providedIn: 'root',
})
export class ProvinciaRestAdapter implements ProvinciaGateway {
  private apiUrl = environment.backendUrl + '/api/provincias';

  constructor(private http: HttpClient) {}

  getAllProvincias(): Observable<Provincia[]> {
    return this.http
      .get<ApiResponse<Provincia[]>>(this.apiUrl)
      .pipe(map((response) => response.data));
  }

  getProvinciaById(id: number): Observable<Provincia> {
    return this.http
      .get<ApiResponse<Provincia>>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  createProvincia(provincia: CreateProvinciaRequest): Observable<Provincia> {
    const payload = {
      nombre: provincia.nombre,
      region: {
        id: provincia.regionId,
      },
    };
    return this.http
      .post<ApiResponse<Provincia>>(this.apiUrl, payload)
      .pipe(map((response) => response.data));
  }

  updateProvincia(provincia: UpdateProvinciaRequest): Observable<Provincia> {
    const payload = {
      nombre: provincia.nombre,
      region: {
        id: provincia.regionId,
      },
    };
    return this.http
      .put<ApiResponse<Provincia>>(`${this.apiUrl}/${provincia.id}`, payload)
      .pipe(map((response) => response.data));
  }

  deleteProvincia(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(map(() => void 0));
  }

  getProvinciasByRegion(regionId: number): Observable<Provincia[]> {
    return this.http
      .get<ApiResponse<Provincia[]>>(`${this.apiUrl}/region/${regionId}`)
      .pipe(map((response) => response.data));
  }
}
