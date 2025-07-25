import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ProvinciaUseCase } from '../../../core/domain/use-cases/provincia.usecase';
import { RegionUseCase } from '../../../core/domain/use-cases/region.usecase';
import {
  Provincia,
  CreateProvinciaRequest,
  UpdateProvinciaRequest,
} from '../../../core/domain/models/provincia.model';
import { Region } from '../../../core/domain/models/region.model';

@Component({
  selector: 'app-provincia-form',
  standalone: false,
  templateUrl: './provincia-form.component.html',
  styleUrl: './provincia-form.component.scss',
})
export class ProvinciaFormComponent implements OnInit {
  provinciaForm: FormGroup;
  isEditMode: boolean = false;
  provinciaId: number | null = null;
  loading: boolean = false;
  regiones: Region[] = [];

  constructor(
    private fb: FormBuilder,
    private provinciaUseCase: ProvinciaUseCase,
    private regionUseCase: RegionUseCase,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.provinciaForm = this.fb.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],
      regionId: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadRegiones();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.provinciaId = +id;
      this.loadProvincia(this.provinciaId);
    }
  }

  loadRegiones(): void {
    this.regionUseCase.getAllRegiones().subscribe({
      next: (regiones) => {
        this.regiones = regiones;
      },
      error: (error) => {
        console.error('Error loading regiones:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar las regiones',
        });
      },
    });
  }

  loadProvincia(id: number): void {
    this.loading = true;
    this.provinciaUseCase.getProvinciaById(id).subscribe({
      next: (provincia) => {
        this.provinciaForm.patchValue({
          nombre: provincia.nombre,
          regionId: provincia.region?.id,
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading provincia:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar la provincia',
        });
        this.loading = false;
        this.navigateBack();
      },
    });
  }

  onSubmit(): void {
    if (this.provinciaForm.valid) {
      this.loading = true;
      const formValue = this.provinciaForm.value;

      if (this.isEditMode && this.provinciaId) {
        const updateRequest: UpdateProvinciaRequest = {
          id: this.provinciaId,
          nombre: formValue.nombre,
          regionId: formValue.regionId,
        };

        this.provinciaUseCase.updateProvincia(updateRequest).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Provincia actualizada correctamente',
            });
            this.navigateBack();
          },
          error: (error) => {
            console.error('Error updating provincia:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al actualizar la provincia',
            });
            this.loading = false;
          },
        });
      } else {
        const createRequest: CreateProvinciaRequest = {
          nombre: formValue.nombre,
          regionId: formValue.regionId,
        };

        this.provinciaUseCase.createProvincia(createRequest).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Provincia creada correctamente',
            });
            this.navigateBack();
          },
          error: (error) => {
            console.error('Error creating provincia:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al crear la provincia',
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
    Object.keys(this.provinciaForm.controls).forEach((key) => {
      const control = this.provinciaForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.provinciaForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.provinciaForm.get(fieldName);
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
    this.router.navigate(['/admin/provincias']);
  }
}
