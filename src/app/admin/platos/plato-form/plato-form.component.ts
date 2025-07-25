import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PlatoUseCase } from '../../../core/domain/use-cases/plato.usecase';
import { CategoriaUseCase } from '../../../core/domain/use-cases/categoria.usecase';
import { RegionUseCase } from '../../../core/domain/use-cases/region.usecase';
import { ProvinciaUseCase } from '../../../core/domain/use-cases/provincia.usecase';
import {
  Plato,
  CreatePlatoRequest,
  UpdatePlatoRequest,
} from '../../../core/domain/models/plato.model';
import { Categoria } from '../../../core/domain/models/categoria.model';
import { Region } from '../../../core/domain/models/region.model';
import { Provincia } from '../../../core/domain/models/provincia.model';

@Component({
  selector: 'app-plato-form',
  standalone: false,
  templateUrl: './plato-form.component.html',
  styleUrl: './plato-form.component.scss',
})
export class PlatoFormComponent implements OnInit {
  platoForm: FormGroup;
  isEditMode: boolean = false;
  platoId: number | null = null;
  loading: boolean = false;

  categorias: Categoria[] = [];
  regiones: Region[] = [];
  provincias: Provincia[] = [];
  provinciasFiltradas: Provincia[] = [];

  constructor(
    private fb: FormBuilder,
    private platoUseCase: PlatoUseCase,
    private categoriaUseCase: CategoriaUseCase,
    private regionUseCase: RegionUseCase,
    private provinciaUseCase: ProvinciaUseCase,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.platoForm = this.fb.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(200),
        ],
      ],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      ingredientes: ['', [Validators.required, Validators.minLength(10)]],
      preparacion: this.fb.array([this.fb.control('', Validators.required)]),
      porciones: [
        1,
        [Validators.required, Validators.min(1), Validators.max(20)],
      ],
      imageUrl: [''],
      categoriaId: [null, [Validators.required]],
      regionId: [null, [Validators.required]],
      provinciaId: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadInitialData();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.platoId = +id;
      this.loadPlato(this.platoId);
    }

    // Listener para filtrar provincias cuando cambia la región
    this.platoForm.get('regionId')?.valueChanges.subscribe((regionId) => {
      if (regionId) {
        this.filterProvinciasByRegion(regionId);
        this.platoForm.get('provinciaId')?.setValue(null);
      }
    });
  }

  get preparacionArray(): FormArray {
    return this.platoForm.get('preparacion') as FormArray;
  }

  loadInitialData(): void {
    // Cargar categorías
    this.categoriaUseCase.getAllCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
      },
      error: (error) => {
        console.error('Error loading categorías:', error);
      },
    });

    // Cargar regiones
    this.regionUseCase.getAllRegiones().subscribe({
      next: (regiones) => {
        this.regiones = regiones;
      },
      error: (error) => {
        console.error('Error loading regiones:', error);
      },
    });

    // Cargar todas las provincias
    this.provinciaUseCase.getAllProvincias().subscribe({
      next: (provincias) => {
        this.provincias = provincias;
      },
      error: (error) => {
        console.error('Error loading provincias:', error);
      },
    });
  }

  filterProvinciasByRegion(regionId: number): void {
    this.provinciasFiltradas = this.provincias.filter(
      (p) => p.region?.id === regionId
    );
  }

  loadPlato(id: number): void {
    this.loading = true;
    this.platoUseCase.getPlatoById(id).subscribe({
      next: (plato) => {
        // Primero filtrar las provincias por región
        this.filterProvinciasByRegion(plato.region.id);

        // Limpiar el FormArray de preparación
        while (this.preparacionArray.length !== 0) {
          this.preparacionArray.removeAt(0);
        }

        // Agregar los pasos de preparación
        plato.preparacion.forEach((paso) => {
          this.preparacionArray.push(
            this.fb.control(paso, Validators.required)
          );
        });

        this.platoForm.patchValue({
          nombre: plato.nombre,
          descripcion: plato.descripcion,
          ingredientes: plato.ingredientes,
          porciones: plato.porciones,
          imageUrl: plato.imageUrl,
          categoriaId: plato.categoria.id,
          regionId: plato.region.id,
          provinciaId: plato.provincia.id,
        });

        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading plato:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar el plato',
        });
        this.loading = false;
        this.navigateBack();
      },
    });
  }

  addPreparacionStep(): void {
    this.preparacionArray.push(this.fb.control('', Validators.required));
  }

  removePreparacionStep(index: number): void {
    if (this.preparacionArray.length > 1) {
      this.preparacionArray.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.platoForm.valid) {
      this.loading = true;
      const formValue = this.platoForm.value;

      if (this.isEditMode && this.platoId) {
        const updateRequest: UpdatePlatoRequest = {
          id: this.platoId,
          nombre: formValue.nombre,
          descripcion: formValue.descripcion,
          ingredientes: formValue.ingredientes,
          preparacion: formValue.preparacion,
          porciones: formValue.porciones,
          imageUrl: formValue.imageUrl || undefined,
          categoriaId: formValue.categoriaId,
          regionId: formValue.regionId,
          provinciaId: formValue.provinciaId,
        };

        this.platoUseCase.updatePlato(updateRequest).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Plato actualizado correctamente',
            });
            this.navigateBack();
          },
          error: (error) => {
            console.error('Error updating plato:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al actualizar el plato',
            });
            this.loading = false;
          },
        });
      } else {
        const createRequest: CreatePlatoRequest = {
          nombre: formValue.nombre,
          descripcion: formValue.descripcion,
          ingredientes: formValue.ingredientes,
          preparacion: formValue.preparacion,
          porciones: formValue.porciones,
          imageUrl: formValue.imageUrl || undefined,
          categoriaId: formValue.categoriaId,
          regionId: formValue.regionId,
          provinciaId: formValue.provinciaId,
        };

        this.platoUseCase.createPlato(createRequest).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Plato creado correctamente',
            });
            this.navigateBack();
          },
          error: (error) => {
            console.error('Error creating plato:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al crear el plato',
            });
            this.loading = false;
          },
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.platoForm.controls).forEach((key) => {
      const control = this.platoForm.get(key);
      control?.markAsTouched();
      if (control instanceof FormArray) {
        control.controls.forEach((c) => c.markAsTouched());
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.platoForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.platoForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return 'Este campo es requerido';
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `Debe tener al menos ${requiredLength} caracteres`;
      }
      if (field.errors['maxlength']) {
        const requiredLength = field.errors['maxlength'].requiredLength;
        return `No puede tener más de ${requiredLength} caracteres`;
      }
      if (field.errors['min']) {
        return 'Debe ser mayor a 0';
      }
      if (field.errors['max']) {
        return 'No puede ser mayor a 20';
      }
    }
    return '';
  }

  navigateBack(): void {
    this.router.navigate(['/admin/platos']);
  }
}
