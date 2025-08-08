import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicPlatoUseCase } from '../../core/domain/use-cases/public-plato.usecase';
import { Plato } from '../../core/domain/models/plato.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-receta-detalle',
  standalone: false,
  templateUrl: './receta-detalle.component.html',
  styleUrls: ['./receta-detalle.component.scss']
})
export class RecetaDetalleComponent implements OnInit {
  plato: Plato | null = null;
  loading = false;
  error = false;
  ingredientesList: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private publicPlatoUseCase: PublicPlatoUseCase
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadPlato(id);
      } else {
        this.error = true;
      }
    });
  }

  loadPlato(id: number): void {
    this.loading = true;
    this.error = false;

    this.publicPlatoUseCase.getPlatoByIdPublic(id).subscribe({
      next: (plato) => {
        this.plato = plato;
        this.processIngredientes();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading plato:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  processIngredientes(): void {
    if (this.plato?.ingredientes) {
      // Separar ingredientes por líneas o por punto y coma
      this.ingredientesList = this.plato.ingredientes
        .split(/\n|;/)
        .map(ing => ing.trim())
        .filter(ing => ing.length > 0);
    }
  }

  goBack(): void {
    this.location.back();
  }

  goToRecetas(): void {
    this.router.navigate(['/recetas']);
  }

  getImageUrl(): string {
    return this.plato?.imageUrl || 'assets/images/placeholders/plato-placeholder.avif';
  }
}
//funcional