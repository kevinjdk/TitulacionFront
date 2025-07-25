import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CategoriaUseCase } from '../../../core/domain/use-cases/categoria.usecase';
import {
  Categoria,
  CreateCategoriaRequest,
  UpdateCategoriaRequest,
} from '../../../core/domain/models/categoria.model';

@Component({
  selector: 'app-categoria-form',
  standalone: false,
  templateUrl: './categoria-form.component.html',
  styleUrl: './categoria-form.component.scss',
})
export class CategoriaFormComponent implements OnInit {
  categoriaForm: FormGroup;
  isEditMode: boolean = false;
  categoriaId: number | null = null;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private categoriaUseCase: CategoriaUseCase,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.categoriaForm = this.fb.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.categoriaId = +id;
      this.loadCategoria(this.categoriaId);
    }
  }

  loadCategoria(id: number): void {
    this.loading = true;
    this.categoriaUseCase.getCategoriaById(id).subscribe({
      next: (categoria) => {
        this.categoriaForm.patchValue({
          nombre: categoria.nombre,
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categoría:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar la categoría',
        });
        this.loading = false;
        this.navigateBack();
      },
    });
  }

  onSubmit(): void {
    if (this.categoriaForm.valid) {
      this.loading = true;
      const formValue = this.categoriaForm.value;

      if (this.isEditMode && this.categoriaId) {
        const updateRequest: UpdateCategoriaRequest = {
          id: this.categoriaId,
          nombre: formValue.nombre,
        };

        this.categoriaUseCase.updateCategoria(updateRequest).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Categoría actualizada correctamente',
            });
            this.navigateBack();
          },
          error: (error) => {
            console.error('Error updating categoría:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al actualizar la categoría',
            });
            this.loading = false;
          },
        });
      } else {
        const createRequest: CreateCategoriaRequest = {
          nombre: formValue.nombre,
        };

        this.categoriaUseCase.createCategoria(createRequest).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Categoría creada correctamente',
            });
            this.navigateBack();
          },
          error: (error) => {
            console.error('Error creating categoría:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al crear la categoría',
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
    Object.keys(this.categoriaForm.controls).forEach((key) => {
      const control = this.categoriaForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.categoriaForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.categoriaForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return 'Este campo es requerido';
      }
      if (field.errors['minlength']) {
        return 'El nombre debe tener al menos 2 caracteres';
      }
      if (field.errors['maxlength']) {
        return 'El nombre no puede tener más de 100 caracteres';
      }
    }
    return '';
  }

  navigateBack(): void {
    this.router.navigate(['/admin/categorias']);
  }
}
