import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnuncioService } from '../../services/anuncio.service';
import { Anuncio } from '../../types/anuncio';

@Component({
  selector: 'app-anuncios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './anuncios.component.html',
  styleUrls: ['./anuncios.component.css']
})
export class AnunciosComponent implements OnInit {
  anuncios: Anuncio[] = [];
  anunciosFiltrados: Anuncio[] = [];
  filtroTexto: string = '';
  filtroEstado: string = '';
  estadosDisponibles: string[] = ['activo', 'inactivo', 'urgente', 'importante'];
  anunciosExpandidos: Set<number> = new Set();
  longitudPreview: number = 150;

  constructor(private anuncioService: AnuncioService) {}

  ngOnInit(): void {
    this.cargarAnuncios();
  }

  // Obtiene todos los anuncios y los ordena por fecha de creación descendente
  cargarAnuncios(): void {
    this.anuncioService.get().subscribe({
      next: (data) => {
        this.anuncios = this.ordenarPorCreacion(data);
        this.aplicarFiltros();
      },
      error: (err) => {
        console.error('Error cargando anuncios', err);
      }
    });
  }

  // Ordena los anuncios para mostrar primero el más reciente
  private ordenarPorCreacion(anuncios: Anuncio[]): Anuncio[] {
    return anuncios.sort((a, b) => b.id - a.id);
  }

  // Aplica filtros de texto y estado a la lista de anuncios
  aplicarFiltros(): void {
    this.anunciosFiltrados = this.anuncios.filter(anuncio => {
      const coincideTexto = !this.filtroTexto || 
        anuncio.nombre.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
        anuncio.contenido.toLowerCase().includes(this.filtroTexto.toLowerCase());
      
      const coincideEstado = !this.filtroEstado || anuncio.estado === this.filtroEstado;
      
      return coincideTexto && coincideEstado;
    });
  }

  // Limpia todos los filtros aplicados
  limpiarFiltros(): void {
    this.filtroTexto = '';
    this.filtroEstado = '';
    this.aplicarFiltros();
  }

  // Cuenta anuncios por estado específico
  contarPorEstado(estado: string): number {
    return this.anuncios.filter(anuncio => anuncio.estado === estado).length;
  }

  // Alterna el estado de expansión de un anuncio específico
  alternarExpansion(anuncioId: number): void {
    if (this.anunciosExpandidos.has(anuncioId)) {
      this.anunciosExpandidos.delete(anuncioId);
    } else {
      this.anunciosExpandidos.add(anuncioId);
    }
  }

  // Verifica si un anuncio está expandido
  estaExpandido(anuncioId: number): boolean {
    return this.anunciosExpandidos.has(anuncioId);
  }

  // Obtiene el contenido a mostrar según el estado de expansión
  obtenerContenidoMostrado(anuncio: Anuncio): string {
    if (this.estaExpandido(anuncio.id) || anuncio.contenido.length <= this.longitudPreview) {
      return anuncio.contenido;
    }
    // Buscar el último espacio antes del límite para no cortar palabras
    const textoTruncado = anuncio.contenido.substring(0, this.longitudPreview);
    const ultimoEspacio = textoTruncado.lastIndexOf(' ');
    
    if (ultimoEspacio > this.longitudPreview * 0.7) {
      return textoTruncado.substring(0, ultimoEspacio) + '...';
    }
    return textoTruncado + '...';
  }

  // Verifica si el contenido necesita botón "Ver más"
  necesitaVerMas(contenido: string): boolean {
    return contenido.length > this.longitudPreview;
  }
}