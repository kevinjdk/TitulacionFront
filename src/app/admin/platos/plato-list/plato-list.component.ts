import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PlatoUseCase } from '../../../core/domain/use-cases/plato.usecase';
import { CategoriaUseCase } from '../../../core/domain/use-cases/categoria.usecase';
import { RegionUseCase } from '../../../core/domain/use-cases/region.usecase';
import { ProvinciaUseCase } from '../../../core/domain/use-cases/provincia.usecase';
import {
  Plato,
  CreatePlatoRequest,
} from '../../../core/domain/models/plato.model';
import { Categoria } from '../../../core/domain/models/categoria.model';
import { Region } from '../../../core/domain/models/region.model';
import { Provincia } from '../../../core/domain/models/provincia.model';

@Component({
  selector: 'app-plato-list',
  standalone: false,
  templateUrl: './plato-list.component.html',
  styleUrl: './plato-list.component.scss',
})
export class PlatoListComponent implements OnInit {
  platos: Plato[] = [];
  filteredPlatos: Plato[] = [];
  categorias: Categoria[] = [];
  regiones: Region[] = [];
  provincias: Provincia[] = [];
  filteredProvincias: Provincia[] = [];
  loading: boolean = false;
  searchTerm: string = '';
  preparacionText: string = '';
  editPreparacionText: string = '';
  showCreateDialog: boolean = false;
  showEditDialog: boolean = false;
  newPlato: CreatePlatoRequest = {
    nombre: '',
    descripcion: '',
    ingredientes: '',
    preparacion: [],
    porciones: 1,
    imageUrl: '',
    categoriaId: 0,
    regionId: 0,
    provinciaId: 0,
  };
  editPlatoData: CreatePlatoRequest = {
    nombre: '',
    descripcion: '',
    ingredientes: '',
    preparacion: [],
    porciones: 1,
    imageUrl: '',
    categoriaId: 0,
    regionId: 0,
    provinciaId: 0,
  };
  selectedPlato: Plato = {} as Plato;
  filteredProvinciasEdit: Provincia[] = [];

  constructor(
    private platoUseCase: PlatoUseCase,
    private categoriaUseCase: CategoriaUseCase,
    private regionUseCase: RegionUseCase,
    private provinciaUseCase: ProvinciaUseCase,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    // Load reference data first
    this.loadCategorias();
    this.loadRegiones();
    this.loadProvincias();
    // Then load platos
    this.loadPlatos();
  }

