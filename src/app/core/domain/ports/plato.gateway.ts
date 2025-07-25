import { Observable } from 'rxjs';
import {
  Plato,
  CreatePlatoRequest,
  UpdatePlatoRequest,
} from '../models/plato.model';

export abstract class PlatoGateway {
  abstract getAllPlatos(): Observable<Plato[]>;
  abstract getPlatoById(id: number): Observable<Plato>;
  abstract createPlato(plato: CreatePlatoRequest): Observable<Plato>;
  abstract updatePlato(plato: UpdatePlatoRequest): Observable<Plato>;
  abstract deletePlato(id: number): Observable<void>;
  abstract searchPlatosByNombre(nombre: string): Observable<Plato[]>;
}
