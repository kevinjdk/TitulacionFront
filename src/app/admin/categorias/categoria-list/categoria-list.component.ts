import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CategoriaUseCase } from '../../../core/domain/use-cases/categoria.usecase';
import { Categoria } from '../../../core/domain/models/categoria.model';

@Component({
  selector: 'app-categoria-list',
  standalone: false,
  templateUrl: './categoria-list.component.html',
  styleUrl: './categoria-list.component.scss',
})
export class CategoriaListComponent implements OnInit {
  categorias: Categoria[] = [];
  loading: boolean = false;

  constructor(
    private categoriaUseCase: CategoriaUseCase,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadCategorias();
  }

  loadCategorias(): void {
    this.loading = true;
    this.categoriaUseCase.getAllCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categorías:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar las categorías',
        });
        this.loading = false;
      },
    });
  }

  editCategoria(categoria: Categoria): void {
    this.router.navigate(['/admin/categorias/edit', categoria.id]);
  }

  confirmDelete(categoria: Categoria): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar la categoría "${categoria.nombre}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteCategoria(categoria.id);
      },
    });
  }

  deleteCategoria(id: number): void {
    this.categoriaUseCase.deleteCategoria(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Categoría eliminada correctamente',
        });
        this.loadCategorias();
      },
      error: (error) => {
        console.error('Error deleting categoría:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al eliminar la categoría',
        });
      },
    });
  }

  navigateToNew(): void {
    this.router.navigate(['/admin/categorias/new']);
  }

  navigateBack(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}
