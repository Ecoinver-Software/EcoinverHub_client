import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Interfaces
interface App {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category?: string;
  version?: string;
  author?: string;
  status: 'production' | 'development' | 'coming-soon';
  tags?: string[];
  lastUpdated?: Date;
  url?: string;
}

interface AppHubConfig {
  title: string;
  subtitle?: string;
  apps: App[];
  showSearch?: boolean;
  cardsPerRow?: number;
}

@Component({
  selector: 'app-hub',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apphub.component.html',
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    /* Animaciones personalizadas */
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .animate-slide-up {
      animation: slideUp 0.5s ease-out;
    }
  `]
})
export class AppHubComponent implements OnInit {
  @Input() config: AppHubConfig = {
    title: 'Hub de Aplicaciones',
    subtitle: 'Descubre y gestiona todas tus aplicaciones desde un solo lugar',
    apps: [],
    showSearch: true,
    cardsPerRow: 4
  };

  @Output() appClicked = new EventEmitter<App>();
  @Output() appAccessed = new EventEmitter<App>();
  @Output() searchChanged = new EventEmitter<string>();

  searchTerm: string = '';
  filteredApps: App[] = [];

  // Apps disponibles en Ecoinver Cloud
  private availableApps: App[] = [
    {
      id: '1',
      name: 'GMAO',
      description: 'Sistema de gestión de mantenimiento asistido por ordenador para optimizar recursos y maximizar la eficiencia operativa',
      imageUrl: '/assets/GMAOimg.png',
      category: '',
      version: '0.0.0',
      author: 'Ecoinver Software Team',
      status: 'coming-soon',
      tags: ['mantenimiento', 'gestión', 'eficiencia', 'preventivo'],
      lastUpdated: new Date('2025-06-04'),
      url: '/gmao'
    },
    {
      id: '2',
      name: 'Ecoinver Assistant',
      description: 'Asistente de inteligencia artificial local para consultas y soporte técnico especializado',
      imageUrl: '/assets/EcoinverAssistant.png',
      category: '',
      version: '0.9.0',
      author: 'Ecoinver Software Team',
      status: 'development',
      tags: ['IA', 'asistente', 'consultas', 'soporte'],
      lastUpdated: new Date('2025-06-03'),
      url: '/assistant'
    },
    {
      id: '3',
      name: 'Cultive Cloud',
      description: 'Plataforma integral de gestión agrícola con monitoreo IoT y análisis predictivo avanzado',
      imageUrl: '/assets/CultiveCloudFull.png',
      category: '',
      version: '1.1.0',
      author: 'Ecoinver Software Team',
      status: 'production',
      tags: ['agricultura', 'IoT', 'monitoreo', 'predictivo'],
      lastUpdated: new Date('2025-05-28'),
      url: '/cultive-cloud'
    }
    // Aquí puedes agregar más aplicaciones cuando estén disponibles
    // {
    //   id: '4',
    //   name: 'Nueva App',
    //   description: 'Descripción de la nueva aplicación',
    //   imageUrl: 'URL_DE_LA_IMAGEN',
    //   category: 'Categoría',
    //   version: '1.0.0',
    //   author: 'Equipo Desarrollador',
    //   status: 'development', // 'production' | 'development' | 'coming-soon'
    //   tags: ['tag1', 'tag2'],
    //   lastUpdated: new Date(),
    //   url: '/nueva-app'
    // }
  ];

  ngOnInit() {
    // Si no hay apps configuradas, usar las apps disponibles
    if (!this.config.apps || this.config.apps.length === 0) {
      this.config.apps = this.availableApps;
    }
    
    this.filteredApps = this.config.apps;
  }

  onSearchChange() {
    this.filterApps();
    this.searchChanged.emit(this.searchTerm);
  }

  private filterApps() {
    this.filteredApps = this.config.apps.filter(app => {
      const matchesSearch = !this.searchTerm || 
        app.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        app.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (app.tags && app.tags.some(tag => tag.toLowerCase().includes(this.searchTerm.toLowerCase())));

      return matchesSearch;
    });
  }

  clearFilters() {
    this.searchTerm = '';
    this.filteredApps = this.config.apps;
    this.searchChanged.emit(this.searchTerm);
  }

  onAppClick(app: App) {
    this.appClicked.emit(app);
  }

  onAppAccess(app: App) {
    if (app.status === 'production' || app.status === 'development') {
      this.appAccessed.emit(app);
      // Si tiene URL, navegar directamente
      if (app.url) {
        window.open(app.url, '_blank');
      }
    }
  }

  // Métodos auxiliares para estadísticas
  getProductionAppsCount(): number {
    return this.config.apps.filter(app => app.status === 'production').length;
  }

  getDevelopmentAppsCount(): number {
    return this.config.apps.filter(app => app.status === 'development').length;
  }

  // Métodos auxiliares para el styling basado en status
  getStatusClasses(status: string): string {
    switch (status) {
      case 'production':
        return 'bg-green-100/90 text-green-800 border border-green-200';
      case 'development':
        return 'bg-yellow-100/90 text-yellow-800 border border-yellow-200';
      case 'coming-soon':
        return 'bg-gray-100/90 text-gray-800 border border-gray-200';
      default:
        return 'bg-gray-100/90 text-gray-800 border border-gray-200';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'production':
        return 'Disponible';
      case 'development':
        return 'En desarrollo';
      case 'coming-soon':
        return 'Próximamente';
      default:
        return 'Desconocido';
    }
  }

  getActionText(status: string): string {
    switch (status) {
      case 'production':
        return 'Entrar';
      case 'development':
        return 'Acceso beta';
      case 'coming-soon':
        return 'Próximamente';
      default:
        return 'No disponible';
    }
  }

  getQuickActionClasses(status: string): string {
    switch (status) {
      case 'production':
        return 'bg-green-500/90 hover:bg-green-600 text-white';
      case 'development':
        return 'bg-yellow-500/90 hover:bg-yellow-600 text-white';
      case 'coming-soon':
        return 'bg-gray-200/90 text-gray-500 cursor-not-allowed';
      default:
        return 'bg-gray-200/90 text-gray-500';
    }
  }

  getMainButtonClasses(status: string): string {
    switch (status) {
      case 'production':
        return 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-green-500/25 hover:shadow-green-500/40 hover:scale-105';
      case 'development':
        return 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white shadow-yellow-500/25 hover:shadow-yellow-500/40 hover:scale-105';
      case 'coming-soon':
        return 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none';
      default:
        return 'bg-gray-300 text-gray-500';
    }
  }
}