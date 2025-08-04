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
  filteredCategorias: Categoria[] = [];
  loading: boolean = false;
  showEditDialog: boolean = false;
  showCreateDialog: boolean = false;
  selectedCategoria: Categoria = { id: 0, nombre: '' };
  newCategoria: Categoria = { id: 0, nombre: '' };
  searchTerm: string = '';

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
        this.filteredCategorias = [...categorias];
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

  onSearch(): void {
    if (!this.searchTerm) {
      this.filteredCategorias = [...this.categorias];
    } else {
      this.filteredCategorias = this.categorias.filter((categoria) =>
        categoria.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  editCategoria(categoria: Categoria): void {
    this.selectedCategoria = { ...categoria };
    this.showEditDialog = true;
  }

  hideEditDialog(): void {
    this.showEditDialog = false;
    this.selectedCategoria = { id: 0, nombre: '' };
  }

  saveCategoria(): void {
    if (this.selectedCategoria.nombre.trim()) {
      const updateRequest = {
        id: this.selectedCategoria.id,
        nombre: this.selectedCategoria.nombre,
      };

      this.categoriaUseCase.updateCategoria(updateRequest).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Categoría actualizada correctamente',
          });
          this.hideEditDialog();
          this.loadCategorias();
        },
        error: (error) => {
          console.error('Error updating categoría:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar la categoría',
          });
        },
      });
    }
  }

  confirmDelete(categoria: Categoria): void {
    this.confirmationService.confirm({
      message: '¿Estas seguro que deseas continuar?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
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
    this.newCategoria = { id: 0, nombre: '' };
    this.showCreateDialog = true;
  }

  hideCreateDialog(): void {
    this.showCreateDialog = false;
    this.newCategoria = { id: 0, nombre: '' };
  }

  createCategoria(): void {
    if (this.newCategoria.nombre.trim()) {
      const createRequest = {
        nombre: this.newCategoria.nombre,
      };

      this.categoriaUseCase.createCategoria(createRequest).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Categoría creada correctamente',
          });
          this.hideCreateDialog();
          this.loadCategorias();
        },
        error: (error) => {
          console.error('Error creating categoría:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear la categoría',
          });
        },
      });
    }
  }

  navigateBack(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}
