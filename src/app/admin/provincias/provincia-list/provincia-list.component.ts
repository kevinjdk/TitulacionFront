import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProvinciaUseCase } from '../../../core/domain/use-cases/provincia.usecase';
import { Provincia } from '../../../core/domain/models/provincia.model';

@Component({
  selector: 'app-provincia-list',
  standalone: false,
  templateUrl: './provincia-list.component.html',
  styleUrl: './provincia-list.component.scss',
})
export class ProvinciaListComponent implements OnInit {
  provincias: Provincia[] = [];
  loading: boolean = false;

  constructor(
    private provinciaUseCase: ProvinciaUseCase,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadProvincias();
  }

  loadProvincias(): void {
    this.loading = true;
    this.provinciaUseCase.getAllProvincias().subscribe({
      next: (provincias) => {
        this.provincias = provincias;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading provincias:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar las provincias',
        });
        this.loading = false;
      },
    });
  }

  editProvincia(provincia: Provincia): void {
    this.router.navigate(['/admin/provincias/edit', provincia.id]);
  }

  confirmDelete(provincia: Provincia): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar la provincia "${provincia.nombre}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteProvincia(provincia.id);
      },
    });
  }

  deleteProvincia(id: number): void {
    this.provinciaUseCase.deleteProvincia(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Provincia eliminada correctamente',
        });
        this.loadProvincias();
      },
      error: (error) => {
        console.error('Error deleting provincia:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al eliminar la provincia',
        });
      },
    });
  }

  navigateToNew(): void {
    this.router.navigate(['/admin/provincias/new']);
  }

  navigateBack(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}
