import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { RegionUseCase } from '../../../core/domain/use-cases/region.usecase';
import { Region } from '../../../core/domain/models/region.model';

@Component({
  selector: 'app-region-list',
  standalone: false,
  templateUrl: './region-list.component.html',
  styleUrl: './region-list.component.scss',
})
export class RegionListComponent implements OnInit {
  regiones: Region[] = [];
  loading: boolean = false;
  showEditDialog: boolean = false;
  showCreateDialog: boolean = false;
  selectedRegion: Region = { id: 0, nombre: '', provincias: [] };
  newRegion: Region = { id: 0, nombre: '', provincias: [] };

  constructor(
    private regionUseCase: RegionUseCase,
    private router: Router,
    private messageService: MessageService,
    public confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadRegiones();
  }

  loadRegiones(): void {
    this.loading = true;
    this.regionUseCase.getAllRegiones().subscribe({
      next: (regiones) => {
        this.regiones = regiones;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading regiones:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar las regiones',
        });
        this.loading = false;
      },
    });
  }

  editRegion(region: Region): void {
    this.selectedRegion = { ...region };
    this.showEditDialog = true;
  }

  hideEditDialog(): void {
    this.showEditDialog = false;
    this.selectedRegion = { id: 0, nombre: '', provincias: [] };
  }

  saveRegion(): void {
    if (this.selectedRegion.nombre.trim()) {
      const updateRequest = {
        id: this.selectedRegion.id,
        nombre: this.selectedRegion.nombre,
      };

      this.regionUseCase.updateRegion(updateRequest).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Región actualizada correctamente',
          });
          this.hideEditDialog();
          this.loadRegiones();
        },
        error: (error) => {
          console.error('Error updating región:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar la región',
          });
        },
      });
    }
  }

  confirmDelete(region: Region): void {
    this.confirmationService.confirm({
      message: '¿Estas seguro que deseas continuar?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.deleteRegion(region.id);
      },
    });
  }

  deleteRegion(id: number): void {
    this.regionUseCase.deleteRegion(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Región eliminada correctamente',
        });
        this.loadRegiones();
      },
      error: (error) => {
        console.error('Error deleting región:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al eliminar la región',
        });
      },
    });
  }

  navigateToNew(): void {
    this.newRegion = { id: 0, nombre: '', provincias: [] };
    this.showCreateDialog = true;
  }

  hideCreateDialog(): void {
    this.showCreateDialog = false;
    this.newRegion = { id: 0, nombre: '', provincias: [] };
  }

  createRegion(): void {
    if (this.newRegion.nombre.trim()) {
      const createRequest = {
        nombre: this.newRegion.nombre,
      };

      this.regionUseCase.createRegion(createRequest).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Región creada correctamente',
          });
          this.hideCreateDialog();
          this.loadRegiones();
        },
        error: (error) => {
          console.error('Error creating región:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear la región',
          });
        },
      });
    }
  }

  navigateBack(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}
