import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthServiceService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../types/usuario';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div class="w-full max-w-none px-3 xs:px-4 sm:px-6 md:px-8 lg:px-8 xl:px-12 2xl:px-16 py-4 xs:py-6 sm:py-8 lg:py-12">
        
        <!-- Header optimizado con estilo Ecoinver -->
        <div class="mb-6 xs:mb-8 sm:mb-10 md:mb-12 lg:mb-16">
          <div class="flex flex-col space-y-3 xs:space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div class="text-center sm:text-left">
              <h1 class="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extralight text-gray-900 dark:text-white mb-2 xs:mb-3 tracking-tight">
                Mi Perfil
              </h1>
              <p class="text-sm xs:text-base sm:text-lg text-gray-500 dark:text-gray-400 font-light">
                Gestiona tu información personal y configuración de cuenta
              </p>
            </div>
            <div class="hidden sm:flex items-center justify-center sm:justify-end space-x-4">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Sesión activa</span>
            </div>
          </div>
        </div>

        <!-- Grid Principal -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 xs:gap-8 sm:gap-10">
          
          <!-- Columna Izquierda - Avatar y Resumen -->
          <div class="lg:col-span-4 space-y-6 xs:space-y-8">
            
            <!-- Tarjeta de Avatar y Info Básica -->
            <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
              <div class="p-6 xs:p-8 text-center">
                <!-- Avatar -->
                <div class="relative inline-block mb-6">
                  <div class="w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <span class="text-white font-bold text-2xl xs:text-3xl sm:text-4xl">
                      {{ getInitials() }}
                    </span>
                  </div>
                  <!-- Botón cambiar avatar -->
                  <button 
                    class="absolute bottom-0 right-0 w-8 h-8 xs:w-10 xs:h-10 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                    title="Cambiar avatar">
                    <svg class="w-4 h-4 xs:w-5 xs:h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </button>
                </div>
                
                <!-- Info básica -->
                <h2 class="text-xl xs:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  {{ currentUser?.userName || 'Usuario' }}
                </h2>
                <p class="text-gray-600 dark:text-gray-400 mb-4">
                  {{ currentUser?.email || 'correo@email.com' }}
                </p>
                
                <!-- Badge de rol -->
                <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 mb-6">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                  {{ currentUser?.roles || 'Usuario' }}
                </div>
                
                <!-- Estadísticas rápidas -->
                <div class="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div class="text-center">
                    <div class="text-lg xs:text-xl font-semibold text-gray-900 dark:text-white">{{ sessionDays }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">Días activo</div>
                  </div>
                  <div class="text-center">
                    <div class="text-lg xs:text-xl font-semibold text-gray-900 dark:text-white">{{ lastLoginDays }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">Último acceso</div>
                  </div>
                  <div class="text-center">
                    <div class="text-lg xs:text-xl font-semibold text-gray-900 dark:text-white">3</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">Apps usadas</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Accesos Rápidos -->
            <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <div class="p-4 xs:p-5 sm:p-6 border-b border-gray-100 dark:border-gray-700">
                <h3 class="text-base xs:text-lg font-semibold text-gray-900 dark:text-white">Accesos Rápidos</h3>
              </div>
              <div class="p-4 xs:p-5 sm:p-6 space-y-3">
                <button class="w-full flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-200 group">
                  <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                    <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1 text-left">Cambiar contraseña</span>
                  <svg class="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
                
                <button class="w-full flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-200 group">
                  <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                    <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1 text-left">Configuración</span>
                  <svg class="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
                
                <button 
                  (click)="logout()"
                  class="w-full flex items-center p-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 group">
                  <div class="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mr-3">
                    <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-red-600 dark:text-red-400 flex-1 text-left">Cerrar sesión</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Columna Derecha - Formularios y Configuración -->
          <div class="lg:col-span-8 space-y-6 xs:space-y-8">
            
            <!-- Tabs de Navegación -->
            <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <div class="border-b border-gray-200 dark:border-gray-700">
                <nav class="flex space-x-8 px-6 py-4" aria-label="Tabs">
                  <button 
                    (click)="activeTab = 'info'"
                    [class]="activeTab === 'info' ? 'border-green-500 text-green-600 dark:text-green-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
                    class="border-b-2 py-2 px-1 text-sm font-medium transition-colors">
                    <div class="flex items-center space-x-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      <span>Información Personal</span>
                    </div>
                  </button>
                  
                  <button 
                    (click)="activeTab = 'security'"
                    [class]="activeTab === 'security' ? 'border-green-500 text-green-600 dark:text-green-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
                    class="border-b-2 py-2 px-1 text-sm font-medium transition-colors">
                    <div class="flex items-center space-x-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                      </svg>
                      <span>Seguridad</span>
                    </div>
                  </button>
                  
                  <button 
                    (click)="activeTab = 'preferences'"
                    [class]="activeTab === 'preferences' ? 'border-green-500 text-green-600 dark:text-green-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
                    class="border-b-2 py-2 px-1 text-sm font-medium transition-colors">
                    <div class="flex items-center space-x-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <span>Preferencias</span>
                    </div>
                  </button>
                </nav>
              </div>

              <!-- Contenido de los Tabs -->
              <div class="p-6 xs:p-8">
                
                <!-- Tab Información Personal -->
                <div *ngIf="activeTab === 'info'">
                  <div class="mb-6">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Información Personal</h3>
                    <p class="text-gray-600 dark:text-gray-400">Actualiza tu información personal y de contacto</p>
                  </div>
                  
                  <form [formGroup]="profileForm" (ngSubmit)="updateProfile()" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <!-- Nombre de usuario -->
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nombre de usuario
                        </label>
                        <div class="relative">
                          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                          </div>
                          <input 
                            type="text" 
                            formControlName="userName"
                            class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            placeholder="Tu nombre de usuario">
                        </div>
                      </div>

                      <!-- Email -->
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Correo electrónico
                        </label>
                        <div class="relative">
                          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                            </svg>
                          </div>
                          <input 
                            type="email" 
                            formControlName="email"
                            class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            placeholder="tu@email.com">
                        </div>
                      </div>
                    </div>

                    <!-- Botones de acción -->
                    <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <button 
                        type="button"
                        class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
                        Cancelar
                      </button>
                      <button 
                        type="submit"
                        [disabled]="profileForm.invalid || isLoading"
                        class="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed">
                        <span *ngIf="!isLoading">Guardar cambios</span>
                        <span *ngIf="isLoading" class="flex items-center">
                          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Guardando...
                        </span>
                      </button>
                    </div>
                  </form>
                </div>

                <!-- Tab Seguridad -->
                <div *ngIf="activeTab === 'security'">
                  <div class="mb-6">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Seguridad de la cuenta</h3>
                    <p class="text-gray-600 dark:text-gray-400">Gestiona la seguridad y autenticación de tu cuenta</p>
                  </div>
                  
                  <form [formGroup]="securityForm" (ngSubmit)="updatePassword()" class="space-y-6">
                    <!-- Contraseña actual -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Contraseña actual
                      </label>
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                          </svg>
                        </div>
                        <input 
                          type="password" 
                          formControlName="currentPassword"
                          class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          placeholder="Contraseña actual">
                      </div>
                    </div>

                    <!-- Nueva contraseña -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nueva contraseña
                      </label>
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                          </svg>
                        </div>
                        <input 
                          type="password" 
                          formControlName="newPassword"
                          class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          placeholder="Nueva contraseña">
                      </div>
                    </div>

                    <!-- Confirmar contraseña -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Confirmar nueva contraseña
                      </label>
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                          </svg>
                        </div>
                        <input 
                          type="password" 
                          formControlName="confirmPassword"
                             class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                             typescript                         class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                         placeholder="Confirmar nueva contraseña">
                     </div>
                   </div>

                   <!-- Botones de acción -->
                   <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                     <button 
                       type="button"
                       class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
                       Cancelar
                     </button>
                     <button 
                       type="submit"
                       [disabled]="securityForm.invalid || isLoading"
                       class="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed">
                       <span *ngIf="!isLoading">Actualizar contraseña</span>
                       <span *ngIf="isLoading" class="flex items-center">
                         <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                           <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                           <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                         </svg>
                         Actualizando...
                       </span>
                     </button>
                   </div>
                 </form>

                 <!-- Sección de Sesiones Activas -->
                 <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                   <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sesiones activas</h4>
                   <div class="space-y-3">
                     <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                       <div class="flex items-center space-x-3">
                         <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                           <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                           </svg>
                         </div>
                         <div>
                           <div class="font-medium text-gray-900 dark:text-white">Sesión actual</div>
                           <div class="text-sm text-gray-500 dark:text-gray-400">Navegador web - {{ getCurrentTimestamp() }}</div>
                         </div>
                       </div>
                       <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                         Activa
                       </span>
                     </div>
                   </div>
                 </div>
               </div>

               <!-- Tab Preferencias -->
               <div *ngIf="activeTab === 'preferences'">
                 <div class="mb-6">
                   <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Preferencias</h3>
                   <p class="text-gray-600 dark:text-gray-400">Personaliza tu experiencia en la plataforma</p>
                 </div>
                 
                 <div class="space-y-8">
                   <!-- Tema -->
                   <div>
                     <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Apariencia</h4>
                     <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                       <button 
                         (click)="setTheme('light')"
                         [class]="currentTheme === 'light' ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'"
                         class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-200">
                         <div class="flex items-center space-x-3">
                           <div class="w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center">
                             <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                               <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
                             </svg>
                           </div>
                           <span class="font-medium text-gray-900 dark:text-white">Claro</span>
                         </div>
                       </button>
                       
                       <button 
                         (click)="setTheme('dark')"
                         [class]="currentTheme === 'dark' ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'"
                         class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-200">
                         <div class="flex items-center space-x-3">
                           <div class="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                             <svg class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                               <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                             </svg>
                           </div>
                           <span class="font-medium text-gray-900 dark:text-white">Oscuro</span>
                         </div>
                       </button>
                       
                       <button 
                         (click)="setTheme('system')"
                         [class]="currentTheme === 'system' ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'"
                         class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-200">
                         <div class="flex items-center space-x-3">
                           <div class="w-8 h-8 bg-gradient-to-r from-white to-gray-800 rounded-full flex items-center justify-center">
                             <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                               <path fill-rule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clip-rule="evenodd"></path>
                             </svg>
                           </div>
                           <span class="font-medium text-gray-900 dark:text-white">Sistema</span>
                         </div>
                       </button>
                     </div>
                   </div>

                   <!-- Notificaciones -->
                   <div>
                     <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Notificaciones</h4>
                     <div class="space-y-4">
                       <div class="flex items-center justify-between">
                         <div>
                           <div class="font-medium text-gray-900 dark:text-white">Notificaciones por email</div>
                           <div class="text-sm text-gray-500 dark:text-gray-400">Recibe actualizaciones importantes por correo</div>
                         </div>
                         <button 
                           (click)="toggleNotification('email')"
                           [class]="preferences.emailNotifications ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'"
                           class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                           <span 
                             [class]="preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'"
                             class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"></span>
                         </button>
                       </div>
                       
                       <div class="flex items-center justify-between">
                         <div>
                           <div class="font-medium text-gray-900 dark:text-white">Notificaciones push</div>
                           <div class="text-sm text-gray-500 dark:text-gray-400">Recibe notificaciones en tiempo real</div>
                         </div>
                         <button 
                           (click)="toggleNotification('push')"
                           [class]="preferences.pushNotifications ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'"
                           class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                           <span 
                             [class]="preferences.pushNotifications ? 'translate-x-6' : 'translate-x-1'"
                             class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"></span>
                         </button>
                       </div>
                     </div>
                   </div>

                   <!-- Idioma -->
                   <div>
                     <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Idioma</h4>
                     <select 
                       [(ngModel)]="preferences.language"
                       class="w-full max-w-xs px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent">
                       <option value="es">Español</option>
                       <option value="en">English</option>
                       <option value="fr">Français</option>
                     </select>
                   </div>

                   <!-- Botón guardar preferencias -->
                   <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
                     <button 
                       (click)="savePreferences()"
                       class="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
                       Guardar preferencias
                     </button>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>

       <!-- Separador decorativo -->
       <div class="mt-10 xs:mt-12 sm:mt-14 lg:mt-16 mb-6 xs:mb-8 sm:mb-10">
         <div class="flex items-center justify-center">
           <div class="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
           <div class="mx-4 xs:mx-6 sm:mx-8">
             <div class="flex items-center space-x-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
               <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
               </svg>
               <span class="text-xs xs:text-sm text-gray-600 dark:text-gray-400 font-medium">
                 Perfil de Usuario
               </span>
               <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
               </svg>
             </div>
           </div>
           <div class="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
         </div>
       </div>

       <!-- Footer -->
       <div class="pt-6 xs:pt-7 sm:pt-8 border-t border-gray-200 dark:border-gray-700">
         <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 text-xs xs:text-sm text-gray-500 dark:text-gray-400">
           <div class="flex flex-col xs:flex-row xs:items-center space-y-2 xs:space-y-0 xs:space-x-6 text-center xs:text-left">
             <span>© 2025 Ecoinver Cloud</span>
             <span class="hidden xs:block">•</span>
             <span>Perfil actualizado: {{ getCurrentTimestamp() }}</span>
           </div>
           <div class="flex items-center space-x-2 justify-center sm:justify-end">
             <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             <span>Datos seguros</span>
           </div>
         </div>
       </div>

     </div>
   </div>

   <!-- Toast de notificaciones -->
   <div *ngIf="showToast" 
        [class]="toastType === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'"
        class="fixed top-6 right-6 z-50 min-w-80 p-4 border rounded-2xl shadow-2xl animate-[slideIn_0.3s_ease-out]" 
        role="alert">
     <div class="flex items-center space-x-3">
       <div class="flex-shrink-0">
         <svg *ngIf="toastType === 'success'" class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
         </svg>
         <svg *ngIf="toastType === 'error'" class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
         </svg>
       </div>
       <div>
         <span class="font-semibold">{{ toastMessage }}</span>
       </div>
     </div>
   </div>
 `,
 styles: [`
   @keyframes slideIn {
     from {
       opacity: 0;
       transform: translateX(100%);
     }
     to {
       opacity: 1;
       transform: translateX(0);
     }
   }
 `]
})
export class PerfilComponent implements OnInit {
 activeTab: 'info' | 'security' | 'preferences' = 'info';
 profileForm: FormGroup;
 securityForm: FormGroup;
 currentUser: Usuario | null = null;
 isLoading = false;
 showToast = false;
 toastMessage = '';
 toastType: 'success' | 'error' = 'success';
 
 // Datos de ejemplo para estadísticas
 sessionDays = 45;
 lastLoginDays = 1;
 currentTheme = 'system';
 
 preferences = {
   emailNotifications: true,
   pushNotifications: false,
   language: 'es'
 };

 constructor(
   private fb: FormBuilder,
   private authService: AuthServiceService,
   private usuarioService: UsuarioService
 ) {
   this.profileForm = this.fb.group({
     userName: ['', [Validators.required, Validators.minLength(3)]],
     email: ['', [Validators.required, Validators.email]]
   });

   this.securityForm = this.fb.group({
     currentPassword: ['', [Validators.required]],
     newPassword: ['', [Validators.required, Validators.minLength(6)]],
     confirmPassword: ['', [Validators.required]]
   }, { validators: this.passwordMatchValidator });
 }

 ngOnInit() {
   this.loadUserData();
   this.loadPreferences();
 }

 loadUserData() {
   // Simular carga de datos del usuario actual
   // En tu implementación real, obtendrías esto del token JWT o servicio de auth
   this.currentUser = {
     id: 1,
     userName: 'Juan Pérez',
     email: 'juan.perez@ecoinver.com',
     roles: 'Administrador'
   };

   // Cargar datos en el formulario
   if (this.currentUser) {
     this.profileForm.patchValue({
       userName: this.currentUser.userName,
       email: this.currentUser.email
     });
   }
 }

 loadPreferences() {
   // Cargar preferencias desde localStorage o servicio
   const savedPreferences = localStorage.getItem('userPreferences');
   if (savedPreferences) {
     this.preferences = { ...this.preferences, ...JSON.parse(savedPreferences) };
   }
   
   const savedTheme = localStorage.getItem('theme') || 'system';
   this.currentTheme = savedTheme;
 }

 getInitials(): string {
   if (!this.currentUser?.userName) return 'U';
   return this.currentUser.userName
     .split(' ')
     .map(name => name.charAt(0))
     .join('')
     .toUpperCase()
     .slice(0, 2);
 }

 getCurrentTimestamp(): string {
   return new Date().toLocaleDateString('es-ES', {
     year: 'numeric',
     month: 'short',
     day: 'numeric'
   });
 }

 passwordMatchValidator(form: any) {
   const newPassword = form.get('newPassword');
   const confirmPassword = form.get('confirmPassword');
   
   if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
     confirmPassword.setErrors({ mismatch: true });
     return { mismatch: true };
   }
   return null;
 }

 updateProfile() {
   if (this.profileForm.valid) {
     this.isLoading = true;
     
     // Simular llamada a API
     setTimeout(() => {
       this.isLoading = false;
       this.showToastMessage('Perfil actualizado correctamente', 'success');
       
       // Actualizar datos del usuario actual
       if (this.currentUser) {
         this.currentUser.userName = this.profileForm.value.userName;
         this.currentUser.email = this.profileForm.value.email;
       }
     }, 1500);
   }
 }

 updatePassword() {
   if (this.securityForm.valid) {
     this.isLoading = true;
     
     // Simular llamada a API
     setTimeout(() => {
       this.isLoading = false;
       this.showToastMessage('Contraseña actualizada correctamente', 'success');
       this.securityForm.reset();
     }, 1500);
   }
 }

 setTheme(theme: string) {
   this.currentTheme = theme;
   localStorage.setItem('theme', theme);
   // Aquí aplicarías el tema al documento
   this.showToastMessage(`Tema cambiado a ${theme}`, 'success');
 }

 toggleNotification(type: 'email' | 'push') {
   if (type === 'email') {
     this.preferences.emailNotifications = !this.preferences.emailNotifications;
   } else {
     this.preferences.pushNotifications = !this.preferences.pushNotifications;
   }
 }

 savePreferences() {
   localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
   this.showToastMessage('Preferencias guardadas correctamente', 'success');
 }

 logout() {
   // Limpiar datos de sesión
   localStorage.removeItem('jwt');
   localStorage.removeItem('userPreferences');
   
   this.showToastMessage('Cerrando sesión...', 'success');
   
   // Redirigir al login después de un delay
   setTimeout(() => {
     // Aquí harías la navegación al login
     // this.router.navigate(['/login']);
     console.log('Redirigiendo al login...');
   }, 1500);
 }

 showToastMessage(message: string, type: 'success' | 'error') {
   this.toastMessage = message;
   this.toastType = type;
   this.showToast = true;
   
   setTimeout(() => {
     this.showToast = false;
   }, 3000);
 }
}