import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthUseCase } from '../../../core/domain/use-cases/auth.usecase';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  constructor(private authUseCase: AuthUseCase, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required), // <-- Cambiado a 'username', sin Validators.email
      password: new FormControl('', Validators.required),
    });
  }

  onLogin(): void {
    this.loading = true;
    this.errorMessage = null;

    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, ingresa tu usuario y contraseña.'; // Mensaje ajustado
      this.loading = false;
      this.loginForm.markAllAsTouched();
      return;
    }

    const username = this.loginForm.get('username')?.value; // <-- Obtiene el valor del campo 'username'
    const password = this.loginForm.get('password')?.value;

    this.authUseCase.login(username, password).subscribe({
      // <-- Pasa 'username' al caso de uso
      next: (response) => {
        console.log('Login exitoso:', response);
        this.loading = false;
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        console.error('Error de login:', err);
        this.loading = false;
        if (err.status === 401) {
          this.errorMessage = 'Credenciales incorrectas. Intenta de nuevo.';
        } else {
          this.errorMessage =
            'Ocurrió un error al iniciar sesión. Intenta más tarde.';
        }
      },
    });
  }
}
