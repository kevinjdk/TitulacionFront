import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PublicPlatoGateway, PlatosFilter, PaginatedResponse } from '../../core/domain/ports/public-plato.gateway';
import { Plato } from '../../core/domain/models/plato.model';
import { environment } from '../../../enviroments/environment';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class PublicPlatoRestAdapter implements PublicPlatoGateway {
  private apiUrl = environment.backendUrl + '/api/platos';

  constructor(private http: HttpClient) {}

  getAllPlatosPublic(filter?: PlatosFilter): Observable<PaginatedResponse<Plato>> {
    // Primero obtenemos todos los platos
    return this.http
      .get<ApiResponse<Plato[]>>(this.apiUrl)
      .pipe(
        map((response) => {
          let platos = response.data;
          
          // Aplicar filtros si existen
          if (filter) {
            // Filtrar por regiones
            if (filter.regiones && filter.regiones.length > 0) {
              platos = platos.filter(plato => 
                filter.regiones!.includes(plato.region.id)
              );
            }
            
            // Filtrar por provincias
            if (filter.provincias && filter.provincias.length > 0) {
              platos = platos.filter(plato => 
                filter.provincias!.includes(plato.provincia.id)
              );
            }
            
            // Filtrar por categorías
            if (filter.categorias && filter.categorias.length > 0) {
              platos = platos.filter(plato => 
                filter.categorias!.includes(plato.categoria.id)
              );
            }
            
            // Filtrar por búsqueda de texto
            if (filter.search && filter.search.trim() !== '') {
              const searchTerm = filter.search.toLowerCase().trim();
              platos = platos.filter(plato => 
                plato.nombre.toLowerCase().includes(searchTerm) ||
                plato.descripcion.toLowerCase().includes(searchTerm) ||
                plato.region.nombre.toLowerCase().includes(searchTerm) ||
                plato.provincia.nombre.toLowerCase().includes(searchTerm) ||
                plato.categoria.nombre.toLowerCase().includes(searchTerm)
              );
            }
          }
          
          // Aplicar paginación
          const pageSize = filter?.size || 16;
          const currentPage = filter?.page || 0;
          const startIndex = currentPage * pageSize;
          const endIndex = startIndex + pageSize;
          const paginatedPlatos = platos.slice(startIndex, endIndex);
          
          // Retornar respuesta paginada
          return {
            content: paginatedPlatos,
            totalElements: platos.length,
            totalPages: Math.ceil(platos.length / pageSize),
            size: pageSize,
            number: currentPage
          };
        })
      );
  }

  getPlatoByIdPublic(id: number): Observable<Plato> {
    return this.http
      .get<ApiResponse<Plato>>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  searchPlatos(query: string): Observable<Plato[]> {
    return this.http
      .get<ApiResponse<Plato[]>>(`${this.apiUrl}`)
      .pipe(
        map((response) => 
          response.data.filter(plato => 
            plato.nombre.toLowerCase().includes(query.toLowerCase()) ||
            plato.descripcion.toLowerCase().includes(query.toLowerCase()) ||
            plato.region.nombre.toLowerCase().includes(query.toLowerCase()) ||
            plato.provincia.nombre.toLowerCase().includes(query.toLowerCase()) ||
            plato.categoria.nombre.toLowerCase().includes(query.toLowerCase())
          )
        )
      );
  }

  getPlatosByCategoria(categoriaId: number): Observable<Plato[]> {
    return this.http
      .get<ApiResponse<Plato[]>>(this.apiUrl)
      .pipe(
        map((response) => 
          response.data.filter(plato => plato.categoria.id === categoriaId)
        )
      );
  }

  getPlatosByRegion(regionId: number): Observable<Plato[]> {
    return this.http
      .get<ApiResponse<Plato[]>>(this.apiUrl)
      .pipe(
        map((response) => 
          response.data.filter(plato => plato.region.id === regionId)
        )
      );
  }

  getPlatosByProvincia(provinciaId: number): Observable<Plato[]> {
    return this.http
      .get<ApiResponse<Plato[]>>(this.apiUrl)
      .pipe(
        map((response) => 
          response.data.filter(plato => plato.provincia.id === provinciaId)
        )
      );
  }
}