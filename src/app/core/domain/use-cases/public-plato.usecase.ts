import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PublicPlatoGateway, PlatosFilter, PaginatedResponse } from '../ports/public-plato.gateway';
import { Plato } from '../models/plato.model';

import { PUBLIC_PLATO_GATEWAY } from '../tokens/gateway.tokens';

@Injectable()
export class PublicPlatoUseCase {
  constructor(
    @Inject(PUBLIC_PLATO_GATEWAY) private publicPlatoGateway: PublicPlatoGateway
  ) {}

  getAllPlatosPublic(filter?: PlatosFilter): Observable<PaginatedResponse<Plato>> {
    return this.publicPlatoGateway.getAllPlatosPublic(filter);
  }

  getPlatoByIdPublic(id: number): Observable<Plato> {
    return this.publicPlatoGateway.getPlatoByIdPublic(id);
  }

  searchPlatos(query: string): Observable<Plato[]> {
    return this.publicPlatoGateway.searchPlatos(query);
  }

  getPlatosByCategoria(categoriaId: number): Observable<Plato[]> {
    return this.publicPlatoGateway.getPlatosByCategoria(categoriaId);
  }

  getPlatosByRegion(regionId: number): Observable<Plato[]> {
    return this.publicPlatoGateway.getPlatosByRegion(regionId);
  }

  getPlatosByProvincia(provinciaId: number): Observable<Plato[]> {
    return this.publicPlatoGateway.getPlatosByProvincia(provinciaId);
  }
}