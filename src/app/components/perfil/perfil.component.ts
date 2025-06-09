import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthServiceService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';

interface UserProfile {
  id: number;
  userName: string;
  email: string;
  roles: string;
  createdAt: string;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './perfil.component.html',
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
export class PerfilComponent implements OnInit, OnDestroy {
  activeTab: 'info' | 'security' | 'preferences' = 'info';
  profileForm: FormGroup;
  securityForm: FormGroup;
  userProfile: UserProfile | null = null;
  isLoading = false;
  isLoadingUser = true;
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  currentTheme = 'system';
  
  preferences = {
    emailNotifications: true,
    pushNotifications: false,
    language: 'es'
  };

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService
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
    this.loadUserProfile();
    this.loadPreferences();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUserProfile() {
  this.isLoadingUser = true;
  
  this.authService.getProfile()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.updateFormWithProfileData();
        // DESHABILITAR los campos para que no sean editables:
        this.profileForm.get('userName')?.disable();
        this.profileForm.get('email')?.disable();
        this.isLoadingUser = false;
      },
      error: (error) => {
        console.error('Error al cargar perfil:', error);
        this.showToastMessage('Error al cargar el perfil', 'error');
        this.isLoadingUser = false;
      }
    });
}

  updateFormWithProfileData() {
    if (this.userProfile) {
      this.profileForm.patchValue({
        userName: this.userProfile.userName,
        email: this.userProfile.email
      });
    }
  }

  loadPreferences() {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      this.preferences = { ...this.preferences, ...JSON.parse(savedPreferences) };
    }
    
    const savedTheme = localStorage.getItem('theme') || 'system';
    this.currentTheme = savedTheme;
  }

  getInitials(): string {
    if (!this.userProfile?.userName) return 'U';
    return this.userProfile.userName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getDaysActive(): number {
    if (!this.userProfile?.createdAt) return 0;
    const created = new Date(this.userProfile.createdAt);
    const now = new Date();
    const diff = now.getTime() - created.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  getAccountAge(): string {
    const days = this.getDaysActive();
    if (days < 30) return `${days} días`;
    if (days < 365) return `${Math.floor(days / 30)} meses`;
    return `${Math.floor(days / 365)} años`;
  }

  formatDate(date: string): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
    if (this.profileForm.valid && this.profileForm.dirty) {
      this.isLoading = true;
      
      // Aquí implementarías la llamada al servicio para actualizar
      // Por ahora simulamos el proceso
      setTimeout(() => {
        this.isLoading = false;
        this.showToastMessage('Perfil actualizado correctamente', 'success');
        this.profileForm.markAsPristine();
      }, 1500);
    }
  }

  updatePassword() {
    if (this.securityForm.valid) {
      this.isLoading = true;
      
      // Simulación - implementar cuando tengas el endpoint
      setTimeout(() => {
        this.isLoading = false;
        this.showToastMessage('Función próximamente disponible', 'success');
        this.securityForm.reset();
      }, 1000);
    }
  }

  setTheme(theme: string) {
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    
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
    this.showToastMessage('Cerrando sesión...', 'success');
    this.authService.logout();
    
      window.location.href = '/login';
   
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