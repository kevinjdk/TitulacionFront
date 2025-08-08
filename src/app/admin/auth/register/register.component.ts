import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthRestAdapter } from '../../../infrastructure/api/auth-rest.adapter';
import { RegisterRequest } from '../../../core/domain/models/register-request.model';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerData: RegisterRequest = {
    username: '',
    password: '',
    email: '',
  };
  confirmPassword: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthRestAdapter,
    private router: Router,
    private messageService: MessageService
  ) {}

  register() {
    // Validaciones básicas
    if (
      !this.registerData.username ||
      !this.registerData.password ||
      !this.registerData.email
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Todos los campos son obligatorios',
      });
      return;
    }

    if (this.registerData.password !== this.confirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Las contraseñas no coinciden',
      });
      return;
    }

    if (this.registerData.password.length < 6) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'La contraseña debe tener al menos 6 caracteres',
      });
      return;
    }

    this.loading = true;

    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Usuario registrado correctamente',
        });

        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/admin/auth/login']);
        }, 2000);

        this.loading = false;
      },
      error: (error) => {
        const errorMessage =
          error.error?.message ||
          error.error?.error ||
          'Error al registrar usuario';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
        });
        this.loading = false;
      },
    });
  }

  navigateToLogin() {
    this.router.navigate(['/admin/auth/login']);
  }
}
