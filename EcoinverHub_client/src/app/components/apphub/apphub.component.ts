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
  isActive?: boolean;
  tags?: string[];
  lastUpdated?: Date;
  url?: string;
}

interface AppHubConfig {
  title: string;
  subtitle?: string;
  apps: App[];
  showSearch?: boolean;
  showFilters?: boolean;
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

        <!-- Search and Filters con estilo glassmorphism -->
        <div *ngIf="config.showSearch || config.showFilters" class="mb-6 xs:mb-8 sm:mb-10">
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-4 xs:p-5 sm:p-6 lg:p-8">
            <div class="flex flex-col md:flex-row gap-4 justify-between items-center">
              
              <!-- Search -->
              <div *ngIf="config.showSearch" class="w-full md:w-1/2">
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    [(ngModel)]="searchTerm"
                    (input)="onSearchChange()"
                    placeholder="Buscar aplicaciones..."
                    class="w-full h-12 pl-12 pr-4 
                           bg-green-50/30 border-2 border-green-200
                           rounded-xl text-gray-800 placeholder-gray-400
                           transition-all duration-300 ease-out
                           focus:outline-none focus:border-green-500 focus:bg-white
                           focus:shadow-lg focus:shadow-green-500/10
                           hover:border-green-300 hover:bg-green-50"
                  >
                </div>
              </div>

              <!-- Filter -->
              <div *ngIf="config.showFilters" class="w-full md:w-auto">
                <select 
                  [(ngModel)]="selectedFilter"
                  (change)="onFilterChange()"
                  class="w-full h-12 px-4 pr-8
                         bg-green-50/30 border-2 border-green-200
                         rounded-xl text-gray-800
                         transition-all duration-300 ease-out
                         focus:outline-none focus:border-green-500 focus:bg-white
                         focus:shadow-lg focus:shadow-green-500/10
                         hover:border-green-300 hover:bg-green-50"
                >
                  <option value="">Todas las categorías</option>
                  <option *ngFor="let category of categories" [value]="category">{{ category }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Apps Grid con estilo glassmorphism -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 xs:gap-5 sm:gap-6 lg:gap-8">
          <div 
            *ngFor="let app of filteredApps" 
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
                  [class]="app.isActive ? 'bg-green-100/90 text-green-800 border border-green-200' : 'bg-red-100/90 text-red-800 border border-red-200'"
                  class="px-2 py-1 text-xs font-semibold rounded-full backdrop-blur-sm"
                >
                  {{ app.isActive ? 'Activa' : 'Inactiva' }}
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
                  (click)="onAppInstall(app); $event.stopPropagation()"
                  [disabled]="app.isActive"
                  class="px-3 py-1.5 bg-white/90 hover:bg-white text-gray-800 text-xs font-semibold rounded-lg shadow-lg backdrop-blur-sm transition-all duration-200 disabled:bg-gray-200/90 disabled:text-gray-500"
                >
                  {{ app.isActive ? 'Instalada' : 'Instalar' }}
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
                  (click)="onAppInstall(app); $event.stopPropagation()"
                  [disabled]="app.isActive"
                  class="flex-1 h-10 
                         bg-gradient-to-r from-green-600 to-emerald-600
                         hover:from-green-700 hover:to-emerald-700
                         disabled:from-gray-300 disabled:to-gray-400
                         text-white font-semibold rounded-xl text-sm
                         shadow-lg shadow-green-500/25
                         transition-all duration-300 ease-out
                         hover:shadow-xl hover:shadow-green-500/40
                         hover:scale-105 disabled:hover:scale-100
                         focus:outline-none focus:ring-4 focus:ring-green-500/20
                         disabled:cursor-not-allowed disabled:shadow-none
                         overflow-hidden group/btn"
                >
                  <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 
                              translate-x-[-100%] group-hover/btn:translate-x-[100%] 
                              transition-transform duration-700 ease-out"></div>
                  <span class="relative">{{ app.isActive ? 'Instalada' : 'Instalar' }}</span>
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
        <div class="mt-10 xs:mt-12 sm:mt-14 lg:mt-16 pt-6 xs:pt-7 sm:pt-8 border-t border-gray-200 dark:border-gray-700">
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
    showFilters: true,
    cardsPerRow: 4
  };

  @Output() appClicked = new EventEmitter<App>();
  @Output() appInstalled = new EventEmitter<App>();
  @Output() searchChanged = new EventEmitter<string>();
  @Output() filterChanged = new EventEmitter<string>();

  searchTerm: string = '';
  selectedFilter: string = '';
  filteredApps: App[] = [];
  categories: string[] = [];

