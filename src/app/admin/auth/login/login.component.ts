import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthRestAdapter } from '../../../infrastructure/api/auth-rest.adapter';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginData = {
    username: '',
    password: '',
  };
  loading: boolean = false;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private authService: AuthRestAdapter
  ) {}

  login() {
    // Validaciones básicas
    if (!this.loginData.username || !this.loginData.password) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Todos los campos son obligatorios',
      });
      return;
    }

    this.loading = true;

    // Autenticación real
    this.authService
      .login(this.loginData.username, this.loginData.password)
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Inicio de sesión exitoso',
          });

          // Redirigir al dashboard
          this.router.navigate(['/admin/dashboard']);
          this.loading = false;
        },
        error: (error) => {
          const errorMessage =
            error.error?.message ||
            error.error?.error ||
            'Error al iniciar sesión';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
          });
          this.loading = false;
        },
      });
  }

  navigateToRegister() {
    this.router.navigate(['/admin/auth/register']);
  }
}
