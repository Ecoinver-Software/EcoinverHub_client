import { Component, HostListener, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { AuthServiceService } from '../../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit, OnDestroy {
  menuMovilAbierto = false;
  rutaActiva = '';
  navegandoEnProceso = false;
  private suscripcionRuta: Subscription | null = null;

  constructor(
    private elementRef: ElementRef, 
    private authService: AuthServiceService, 
    private router: Router
  ) {}

  ngOnInit() {
    // Obtener la ruta actual al iniciar
    this.rutaActiva = this.router.url;
    
    // Suscribirse a los cambios de ruta para mantener el estado actualizado
    this.suscripcionRuta = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.rutaActiva = event.url;
        this.navegandoEnProceso = false;
      });
  }

  ngOnDestroy() {
    // Limpiar la suscripción para evitar memory leaks
    if (this.suscripcionRuta) {
      this.suscripcionRuta.unsubscribe();
    }
  }

  @HostListener('document:click', ['$event'])
  alDocumentoClick(event: Event) {
    // Solo cerrar en móviles si el menú está abierto
    if (!this.menuMovilAbierto) return;
    
    // Verificar si el clic fue dentro del sidebar o en el botón hamburguesa
    const objetivo = event.target as HTMLElement;
    const sidebar = this.elementRef.nativeElement.querySelector('aside');
    const botonHamburguesa = this.elementRef.nativeElement.querySelector('button');
    
    // Si el clic no fue en el sidebar ni en el botón hamburguesa, cerrar el menú
    if (sidebar && botonHamburguesa && 
        !sidebar.contains(objetivo) && 
        !botonHamburguesa.contains(objetivo)) {
      this.cerrarMenuMovil();
    }
  }

  // Alternar el estado del menú móvil
  alternarMenuMovil() {
    this.menuMovilAbierto = !this.menuMovilAbierto;
  }

  // Cerrar el menú móvil
  cerrarMenuMovil() {
    this.menuMovilAbierto = false;
  }

  // Obtener las clases CSS para el sidebar según el estado
  obtenerClasesSidebar(): string {
    const clasesBase = 'w-16 hover:w-56 lg:w-16 lg:hover:w-56';
    const clasesMovil = this.menuMovilAbierto 
      ? 'w-56 lg:w-16 lg:hover:w-56' 
      : '-translate-x-full lg:translate-x-0 lg:w-16 lg:hover:w-56';
    
    return `${clasesBase} ${clasesMovil}`;
  }

  // Navegar a una ruta específica evitando el flash
  navegarA(ruta: string, evento: Event) {
    evento.preventDefault();
    evento.stopPropagation();
    
    // Evitar navegación duplicada
    if (this.rutaActiva === ruta || this.navegandoEnProceso) {
      return;
    }
    
    this.navegandoEnProceso = true;
    
    // Cerrar el menú móvil antes de navegar
    if (this.menuMovilAbierto) {
      this.cerrarMenuMovil();
    }
    
    // Usar setTimeout para asegurar que la transición del menú se complete
    setTimeout(() => {
      this.router.navigate([ruta]).catch(error => {
        console.error('Error al navegar:', error);
        this.navegandoEnProceso = false;
      });
    }, 50);
  }

  // Verificar si una ruta está activa
  esRutaActiva(ruta: string): boolean {
    return this.rutaActiva === ruta;
  }

  // Cerrar sesión del usuario
  cerrarSesion() {
    this.navegandoEnProceso = true;
    this.authService.logout();
    
    // Usar setTimeout para evitar conflictos con la navegación
    setTimeout(() => {
      window.location.href = '/login';
    }, 100);
  }
}