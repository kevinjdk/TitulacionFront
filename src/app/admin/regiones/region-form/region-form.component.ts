import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { RegionUseCase } from '../../../core/domain/use-cases/region.usecase';
import {
  Region,
  CreateRegionRequest,
  UpdateRegionRequest,
} from '../../../core/domain/models/region.model';

@Component({
  selector: 'app-region-form',
  standalone: false,
  templateUrl: './region-form.component.html',
  styleUrl: './region-form.component.scss',
})
export class RegionFormComponent implements OnInit {
  regionForm: FormGroup;
  isEditMode: boolean = false;
  regionId: number | null = null;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private regionUseCase: RegionUseCase,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.regionForm = this.fb.group({
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
      this.regionId = +id;
      this.loadRegion(this.regionId);
    }
  }

  loadRegion(id: number): void {
    this.loading = true;
    this.regionUseCase.getRegionById(id).subscribe({
      next: (region) => {
        this.regionForm.patchValue({
          nombre: region.nombre,
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading región:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar la región',
        });
        this.loading = false;
        this.navigateBack();
      },
    });
  }

  onSubmit(): void {
    if (this.regionForm.valid) {
      this.loading = true;
      const formValue = this.regionForm.value;

      if (this.isEditMode && this.regionId) {
        const updateRequest: UpdateRegionRequest = {
          id: this.regionId,
          nombre: formValue.nombre,
        };

        this.regionUseCase.updateRegion(updateRequest).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Región actualizada correctamente',
            });
            this.navigateBack();
          },
          error: (error) => {
            console.error('Error updating región:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al actualizar la región',
            });
            this.loading = false;
          },
        });
      } else {
        const createRequest: CreateRegionRequest = {
          nombre: formValue.nombre,
        };

        this.regionUseCase.createRegion(createRequest).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Región creada correctamente',
            });
            this.navigateBack();
          },
          error: (error) => {
            console.error('Error creating región:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al crear la región',
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
    Object.keys(this.regionForm.controls).forEach((key) => {
      const control = this.regionForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.regionForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.regionForm.get(fieldName);
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
    this.router.navigate(['/admin/regiones']);
  }
}
