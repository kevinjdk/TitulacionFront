// header.component.ts - Usando tu arquitectura existente
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.setupSearch();
    this.setupRouteListener();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearch() {
    // Configurar búsqueda con debounce para escritura automática
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500), // Aumentamos a 500ms para evitar muchas peticiones
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(searchTerm => {
        const cleanTerm = searchTerm?.trim() || '';
        
        // Si estamos en la página de recetas y hay término, actualizar URL
        if (this.router.url.includes('/recetas') && cleanTerm) {
          this.updateSearchUrl(cleanTerm);
        }
      });
  }

  private setupRouteListener() {
    // Escuchar cambios de ruta para obtener parámetros de búsqueda de la URL
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.activatedRoute.queryParams
          .pipe(takeUntil(this.destroy$))
          .subscribe(params => {
            const searchParam = params['search'] || '';
            
            // Actualizar el FormControl sin emitir eventos para evitar bucles
            if (this.searchControl.value !== searchParam) {
              this.searchControl.setValue(searchParam, { emitEvent: false });
            }
          });
      });
  }

  private updateSearchUrl(searchTerm: string) {
    this.router.navigate(['/recetas'], {
      queryParams: { search: searchTerm },
      queryParamsHandling: 'merge'
    });
  }

  onSearchSubmit() {
    const searchTerm = this.searchControl.value?.trim();
    
    if (searchTerm) {
      console.log('Búsqueda enviada:', searchTerm);
      
      // Navegar a recetas con el parámetro de búsqueda
      this.router.navigate(['/recetas'], {
        queryParams: { search: searchTerm }
      });
    } else {
      // Si no hay término, ir a recetas sin filtros
      this.router.navigate(['/recetas']);
    }
  }

  navigateTo(route: string) {
    // Limpiar búsqueda solo si navegamos fuera de recetas
    if (route !== '/recetas') {
      this.clearSearch();
    }
    this.router.navigate([route]);
  }

  clearSearch() {
    this.searchControl.setValue('', { emitEvent: false });
    
    if (this.router.url.includes('/recetas')) {
      this.router.navigate(['/recetas']);
    }
  }

  // Método para verificar si estamos en una ruta específica
  isActiveRoute(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + '?');
  }
}