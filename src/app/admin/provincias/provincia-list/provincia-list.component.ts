import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProvinciaUseCase } from '../../../core/domain/use-cases/provincia.usecase';
import { RegionUseCase } from '../../../core/domain/use-cases/region.usecase';
import { Provincia } from '../../../core/domain/models/provincia.model';
import { Region } from '../../../core/domain/models/region.model';

@Component({
  selector: 'app-provincia-list',
  standalone: false,
  templateUrl: './provincia-list.component.html',
  styleUrl: './provincia-list.component.scss',
})
export class ProvinciaListComponent implements OnInit {
  provincias: Provincia[] = [];
  filteredProvincias: Provincia[] = [];
  regiones: Region[] = [];
  loading: boolean = false;
  showEditDialog: boolean = false;
  showCreateDialog: boolean = false;
  selectedProvincia: Provincia = { id: 0, nombre: '', regionId: 0 };
  newProvincia: Provincia = { id: 0, nombre: '', regionId: 0 };
  searchTerm: string = '';

  constructor(
    private provinciaUseCase: ProvinciaUseCase,
    private regionUseCase: RegionUseCase,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadProvincias();
    this.loadRegiones();
  }

  loadRegiones(): void {
    this.regionUseCase.getAllRegiones().subscribe({
      next: (regiones) => {
        this.regiones = regiones;
      },
      error: (error) => {
        console.error('Error loading regiones:', error);
      },
    });
  }

  loadProvincias(): void {
    this.loading = true;
    this.provinciaUseCase.getAllProvincias().subscribe({
      next: (provincias) => {
        this.provincias = provincias;
        this.filteredProvincias = [...provincias];
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

  onSearch(): void {
    if (!this.searchTerm) {
      this.filteredProvincias = [...this.provincias];
    } else {
      this.filteredProvincias = this.provincias.filter(provincia =>
        provincia.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (provincia.region?.nombre || '').toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  editProvincia(provincia: Provincia): void {
    this.selectedProvincia = { ...provincia };
    this.showEditDialog = true;
  }

  hideEditDialog(): void {
    this.showEditDialog = false;
    this.selectedProvincia = { id: 0, nombre: '', regionId: 0 };
  }

  saveProvincia(): void {
    if (this.selectedProvincia.nombre.trim() && this.selectedProvincia.regionId) {
      const updateRequest = {
        id: this.selectedProvincia.id,
        nombre: this.selectedProvincia.nombre,
        regionId: this.selectedProvincia.regionId,
      };

      this.provinciaUseCase.updateProvincia(updateRequest).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Provincia actualizada correctamente',
          });
          this.hideEditDialog();
          this.loadProvincias();
        },
        error: (error) => {
          console.error('Error updating provincia:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar la provincia',
          });
        },
      });
    }
  }

  confirmDelete(provincia: Provincia): void {
    this.confirmationService.confirm({
      message: '¿Estas seguro que deseas continuar?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
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
    this.newProvincia = { id: 0, nombre: '', regionId: 0 };
    this.showCreateDialog = true;
  }

  hideCreateDialog(): void {
    this.showCreateDialog = false;
    this.newProvincia = { id: 0, nombre: '', regionId: 0 };
  }

  createProvincia(): void {
    if (this.newProvincia.nombre.trim() && this.newProvincia.regionId) {
      const createRequest = {
        nombre: this.newProvincia.nombre,
        regionId: this.newProvincia.regionId,
      };

      this.provinciaUseCase.createProvincia(createRequest).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Provincia creada correctamente',
          });
          this.hideCreateDialog();
          this.loadProvincias();
        },
        error: (error) => {
          console.error('Error creating provincia:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear la provincia',
          });
        },
      });
    }
  }

  navigateBack(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}
