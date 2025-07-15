import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthUseCase } from '../../core/domain/use-cases/auth.usecase';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent {
  constructor(
    private authUseCase: AuthUseCase, // Inyecta el caso de uso
    private router: Router
  ) {}

  logout(): void {
    this.authUseCase.logout(); // Llama al caso de uso para cerrar sesión
    this.router.navigate(['/admin/login']); // Redirige al login después de cerrar sesión
  }
}