  loadCategorias(): void {
    this.categoriaUseCase.getAllCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
      },
      error: (error) => {
        console.error('Error loading categorias:', error);
      },
    });
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
    this.provinciaUseCase.getAllProvincias().subscribe({
      next: (provincias) => {
        this.provincias = provincias;
        this.filteredProvincias = [...provincias];
      },
      error: (error) => {
        console.error('Error loading provincias:', error);
      },
    });
  }

  loadPlatos(): void {
    this.loading = true;
    this.platoUseCase.getAllPlatos().subscribe({
      next: (platos) => {
        this.platos = platos;
        this.filteredPlatos = [...platos];
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

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.filteredPlatos = this.platos.filter(
        (plato) =>
          plato.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          (plato.categoria?.nombre || '')
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          (plato.region?.nombre || '')
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          (plato.provincia?.nombre || '')
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredPlatos = [...this.platos];
    }
  }

  onRegionChange(): void {
    if (this.newPlato.regionId) {
      // Convert to number to ensure proper comparison
      const regionId = Number(this.newPlato.regionId);

      this.filteredProvincias = this.provincias.filter((provincia) => {
        // Try both regionId property and region.id
        return (
          provincia.regionId === regionId ||
          (provincia.region && provincia.region.id === regionId)
        );
      });
    } else {
      this.filteredProvincias = [...this.provincias];
    }
    // Reset provincia selection when region changes
    this.newPlato.provinciaId = 0;
  }

  showCreatePlatoDialog(): void {
    // Reset form
    this.newPlato = {
      nombre: '',
      descripcion: '',
      ingredientes: '',
      preparacion: [],
      porciones: 1,
      imageUrl: '',
      categoriaId: 0,
      regionId: 0,
      provinciaId: 0,
    };

    this.preparacionText = '';

    // Ensure all provincias are available initially
    this.filteredProvincias = [...this.provincias];
    this.showCreateDialog = true;
  }

  hideCreateDialog(): void {
    this.showCreateDialog = false;
  }

  createPlato(): void {
    if (
      this.newPlato.nombre &&
      this.newPlato.categoriaId &&
      this.newPlato.regionId &&
      this.newPlato.provinciaId
    ) {
      // Convert preparacion text to array
      if (this.preparacionText.trim()) {
        this.newPlato.preparacion = this.preparacionText
          .split('\n')
          .map((step) => step.trim())
          .filter((step) => step.length > 0);
      }

      // Ensure all IDs are numbers
      const platoData: CreatePlatoRequest = {
        ...this.newPlato,
        categoriaId: Number(this.newPlato.categoriaId),
        regionId: Number(this.newPlato.regionId),
        provinciaId: Number(this.newPlato.provinciaId),
        porciones: Number(this.newPlato.porciones),
      };

      console.log('Enviando datos del plato:', platoData);

      this.platoUseCase.createPlato(platoData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Plato creado correctamente',
          });
          this.hideCreateDialog();
          this.loadPlatos();
        },
        error: (error) => {
          console.error('Error creating plato:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              'Error al crear el plato: ' +
              (error.error?.message || error.message),
          });
        },
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail:
          'Por favor complete todos los campos obligatorios (nombre, categoría, región, provincia)',
      });
    }
  }

  editPlato(plato: Plato): void {
    // Cargar datos del plato seleccionado
    this.selectedPlato = plato;
    this.editPlatoData = {
      nombre: plato.nombre,
      descripcion: plato.descripcion,
      ingredientes: plato.ingredientes,
      preparacion: [...plato.preparacion],
      porciones: plato.porciones,
      imageUrl: plato.imageUrl || '',
      categoriaId: plato.categoria.id,
      regionId: plato.region.id,
      provinciaId: plato.provincia.id,
    };

    // Convertir preparacion array a texto
    this.editPreparacionText = plato.preparacion.join('\n');

    // Filtrar provincias según la región seleccionada (sin resetear la provincia)
    this.onEditRegionChange(false);

    this.showEditDialog = true;
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

  onEditRegionChange(resetProvincia: boolean = true): void {
    if (this.editPlatoData.regionId) {
      // Convert to number to ensure proper comparison
      const regionId = Number(this.editPlatoData.regionId);

      this.filteredProvinciasEdit = this.provincias.filter((provincia) => {
        // Try both regionId property and region.id
        return (
          provincia.regionId === regionId ||
          (provincia.region && provincia.region.id === regionId)
        );
      });
    } else {
      this.filteredProvinciasEdit = [...this.provincias];
    }
    // Reset provincia selection when region changes (only if explicitly requested)
    if (resetProvincia) {
      this.editPlatoData.provinciaId = 0;
    }
  }

  hideEditDialog(): void {
    this.showEditDialog = false;
  }

  updatePlato(): void {
    if (
      this.editPlatoData.nombre &&
      this.editPlatoData.categoriaId &&
      this.editPlatoData.regionId &&
      this.editPlatoData.provinciaId
    ) {
      // Convert preparacion text to array
      if (this.editPreparacionText.trim()) {
        this.editPlatoData.preparacion = this.editPreparacionText
          .split('\n')
          .map((step) => step.trim())
          .filter((step) => step.length > 0);
      }

      // Ensure all IDs are numbers
      const platoData = {
        id: this.selectedPlato.id,
        ...this.editPlatoData,
        categoriaId: Number(this.editPlatoData.categoriaId),
        regionId: Number(this.editPlatoData.regionId),
        provinciaId: Number(this.editPlatoData.provinciaId),
        porciones: Number(this.editPlatoData.porciones),
      };

      console.log('Actualizando datos del plato:', platoData);

      this.platoUseCase.updatePlato(platoData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Plato actualizado correctamente',
          });
          this.hideEditDialog();
          this.loadPlatos();
        },
        error: (error) => {
          console.error('Error updating plato:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              'Error al actualizar el plato: ' +
              (error.error?.message || error.message),
          });
        },
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail:
          'Por favor complete todos los campos obligatorios (nombre, categoría, región, provincia)',
      });
    }
  }

  navigateToNew(): void {
    this.showCreatePlatoDialog();
  }
}
