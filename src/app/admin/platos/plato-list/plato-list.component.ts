import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PlatoUseCase } from '../../../core/domain/use-cases/plato.usecase';
import { Plato } from '../../../core/domain/models/plato.model';

@Component({
  selector: 'app-plato-list',
  standalone: false,
  templateUrl: './plato-list.component.html',
  styleUrl: './plato-list.component.scss',
})
export class PlatoListComponent implements OnInit {
  platos: Plato[] = [];
  loading: boolean = false;
  searchTerm: string = '';

  constructor(
    private platoUseCase: PlatoUseCase,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadPlatos();
  }

  loadPlatos(): void {
    this.loading = true;
    this.platoUseCase.getAllPlatos().subscribe({
      next: (platos) => {
        this.platos = platos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading platos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los platos',
        });
        this.loading = false;
      },
    });
  }

  searchPlatos(): void {
    if (this.searchTerm.trim()) {
      this.loading = true;
      this.platoUseCase.searchPlatosByNombre(this.searchTerm).subscribe({
        next: (platos) => {
          this.platos = platos;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error searching platos:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al buscar los platos',
          });
          this.loading = false;
        },
      });
    } else {
      this.loadPlatos();
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.loadPlatos();
  }

  editPlato(plato: Plato): void {
    this.router.navigate(['/admin/platos/edit', plato.id]);
  }

  confirmDelete(plato: Plato): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar el plato "${plato.nombre}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deletePlato(plato.id);
      },
    });
  }

  deletePlato(id: number): void {
    this.platoUseCase.deletePlato(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Plato eliminado correctamente',
        });
        this.loadPlatos();
      },
      error: (error) => {
        console.error('Error deleting plato:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al eliminar el plato',
        });
      },
    });
  }

  navigateToNew(): void {
    this.router.navigate(['/admin/platos/new']);
  }

  navigateBack(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}
