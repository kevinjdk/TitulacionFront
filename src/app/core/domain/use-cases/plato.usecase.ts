import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PlatoGateway } from '../ports/plato.gateway';
import {
  Plato,
  CreatePlatoRequest,
  UpdatePlatoRequest,
} from '../models/plato.model';
import { PLATO_GATEWAY } from '../tokens/gateway.tokens';

@Injectable()
export class PlatoUseCase {
  constructor(@Inject(PLATO_GATEWAY) private platoGateway: PlatoGateway) {}

  getAllPlatos(): Observable<Plato[]> {
    return this.platoGateway.getAllPlatos();
  }

  getPlatoById(id: number): Observable<Plato> {
    return this.platoGateway.getPlatoById(id);
  }

  createPlato(plato: CreatePlatoRequest): Observable<Plato> {
    return this.platoGateway.createPlato(plato);
  }

  updatePlato(plato: UpdatePlatoRequest): Observable<Plato> {
    return this.platoGateway.updatePlato(plato);
  }

  deletePlato(id: number): Observable<void> {
    return this.platoGateway.deletePlato(id);
  }

  searchPlatosByNombre(nombre: string): Observable<Plato[]> {
    return this.platoGateway.searchPlatosByNombre(nombre);
  }
}
