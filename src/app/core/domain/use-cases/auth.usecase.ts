import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthGateway } from '../ports/auth.gateway';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthUseCase {
  constructor(private authGateway: AuthGateway, private router: Router) {}

  login(
    username: string,
    password: string
  ): Observable<{ token: string; user: User }> {
    return this.authGateway.login(username, password);
  }

  logout(): void {
    this.authGateway.logout();
  }

  logoutAndRedirect(): void {
    this.authGateway.logout();
    this.router.navigate(['/admin/auth/login']).then(() => {
      // Forzar recarga para asegurar que se limpia todo el estado
      window.location.reload();
    });
  }

  isAuthenticated(): boolean {
    return this.authGateway.isAuthenticated();
  }

  getToken(): string | null {
    return this.authGateway.getToken();
  }

  getUsername(): string | null {
    return this.authGateway.getUsername();
  }
}
