// recetas.component.ts - Integración simple con tu UseCase existente
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { PublicPlatoUseCase } from '../../core/domain/use-cases/public-plato.usecase';
import { PublicDataUseCase } from '../../core/domain/use-cases/public-data.usecase';
import { Plato } from '../../core/domain/models/plato.model';
import { Categoria } from '../../core/domain/models/categoria.model';
import { Region } from '../../core/domain/models/region.model';
import { Provincia } from '../../core/domain/models/provincia.model';
import { PlatosFilter } from '../../core/domain/ports/public-plato.gateway';

@Component({
  selector: 'app-recetas',
  standalone: false,
  templateUrl: './recetas.component.html',
  styleUrls: ['./recetas.component.scss'],
  providers: [MessageService]
})
export class RecetasComponent implements OnInit, OnDestroy {
  // Datos principales
  allPlatos: Plato[] = []; // Todos los platos cargados
  filteredPlatos: Plato[] = []; // Platos después de aplicar filtros
  pagedPlatos: Plato[] = []; // Platos visibles en la página actual
  
  // Datos para filtros
  categorias: Categoria[] = [];
  regiones: Region[] = [];
  provincias: any[] = [];
  provinciasFiltradas: any[] = [];
  
  // Filtros seleccionados
  selectedCategorias: Categoria[] = [];
  selectedRegiones: Region[] = [];
  selectedProvincias: any[] = [];
  
  // Búsqueda
  currentSearchTerm = '';
  hasActiveSearch = false;
  
  // Paginación
  currentPage = 0;
  itemsPerPage = 15;
  totalItems = 0;
  
  // Estados
  loading = false;
  hasActiveFilters = false;
  
  // Filtro actual para reaplicar
  currentFilter: PlatosFilter = {};
  
  // Subject para manejar la destrucción del componente
  private destroy$ = new Subject<void>();
  
