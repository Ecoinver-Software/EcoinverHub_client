import { Component, HostListener, ElementRef } from '@angular/core';
import { AuthServiceService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isMobileMenuOpen = false;

  constructor(private elementRef: ElementRef, private authService: AuthServiceService, router:Router) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    // Solo cerrar en móviles si el menú está abierto
    if (!this.isMobileMenuOpen) return;
    
    // Verificar si el clic fue dentro del sidebar o en el botón hamburguesa
    const target = event.target as HTMLElement;
    const sidebar = this.elementRef.nativeElement.querySelector('aside');
    const hamburgerButton = this.elementRef.nativeElement.querySelector('button');
    
    // Si el clic no fue en el sidebar ni en el botón hamburguesa, cerrar el menú
    if (sidebar && hamburgerButton && 
        !sidebar.contains(target) && 
        !hamburgerButton.contains(target)) {
      this.closeMobileMenu();
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  getSidebarClasses(): string {
    const baseClasses = 'w-16 hover:w-56 lg:w-16 lg:hover:w-56';
    const mobileClasses = this.isMobileMenuOpen 
      ? 'w-56 lg:w-16 lg:hover:w-56' 
      : '-translate-x-full lg:translate-x-0 lg:w-16 lg:hover:w-56';
    
    return `${baseClasses} ${mobileClasses}`;
  }

  logout() {
    this.authService.logout();
    window.location.href = '/login'; 
  }
}
