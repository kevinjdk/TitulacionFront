import { Observable } from 'rxjs';
import { User } from '../models/user.model';

export abstract class AuthGateway {
  abstract login(
    username: string,
    password: string
  ): Observable<{ token: string; user: User }>;
  abstract logout(): void;
  abstract isAuthenticated(): boolean;
  abstract getToken(): string | null;
  abstract getUsername(): string | null;
}
