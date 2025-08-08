import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthUseCase } from '../../../core/domain/use-cases/auth.usecase';

@Component({
  selector: 'app-admin-layout',
  standalone: false,
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent {
  @Input() pageTitle: string = '';
  @Input() currentRoute: string = '';

  username: string = '';
  showUserMenu: boolean = false;

  constructor(public router: Router, private authUseCase: AuthUseCase) {
    this.username = localStorage.getItem('username') || 'Administrador';
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  logout(): void {
    this.showUserMenu = false;
    this.authUseCase.logoutAndRedirect();
  }

  isActive(route: string): boolean {
    return this.currentRoute === route;
  }
}
