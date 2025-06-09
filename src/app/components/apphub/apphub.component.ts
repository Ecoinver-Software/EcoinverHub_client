import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Interfaces
interface Aplicacion {
  id: string;
  nombre: string;
  descripcion: string;
  urlImagen: string;
  categoria?: string;
  version?: string;
  autor?: string;
  estado: 'produccion' | 'desarrollo' | 'proximamente';
  etiquetas?: string[];
  fechaActualizacion?: Date;
  url?: string;
}

interface ConfiguracionHub {
  titulo: string;
  subtitulo?: string;
  aplicaciones: Aplicacion[];
  mostrarBusqueda?: boolean;
  tarjetasPorFila?: number;
}

@Component({
  selector: 'hub-aplicaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apphub.component.html',
  styleUrls: ['./apphub.component.css']
})
export class AppHubComponent implements OnInit {
  
  @Input() configuracion: ConfiguracionHub = {
    titulo: 'Hub de Aplicaciones',
    subtitulo: 'Descubre y gestiona todas tus aplicaciones desde un solo lugar',
    aplicaciones: [],
    mostrarBusqueda: true,
    tarjetasPorFila: 4
  };

  @Output() aplicacionSeleccionada = new EventEmitter<Aplicacion>();
  @Output() aplicacionAccedida = new EventEmitter<Aplicacion>();
  @Output() busquedaCambiada = new EventEmitter<string>();

  terminoBusqueda: string = '';
  aplicacionesFiltradas: Aplicacion[] = [];

  // Aplicaciones disponibles en Ecoinver Cloud
  private aplicacionesDisponibles: Aplicacion[] = [
    {
      id: '1',
      nombre: 'GMAO',
      descripcion: 'Sistema de gestión de mantenimiento asistido por ordenador para optimizar recursos y maximizar la eficiencia operativa',
      urlImagen: '/assets/GMAOimg.png',
      categoria: 'Gestión',
      version: '0.0.0',
      autor: 'Ecoinver Software Team',
      estado: 'proximamente',
      etiquetas: ['mantenimiento', 'gestión', 'eficiencia', 'preventivo'],
      fechaActualizacion: new Date('2025-06-04'),
      url: '/gmao'
    },
    {
      id: '2',
      nombre: 'Ecoinver Assistant',
      descripcion: 'Asistente de inteligencia artificial local para consultas y soporte técnico especializado',
      urlImagen: '/assets/EcoinverAssistant.png',
      categoria: 'IA',
      version: '0.9.0',
      autor: 'Ecoinver Software Team',
      estado: 'desarrollo',
      etiquetas: ['IA', 'asistente', 'consultas', 'soporte'],
      fechaActualizacion: new Date('2025-06-03'),
      url: '/assistant'
    },
    {
      id: '3',
      nombre: 'Cultive Cloud',
      descripcion: 'Plataforma integral de gestión agrícola con monitoreo IoT y análisis predictivo avanzado',
      urlImagen: '/assets/CultiveCloudFull.png',
      categoria: 'Agricultura',
      version: '1.1.0',
      autor: 'Ecoinver Software Team',
      estado: 'produccion',
      etiquetas: ['agricultura', 'monitoreo', 'predictivo'],
      fechaActualizacion: new Date('2025-05-28'),
      url: '/cultive-cloud'
    }
  ];

  ngOnInit() {
    // Si no hay aplicaciones configuradas, usar las aplicaciones disponibles
    if (!this.configuracion.aplicaciones || this.configuracion.aplicaciones.length === 0) {
      this.configuracion.aplicaciones = this.aplicacionesDisponibles;
    }
    
    this.aplicacionesFiltradas = this.configuracion.aplicaciones;
  }

  // Maneja los cambios en la búsqueda
  alCambiarBusqueda() {
    this.filtrarAplicaciones();
    this.busquedaCambiada.emit(this.terminoBusqueda);
  }