  // Datos mock para cuando no se proporcionan apps
  private mockApps: App[] = [
    {
      id: '1',
      name: 'GMAO Pro',
      description: 'Sistema de gestión de mantenimiento asistido por ordenador para optimizar recursos y maximizar la eficiencia operativa',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop&crop=center',
      category: 'Mantenimiento',
      version: '3.2.1',
      author: 'Ecoinver Tech',
      isActive: true,
      tags: ['mantenimiento', 'gestión', 'eficiencia', 'preventivo'],
      lastUpdated: new Date('2025-05-15'),
      url: '/apps/gmao-pro'
    },
    {
      id: '2',
      name: 'Dashboard Energético',
      description: 'Monitoreo en tiempo real del consumo y eficiencia energética empresarial con análisis predictivo avanzado',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&crop=center',
      category: 'Energía',
      version: '2.8.4',
      author: 'EcoTeam',
      isActive: true,
      tags: ['energía', 'sostenibilidad', 'monitoring', 'analytics'],
      lastUpdated: new Date('2025-06-01'),
      url: '/apps/dashboard-energetico'
    },
    {
      id: '3',
      name: 'Gestión de Residuos',
      description: 'Control integral de residuos y cumplimiento de normativas ambientales con trazabilidad completa',
      imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=250&fit=crop&crop=center',
      category: 'Medio Ambiente',
      version: '1.9.2',
      author: 'GreenOps',
      isActive: false,
      tags: ['residuos', 'normativas', 'ambiente', 'trazabilidad'],
      lastUpdated: new Date('2025-05-28'),
      url: '/apps/gestion-residuos'
    },
    {
      id: '4',
      name: 'Portal del Empleado',
      description: 'Plataforma centralizada para gestión de recursos humanos y comunicación interna bidireccional',
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop&crop=center',
      category: 'Recursos Humanos',
      version: '4.1.0',
      author: 'HR Solutions',
      isActive: true,
      tags: ['empleados', 'comunicación', 'gestión', 'colaboración'],
      lastUpdated: new Date('2025-06-03'),
      url: '/apps/portal-empleado'
    },
    {
      id: '5',
      name: 'Auditorías Ambientales',
      description: 'Herramienta para planificar, ejecutar y reportar auditorías de cumplimiento ambiental normativo',
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop&crop=center',
      category: 'Cumplimiento',
      version: '2.3.1',
      author: 'ComplianceTeam',
      isActive: true,
      tags: ['auditorías', 'cumplimiento', 'reportes', 'normativas'],
      lastUpdated: new Date('2025-05-20'),
      url: '/apps/auditorias-ambientales'
    },
    {
      id: '6',
      name: 'Control de Calidad',
      description: 'Sistema integral de control de calidad con seguimiento de métricas y KPIs operacionales',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop&crop=center',
      category: 'Calidad',
      version: '1.7.3',
      author: 'QualityTeam',
      isActive: true,
      tags: ['calidad', 'métricas', 'control', 'kpis'],
      lastUpdated: new Date('2025-05-30'),
      url: '/apps/control-calidad'
    },
    {
      id: '7',
      name: 'Inventario Inteligente',
      description: 'Gestión avanzada de inventarios con predicción de demanda y optimización automática',
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=250&fit=crop&crop=center',
      category: 'Logística',
      version: '3.1.2',
      author: 'LogiTeam',
      isActive: false,
      tags: ['inventario', 'predicción', 'optimización', 'almacén'],
      lastUpdated: new Date('2025-05-25'),
      url: '/apps/inventario-inteligente'
    },
    {
      id: '8',
      name: 'Análisis Financiero',
      description: 'Herramientas de análisis financiero con reportes automáticos y proyecciones de flujo de caja',
      imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop&crop=center',
      category: 'Finanzas',
      version: '2.5.0',
      author: 'FinanceTeam',
      isActive: true,
      tags: ['finanzas', 'análisis', 'reportes', 'proyecciones'],
      lastUpdated: new Date('2025-06-02'),
      url: '/apps/analisis-financiero'
    }
  ];

  ngOnInit() {
    // Si no hay apps configuradas, usar los datos mock
    if (!this.config.apps || this.config.apps.length === 0) {
      this.config.apps = this.mockApps;
    }
    
    this.filteredApps = this.config.apps;
    this.extractCategories();
  }

  private extractCategories() {
    const categorySet = new Set<string>();
    this.config.apps.forEach(app => {
      if (app.category) {
        categorySet.add(app.category);
      }
    });
    this.categories = Array.from(categorySet);
  }

  onSearchChange() {
    this.filterApps();
    this.searchChanged.emit(this.searchTerm);
  }

  onFilterChange() {
    this.filterApps();
    this.filterChanged.emit(this.selectedFilter);
  }

  private filterApps() {
    this.filteredApps = this.config.apps.filter(app => {
      const matchesSearch = !this.searchTerm || 
        app.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        app.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (app.tags && app.tags.some(tag => tag.toLowerCase().includes(this.searchTerm.toLowerCase())));

      const matchesFilter = !this.selectedFilter || app.category === this.selectedFilter;

      return matchesSearch && matchesFilter;
    });
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedFilter = '';
    this.filteredApps = this.config.apps;
    this.searchChanged.emit(this.searchTerm);
    this.filterChanged.emit(this.selectedFilter);
  }

  onAppClick(app: App) {
    this.appClicked.emit(app);
  }

  onAppInstall(app: App) {
    this.appInstalled.emit(app);
  }
}