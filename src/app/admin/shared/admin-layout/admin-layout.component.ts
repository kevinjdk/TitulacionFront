import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(public router: Router) {
    this.username = localStorage.getItem('username') || 'Administrador';
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  logout(): void {
    this.showUserMenu = false;
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.router.navigate(['/admin/login']);
  }

  isActive(route: string): boolean {
    return this.currentRoute === route;
  }
}
