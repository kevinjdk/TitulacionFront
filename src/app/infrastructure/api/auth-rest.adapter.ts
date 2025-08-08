import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { AuthGateway } from '../../core/domain/ports/auth.gateway';
import { User } from '../../core/domain/models/user.model';
import { RegisterRequest } from '../../core/domain/models/register-request.model';
import { environment } from '../../../enviroments/environment';

interface JwtResponseDTO {
  token: string;
  type: string;
  id: number;
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthRestAdapter implements AuthGateway {
  private apiUrl = environment.backendUrl + '/api/auth/';

  constructor(private http: HttpClient) {}

  login(
    username: string,
    password: string
  ): Observable<{ token: string; user: User }> {
    return this.http
      .post<JwtResponseDTO>(this.apiUrl + 'signin', { username, password })
      .pipe(
        tap((response) => {
          if (response && response.token) {
            localStorage.setItem('jwt_token', response.token);
            localStorage.setItem('user_id', response.id.toString());
            localStorage.setItem('username', response.username);
          }
        }),
        map((response) => ({
          token: response.token,
          user: { id: response.id, username: response.username },
        }))
      );
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  register(registerRequest: RegisterRequest): Observable<any> {
    return this.http.post(this.apiUrl + 'signup', registerRequest);
  }
}
