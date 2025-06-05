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
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div class="w-full max-w-none px-3 xs:px-4 sm:px-6 md:px-8 lg:px-8 xl:px-12 2xl:px-16 py-4 xs:py-6 sm:py-8 lg:py-12">
        
        <!-- Header optimizado con estilo Ecoinver -->
        <div class="mb-6 xs:mb-8 sm:mb-10 md:mb-12 lg:mb-16">
          <div class="flex flex-col space-y-3 xs:space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div class="text-center sm:text-left">
              <h1 class="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extralight text-gray-900 dark:text-white mb-2 xs:mb-3 tracking-tight">
                {{ config.title }}
              </h1>
              <p *ngIf="config.subtitle" class="text-sm xs:text-base sm:text-lg text-gray-500 dark:text-gray-400 font-light">
                {{ config.subtitle }}
              </p>
            </div>
            <div class="hidden sm:flex items-center justify-center sm:justify-end space-x-4">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{{ filteredApps.length }} apps disponibles</span>
            </div>
          </div>
        </div>

        <!-- Separador decorativo entre apps y footer -->
        <div class="mt-10 xs:mt-12 sm:mt-14 lg:mt-16 mb-6 xs:mb-8 sm:mb-10">
          <div class="flex items-center justify-center">
            <div class="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
            <div class="mx-4 xs:mx-6 sm:mx-8">
              <div class="flex items-center space-x-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
                <span class="text-xs xs:text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Ecosistema Ecoinver Cloud
                </span>
                <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
          </div>
        </div>

        <!-- Apps Grid con estilo glassmorphism -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 xs:gap-5 sm:gap-6 lg:gap-8">
          <div 
            *ngFor="let app of filteredApps; let i = index" 
            class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden cursor-pointer group hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
            (click)="onAppClick(app)"
          >
            <!-- App Image -->
            <div class="relative h-40 xs:h-44 sm:h-48 overflow-hidden">
              <img 
                [src]="app.imageUrl" 
                [alt]="app.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              >
              <!-- Gradient Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <!-- Status Badge -->
              <div class="absolute top-3 right-3">
                <span 
                  [class]="getStatusClasses(app.status)"
                  class="px-2 py-1 text-xs font-semibold rounded-full backdrop-blur-sm"
                >
                  {{ getStatusText(app.status) }}
                </span>
              </div>
              
              <!-- Category Badge -->
              <div *ngIf="app.category" class="absolute top-3 left-3">
                <span class="bg-blue-100/90 text-blue-800 border border-blue-200 px-2 py-1 text-xs font-semibold rounded-full backdrop-blur-sm">
                  {{ app.category }}
                </span>
              </div>

              <!-- Quick Action Button (appears on hover) -->
              <div class="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <button 
                  (click)="onAppAccess(app); $event.stopPropagation()"
                  [disabled]="app.status === 'coming-soon'"
                  [class]="getQuickActionClasses(app.status)"
                  class="px-3 py-1.5 text-xs font-semibold rounded-lg shadow-lg backdrop-blur-sm transition-all duration-200"
                >
                  {{ getActionText(app.status) }}
                </button>
              </div>
            </div>

            <!-- App Content -->
            <div class="p-4 xs:p-5 sm:p-6">
              <div class="flex justify-between items-start mb-3">
                <h3 class="text-base xs:text-lg font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-2">
                  {{ app.name }}
                </h3>
                <span *ngIf="app.version" class="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                  v{{ app.version }}
                </span>
              </div>
              
              <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {{ app.description }}
              </p>

              <!-- Tags -->
              <div *ngIf="app.tags && app.tags.length > 0" class="flex flex-wrap gap-1 mb-4">
                <span 
                  *ngFor="let tag of app.tags.slice(0, 2)" 
                  class="bg-gray-100/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 px-2 py-1 text-xs rounded-md backdrop-blur-sm"
                >
                  {{ tag }}
                </span>
                <span *ngIf="app.tags.length > 2" class="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                  +{{ app.tags.length - 2 }}
                </span>
              </div>

              <!-- Footer -->
              <div class="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
                <span *ngIf="app.author" class="flex items-center space-x-2">
                  <div class="w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <span class="text-white font-semibold text-xs">{{ app.author.charAt(0) }}</span>
                  </div>
                  <span>{{ app.author }}</span>
                </span>
                <span *ngIf="app.lastUpdated">
                  {{ app.lastUpdated | date:'dd/MM/yy' }}
                </span>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-2">
                <button 
                  (click)="onAppAccess(app); $event.stopPropagation()"
                  [disabled]="app.status === 'coming-soon'"
                  [class]="getMainButtonClasses(app.status)"
                  class="flex-1 h-10 font-semibold rounded-xl text-sm
                         shadow-lg transition-all duration-300 ease-out
                         hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-500/20
                         overflow-hidden group/btn"
                >
                  <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 
                              translate-x-[-100%] group-hover/btn:translate-x-[100%] 
                              transition-transform duration-700 ease-out"></div>
                  <span class="relative">{{ getActionText(app.status) }}</span>
                </button>
                
                <button 
                  (click)="$event.stopPropagation()"
                  class="w-10 h-10 border-2 border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center group/menu"
                >
                  <svg class="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover/menu:text-green-600 dark:group-hover/menu:text-green-400 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Separador decorativo entre apps y footer -->
        <div class="mt-10 xs:mt-12 sm:mt-14 lg:mt-16 mb-6 xs:mb-8 sm:mb-10">
          <div class="flex items-center justify-center">
            <div class="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
            <div class="mx-4 xs:mx-6 sm:mx-8">
              <div class="flex items-center space-x-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
                <span class="text-xs xs:text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Ecosistema Ecoinver Cloud
                </span>
                <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredApps.length === 0" class="text-center py-12 xs:py-16 sm:py-20">
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-8 xs:p-10 sm:p-12 max-w-md mx-auto">
            <div class="w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl sm:rounded-2xl mx-auto mb-4 xs:mb-5 sm:mb-6 flex items-center justify-center">
              <svg class="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <h3 class="text-lg xs:text-xl font-semibold text-gray-900 dark:text-white mb-2">No se encontraron aplicaciones</h3>
            <p class="text-sm xs:text-base text-gray-500 dark:text-gray-400 mb-6">Intenta cambiar los filtros de búsqueda o verifica tu conexión.</p>
            <button 
              (click)="clearFilters()"
              class="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        <!-- Footer minimalista responsive -->
        <div class="pt-6 xs:pt-7 sm:pt-8 border-t border-gray-200 dark:border-gray-700">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 text-xs xs:text-sm text-gray-500 dark:text-gray-400">
            <div class="flex flex-col xs:flex-row xs:items-center space-y-2 xs:space-y-0 xs:space-x-6 text-center xs:text-left">
              <span>© 2025 Ecoinver Cloud</span>
              <span class="hidden xs:block">•</span>
              <span>{{ filteredApps.length }} de {{ config.apps.length }} aplicaciones</span>
            </div>
            <div class="flex items-center space-x-2 justify-center sm:justify-end">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Hub actualizado</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
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