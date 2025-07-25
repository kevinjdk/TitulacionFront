import {
  Component,
  OnInit,
  ViewEncapsulation,
  HostListener,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthUseCase } from '../../core/domain/use-cases/auth.usecase';
import { CategoriaUseCase } from '../../core/domain/use-cases/categoria.usecase';
import { RegionUseCase } from '../../core/domain/use-cases/region.usecase';
import { ProvinciaUseCase } from '../../core/domain/use-cases/provincia.usecase';
import { PlatoUseCase } from '../../core/domain/use-cases/plato.usecase';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AdminDashboardComponent implements OnInit {
  username: string = '';
  regionesCount: number = 0;
  provinciasCount: number = 0;
  categoriasCount: number = 0;
  platosCount: number = 0;
  loading: boolean = true;
  showUserMenu: boolean = false;

  constructor(
    private authUseCase: AuthUseCase,
    private categoriaUseCase: CategoriaUseCase,
    private regionUseCase: RegionUseCase,
    private provinciaUseCase: ProvinciaUseCase,
    private platoUseCase: PlatoUseCase,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username') || 'Administrador';
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.loading = true;

    forkJoin({
      regiones: this.regionUseCase.getAllRegiones(),
      provincias: this.provinciaUseCase.getAllProvincias(),
      categorias: this.categoriaUseCase.getAllCategorias(),
      platos: this.platoUseCase.getAllPlatos(),
    }).subscribe({
      next: (data) => {
        this.regionesCount = data.regiones.length;
        this.provinciasCount = data.provincias.length;
        this.categoriasCount = data.categorias.length;
        this.platosCount = data.platos.length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
        this.loading = false;
      },
    });
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const userInfo = target.closest('.user-info');

    if (!userInfo && this.showUserMenu) {
      this.showUserMenu = false;
    }
  }

  logout(): void {
    this.showUserMenu = false; // Cerrar el menú antes de logout
    this.authUseCase.logout();
    this.router.navigate(['/admin/login']);
  }
}