  constructor(
    private publicPlatoUseCase: PublicPlatoUseCase,
    private publicDataUseCase: PublicDataUseCase,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.setupRouteListener();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupRouteListener(): void {
    // Escuchar cambios en los parámetros de la URL para búsqueda
    this.route.queryParams
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(params => {
        const searchParam = params['search'] || '';
        
        if (searchParam !== this.currentSearchTerm) {
          console.log('Nuevo término de búsqueda desde URL:', searchParam);
          this.currentSearchTerm = searchParam;
          this.hasActiveSearch = searchParam.length > 0;
          
          // Aplicar búsqueda
          this.performSearch();
        }
      });
  }

  private performSearch(): void {
    if (this.currentSearchTerm.trim()) {
      // Usar el método searchPlatos de tu UseCase
      this.loading = true;
      
      this.publicPlatoUseCase.searchPlatos(this.currentSearchTerm).subscribe({
        next: (platos) => {
          console.log(`Búsqueda "${this.currentSearchTerm}": ${platos.length} recetas encontradas`);
          
          // Aplicar también los filtros tradicionales si los hay
          this.allPlatos = platos;
          this.applyTraditionalFilters();
          
          this.loading = false;
          
          // Mostrar mensaje de resultados
          const message = this.totalItems > 0 
            ? `Se encontraron ${this.totalItems} recetas para "${this.currentSearchTerm}"`
            : `No se encontraron recetas para "${this.currentSearchTerm}"`;
          
          this.messageService.add({
            severity: this.totalItems > 0 ? 'success' : 'warn',
            summary: 'Búsqueda realizada',
            detail: message,
            life: 3000
          });
        },
        error: (error) => {
          console.error('Error en búsqueda:', error);
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al buscar recetas',
            life: 5000
          });
        }
      });
    } else {
      // Si no hay búsqueda, cargar todos los platos
      this.loadAllPlatos();
    }
  }

  loadInitialData(): void {
    this.loading = true;
    
    // Cargar datos para filtros
    this.publicDataUseCase.getAllCategorias().subscribe({
      next: (categorias) => this.categorias = categorias,
      error: (error) => console.error('Error loading categorias:', error)
    });
    
    this.publicDataUseCase.getAllRegiones().subscribe({
      next: (regiones) => {
        this.regiones = regiones;
        console.log('Regiones cargadas:', regiones.length);
        this.loadProvincias();
      },
      error: (error) => console.error('Error loading regiones:', error)
    });
    
    // Cargar platos (búsqueda o todos)
    this.performSearch();
  }
  
  loadProvincias(): void {
    this.publicDataUseCase.getAllProvincias().subscribe({
      next: (provincias) => {
        this.provincias = provincias;
        this.provinciasFiltradas = [...provincias];
        console.log('Provincias cargadas:', provincias.length);
      },
      error: (error) => console.error('Error loading provincias:', error)
    });
  }

  // Método para cargar TODOS los platos (cuando no hay búsqueda)
  loadAllPlatos(): void {
    this.loading = true;
    
    const allPlatosFilter: PlatosFilter = {
      page: 0,
      size: 10000 // Número muy grande para obtener todos
    };
    
    this.publicPlatoUseCase.getAllPlatosPublic(allPlatosFilter).subscribe({
      next: (response) => {
        this.allPlatos = response.content;
        this.applyTraditionalFilters();
        this.loading = false;
        
        console.log('Todos los platos cargados:', this.allPlatos.length);
      },
      error: (error) => {
        console.error('Error loading all platos:', error);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar las recetas',
          life: 5000
        });
      }
    });
  }

  // Aplicar filtros tradicionales (categorías, regiones, provincias) sobre los resultados actuales
  private applyTraditionalFilters(): void {
    let filteredPlatos = [...this.allPlatos];
    
    // Aplicar filtros tradicionales si los hay
    if (this.currentFilter.categorias && this.currentFilter.categorias.length > 0) {
      filteredPlatos = filteredPlatos.filter(plato => 
        this.currentFilter.categorias!.includes(plato.categoria.id)
      );
    }
    
    if (this.currentFilter.regiones && this.currentFilter.regiones.length > 0) {
      filteredPlatos = filteredPlatos.filter(plato => 
        this.currentFilter.regiones!.includes(plato.region.id)
      );
    }
    
    if (this.currentFilter.provincias && this.currentFilter.provincias.length > 0) {
      filteredPlatos = filteredPlatos.filter(plato => 
        plato.provincia && this.currentFilter.provincias!.includes(plato.provincia.id)
      );
    }
    
    // Actualizar resultados
    this.filteredPlatos = filteredPlatos;
    this.totalItems = this.filteredPlatos.length;
    this.currentPage = 0; // Resetear a la primera página
    this.updatePagedPlatos();
    
    console.log('Filtros aplicados - Total de recetas:', this.totalItems);
  }

  // Resto de métodos sin cambios significativos...
  onRegionChange(): void {
    console.log('Región seleccionada:', this.selectedRegiones);
    
    if (this.selectedRegiones && this.selectedRegiones.length > 0) {
      const regionIds = this.selectedRegiones.map(r => r.id);
      console.log('IDs de regiones seleccionadas:', regionIds);
      
      this.provinciasFiltradas = this.provincias.filter(provincia => {
        const regionId = provincia.region?.id;
        return regionId && regionIds.includes(regionId);
      });
      
      console.log('Provincias filtradas:', this.provinciasFiltradas.length);
      
      if (this.selectedProvincias && this.selectedProvincias.length > 0) {
        this.selectedProvincias = this.selectedProvincias.filter(p =>
          this.provinciasFiltradas.some(pf => pf.id === p.id)
        );
        console.log('Provincias seleccionadas después del filtro:', this.selectedProvincias.length);
      }
    } else {
      this.provinciasFiltradas = [...this.provincias];
      console.log('No hay regiones seleccionadas, mostrando todas las provincias:', this.provinciasFiltradas.length);
    }
    
    this.checkActiveFilters();
  }

  onCategoriaChange(): void {
    this.checkActiveFilters();
  }

  onProvinciaChange(): void {
    this.checkActiveFilters();
  }

  checkActiveFilters(): void {
    this.hasActiveFilters = (this.selectedCategorias && this.selectedCategorias.length > 0) || 
                          (this.selectedRegiones && this.selectedRegiones.length > 0) || 
                          (this.selectedProvincias && this.selectedProvincias.length > 0);
  }

  validateFilters(): boolean {
    if (!this.hasActiveFilters) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Sin filtros seleccionados',
        detail: 'Selecciona al menos un filtro para buscar recetas específicas',
        life: 4500
      });
      return false;
    }

    if (this.selectedRegiones && this.selectedRegiones.length > 0 && this.provinciasFiltradas.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error en filtros',
        detail: 'Las regiones seleccionadas no tienen provincias disponibles',
        life: 5000
      });
      return false;
    }

    return true;
  }

  applyFilters(): void {
    if (!this.validateFilters()) {
      return;
    }

    // Crear el filtro
    this.currentFilter = {};
    
    if (this.selectedCategorias && this.selectedCategorias.length > 0) {
      this.currentFilter.categorias = this.selectedCategorias.map(c => c.id);
    }
    
    if (this.selectedRegiones && this.selectedRegiones.length > 0) {
      this.currentFilter.regiones = this.selectedRegiones.map(r => r.id);
    }
    
    if (this.selectedProvincias && this.selectedProvincias.length > 0) {
      this.currentFilter.provincias = this.selectedProvincias.map(p => p.id);
    }
    
    console.log('Aplicando filtros:', this.currentFilter);
    
    // Aplicar filtros tradicionales
    this.applyTraditionalFilters();

    this.messageService.add({
      severity: 'success',
      summary: 'Filtros aplicados',
      detail: `Se encontraron ${this.totalItems} recetas`,
      life: 3000
    });
  }

  clearFilters(): void {
    const hadFilters = this.hasActiveFilters;
    const hadSearch = this.hasActiveSearch;
    
    if (!hadFilters && !hadSearch) {
      this.messageService.add({
        severity: 'info',
        summary: 'Sin filtros activos',
        detail: 'No hay filtros para limpiar',
        life: 3500
      });
      return;
    }

    // Limpiar filtros tradicionales
    this.selectedCategorias = [];
    this.selectedRegiones = [];
    this.selectedProvincias = [];
    this.provinciasFiltradas = [...this.provincias];
    this.hasActiveFilters = false;
    this.currentFilter = {};
    
    // Limpiar búsqueda
    this.currentSearchTerm = '';
    this.hasActiveSearch = false;
    
    // Limpiar parámetros de la URL
    this.router.navigate(['/recetas']);
    
    // Cargar todos los platos
    this.loadAllPlatos();

    this.messageService.add({
      severity: 'success',
      summary: 'Filtros limpiados',
      detail: 'Se han eliminado todos los filtros y la búsqueda',
      life: 3000
    });
  }

  onPageChange(event: any): void {
    console.log('Cambio de página:', event);
    this.currentPage = event.page;
    this.updatePagedPlatos();
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  updatePagedPlatos(): void {
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedPlatos = this.filteredPlatos.slice(startIndex, endIndex);
    
    console.log(`Página ${this.currentPage + 1}: mostrando platos ${startIndex + 1}-${Math.min(endIndex, this.totalItems)} de ${this.totalItems}`);
  }

  goToRecetaDetalle(plato: Plato): void {
    this.router.navigate(['/receta', plato.id]);
  }

  getImageUrl(plato: Plato): string {
    return plato.imageUrl || 'assets/images/placeholders/plato-placeholder.avif';
  }

  getProvinciaPlaceholder(): string {
    if (this.selectedRegiones && this.selectedRegiones.length > 0) {
      return this.provinciasFiltradas.length > 0 
        ? 'Selecciona provincias de la región' 
        : 'No hay provincias disponibles';
    }
    return 'Selecciona provincias';
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get hasNextPage(): boolean {
    return this.currentPage < this.totalPages - 1;
  }

  get hasPreviousPage(): boolean {
    return this.currentPage > 0;
  }

  get startIndex(): number {
    return this.currentPage * this.itemsPerPage + 1;
  }

  get endIndex(): number {
    return Math.min((this.currentPage + 1) * this.itemsPerPage, this.totalItems);
  }

  trackByPlatoId(index: number, plato: Plato): number {
    return plato.id;
  }
}