  // Filtra las aplicaciones según el término de búsqueda
  private filtrarAplicaciones() {
    this.aplicacionesFiltradas = this.configuracion.aplicaciones.filter(aplicacion => {
      const coincideBusqueda = !this.terminoBusqueda || 
        aplicacion.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        aplicacion.descripcion.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        (aplicacion.etiquetas && aplicacion.etiquetas.some(etiqueta => 
          etiqueta.toLowerCase().includes(this.terminoBusqueda.toLowerCase())));

      return coincideBusqueda;
    });
  }

  // Limpia todos los filtros aplicados
  limpiarFiltros() {
    this.terminoBusqueda = '';
    this.aplicacionesFiltradas = this.configuracion.aplicaciones;
    this.busquedaCambiada.emit(this.terminoBusqueda);
  }

  // Maneja el clic en una aplicación
  alHacerClicEnAplicacion(aplicacion: Aplicacion) {
    this.aplicacionSeleccionada.emit(aplicacion);
  }

  // Maneja el acceso a una aplicación
  alAccederAplicacion(aplicacion: Aplicacion) {
    if (aplicacion.estado === 'produccion' || aplicacion.estado === 'desarrollo') {
      this.aplicacionAccedida.emit(aplicacion);
      // Si tiene URL, navegar directamente
      if (aplicacion.url) {
        window.open(aplicacion.url, '_blank');
      }
    }
  }

  // Obtiene la cantidad de aplicaciones en producción
  obtenerContadorAplicacionesProduccion(): number {
    return this.configuracion.aplicaciones.filter(app => app.estado === 'produccion').length;
  }

  // Obtiene la cantidad de aplicaciones en desarrollo
  obtenerContadorAplicacionesDesarrollo(): number {
    return this.configuracion.aplicaciones.filter(app => app.estado === 'desarrollo').length;
  }

  // Obtiene la inicial del nombre de la aplicación
  obtenerInicialAplicacion(nombreAplicacion: string): string {
    return nombreAplicacion.charAt(0).toUpperCase();
  }

  // Obtiene la inicial del autor
  obtenerInicialAutor(autor: string): string {
    return autor.charAt(0).toUpperCase();
  }

  // Obtiene las clases CSS para el botón simple según el estado
  obtenerClasesBotonSimple(estado: string): string {
    switch (estado) {
      case 'produccion':
        return 'bg-green-100 hover:bg-green-200 text-green-800 border border-green-200';
      case 'desarrollo':
        return 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border border-yellow-200';
      case 'proximamente':
        return 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200';
      default:
        return 'bg-gray-100 text-gray-500 border border-gray-200';
    }
  }

  // Obtiene el texto de la acción según el estado
  obtenerTextoAccion(estado: string): string {
    switch (estado) {
      case 'produccion':
        return 'Entrar';
      case 'desarrollo':
        return 'Probar';
      case 'proximamente':
        return 'Próximamente';
      default:
        return 'No disponible';
    }
  }

  // Obtiene las clases CSS para el estado de la aplicación
  obtenerClasesEstado(estado: string): string {
    switch (estado) {
      case 'produccion':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'desarrollo':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'proximamente':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  }

  // Obtiene las clases CSS para el badge de estado
  obtenerClasesEstadoBadge(estado: string): string {
    switch (estado) {
      case 'desarrollo':
        return 'bg-orange-500 text-white';
      case 'proximamente':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  }

  // Obtiene el texto del badge de estado
  obtenerTextoEstadoBadge(estado: string): string {
    switch (estado) {
      case 'desarrollo':
        return 'BETA';
      case 'proximamente':
        return 'SOON';
      default:
        return 'N/A';
    }
  }

  // Obtiene las clases CSS para el estado compacto
  obtenerClasesEstadoCompacto(estado: string): string {
    switch (estado) {
      case 'produccion':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300';
      case 'desarrollo':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300';
      case 'proximamente':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  }

  // Obtiene el texto del estado compacto
  obtenerTextoEstadoCompacto(estado: string): string {
    switch (estado) {
      case 'produccion':
        return 'Disponible';
      case 'desarrollo':
        return 'Beta';
      case 'proximamente':
        return 'Próximamente';
      default:
        return 'N/A';
    }
  }
}