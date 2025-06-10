import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnuncioService } from '../../services/anuncio.service';
import { Anuncio } from '../../types/anuncio';

@Component({
  selector: 'app-editor-anuncios',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './editor-anuncios.component.html'
})
export class EditorAnunciosComponent implements OnInit {
  anuncios: Anuncio[] = [];
  form: FormGroup;
  isEditing: boolean = false;
  editingId: number | null = null;

    expandedCards: Set<string> = new Set();


  constructor(
    private anuncioService: AnuncioService,
    private fb: FormBuilder
  ) {
    // Inicializamos el FormGroup con campos y validaciones básicas
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      estado: ['', [Validators.required]],
      contenido: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    this.loadAnuncios();
  }

  // Obtener todos los anuncios desde el backend
  loadAnuncios(): void {
    this.anuncioService.get().subscribe({
      next: (data) => {
        this.anuncios = data;
      },
      error: (err) => {
        console.error('Error cargando anuncios', err);
      }
    });
  }

  // Reinicia el formulario al estado inicial (modo "Crear")
  resetForm(): void {
    this.isEditing = false;
    this.editingId = null;
    this.form.reset({
      nombre: '',
      estado: '',
      contenido: ''
    });
  }

  // Maneja el envío del formulario (crear o editar)
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      id: 0, // Valor temporal, el backend debe asignar el id real
      nombre: this.form.value.nombre,
      estado: this.form.value.estado,
      contenido: this.form.value.contenido
    };

    if (this.isEditing && this.editingId !== null) {
      // Editar anuncio existente
      this.anuncioService.put(this.editingId, payload).subscribe({
        next: () => {
          this.loadAnuncios();
          this.resetForm();
        },
        error: (err) => {
          console.error('Error editando anuncio', err);
        }
      });
    } else {
      // Crear nuevo anuncio
      this.anuncioService.post(payload).subscribe({
        next: () => {
          this.loadAnuncios();
          this.resetForm();
        },
        error: (err) => {
          console.error('Error creando anuncio', err);
        }
      });
    }
  }

  // Pasar a modo "Editar": llena el formulario con los valores del anuncio seleccionado
  onEdit(anuncio: Anuncio): void {
    this.isEditing = true;
    this.editingId = anuncio.id;
    this.form.setValue({
      nombre: anuncio.nombre,
      estado: anuncio.estado,
      contenido: anuncio.contenido
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Eliminar un anuncio por ID
  onDelete(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este anuncio?')) {
      return;
    }
    this.anuncioService.delete(id).subscribe({
      next: () => {
        this.loadAnuncios();
      },
      error: (err) => {
        console.error('Error eliminando anuncio', err);
      }
    });
  }


  toggleCardExpansion(anuncioId: string): void {
    if (this.expandedCards.has(anuncioId)) {
      this.expandedCards.delete(anuncioId);
    } else {
      this.expandedCards.add(anuncioId);
    }
  }

  //filtrar al reves para mostrar los anuncios más recientes primero
  getAnunciosAlreves(): Anuncio[] {
    this.anuncios = [...this.anuncios].reverse();
    return this.anuncios;
  }
  
}
