import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PublicPlatoUseCase } from '../../core/domain/use-cases/public-plato.usecase';
import { Plato } from '../../core/domain/models/plato.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  carouselImages = [
    {
      src: 'assets/images/carousel/cevicheCamaron.png',
      alt: 'Ceviche Ecuatoriano',
      recipeId: 1 // ID de la receta del ceviche
    },
    {
      src: 'assets/images/carousel/coladaMorada.png', 
      alt: 'Colada Morada',
      recipeId: 5 // ID de la receta del encebollado
    },
    {
      src: 'assets/images/carousel/hornado.png',
      alt: 'Hornado',
      recipeId: 6 // ID de la receta del hornado
    },
    {
      src: 'assets/images/carousel/higos.png',
      alt: 'Higos con Queso',
      recipeId: 7 // ID de la receta del caucara
    }
  ];

  // IDs de recetas destacadas - MODIFICAR ESTOS IDs SEGÚN TUS NECESIDADES
  featuredRecipeIds = [2, 3, 4]; // Cambiar por los IDs de las recetas que quieres destacar

  platosDestacados: Plato[] = [];
  isLoading = true;

  // Tarjetas para descubrir recetas
  discoverCards = [
    {
      title: 'Por Región',
      description: 'Costa, Sierra y Amazonía',
      backgroundImage: 'assets/images/cards/region.png'
    },
    {
      title: 'Por Provincia', 
      description: 'Todas las provincias del Ecuador',
      backgroundImage: 'assets/images/cards/provincia.png'
    },
    {
      title: 'Por Categoría',
      description: 'Entradas, platos fuertes y postres',
      backgroundImage: 'assets/images/cards/categoria.png'
    }
  ];

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '768px', 
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  constructor(
    private publicPlatoUseCase: PublicPlatoUseCase,
    public router: Router
  ) {}

  ngOnInit() {
    this.loadPlatosDestacados();
  }

  loadPlatosDestacados() {
    this.isLoading = true;
    
    // Crear array de observables para obtener cada receta por su ID
    const recetaObservables = this.featuredRecipeIds.map(id => 
      this.publicPlatoUseCase.getPlatoByIdPublic(id)
    );

    // Usar forkJoin para ejecutar todas las consultas en paralelo
    forkJoin(recetaObservables).subscribe({
      next: (recetas) => {
        // Filtrar solo las recetas que existen (por si algún ID no existe)
        this.platosDestacados = recetas.filter(receta => receta !== null);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading platos destacados:', error);
        this.isLoading = false;
        // En caso de error, intentar cargar recetas una por una
        this.loadPlatosDestacadosOneByOne();
      }
    });
  }

  // Método alternativo para cargar recetas una por una si forkJoin falla
  private loadPlatosDestacadosOneByOne() {
    this.platosDestacados = [];
    let loadedCount = 0;
    
    this.featuredRecipeIds.forEach((id, index) => {
      this.publicPlatoUseCase.getPlatoByIdPublic(id).subscribe({
        next: (plato) => {
          if (plato) {
            this.platosDestacados.push(plato);
          }
          loadedCount++;
          
          // Si ya procesamos todos los IDs, terminamos la carga
          if (loadedCount === this.featuredRecipeIds.length) {
            this.isLoading = false;
            // Ordenar según el orden original de los IDs
            this.platosDestacados.sort((a, b) => {
              const indexA = this.featuredRecipeIds.indexOf(a.id);
              const indexB = this.featuredRecipeIds.indexOf(b.id);
              return indexA - indexB;
            });
          }
        },
        error: (error) => {
          console.error(`Error loading plato ${id}:`, error);
          loadedCount++;
          
          if (loadedCount === this.featuredRecipeIds.length) {
            this.isLoading = false;
          }
        }
      });
    });
  }

  // Método para navegar a la receta desde el carrusel
  navigateToRecipeFromCarousel(recipeId: number) {
    this.router.navigate(['/receta', recipeId]).then(() => {
      window.scrollTo(0, 0);
    });
  }

  // Método simplificado para navegar a recetas
  navigateToRecetas() {
    this.router.navigate(['/recetas']).then(() => {
      window.scrollTo(0, 0);
    });
  }

  viewRecipe(platoId: number) {
    this.router.navigate(['/receta', platoId]).then(() => {
      window.scrollTo(0, 0);
    });
  }

  getSeverity(categoria: string): string {
    switch (categoria.toLowerCase()) {
      case 'entrada': return 'success';
      case 'plato fuerte': return 'info';
      case 'postre': return 'warning';
      case 'bebida': return 'danger';
      default: return 'secondary';
    }
  }
}