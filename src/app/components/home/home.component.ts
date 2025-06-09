import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnuncioService } from '../../services/anuncio.service';
import { Anuncio } from '../../types/anuncio';

//para saber si el rol es marketing
import { AuthServiceService } from '../../services/auth.service';
import { takeUntil } from 'rxjs';
import { Router } from '@angular/router';


interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  hasEvents: boolean;
  events?: string[];
}

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'vacation' | 'meeting' | 'deadline' | 'other';
}

interface UserProfile {
  id: number;
  userName: string;
  email: string;
  roles: string;
  createdAt: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  currentDate = new Date();
  selectedDate: Date | null = null;
  calendarDays: CalendarDay[] = [];
  userProfile: UserProfile | null = null;
  
  // Anuncios desde el servicio
  anuncios: Anuncio[] = [];
  
  // Nombres de los meses en español
  monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Días de la semana en español
  dayNames = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  // Eventos de ejemplo
  events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Reunión de equipo',
      date: new Date(2025, 5, 5), // 5 de junio de 2025
      type: 'meeting'
    },
    {
      id: '2',
      title: 'Entrega de proyecto',
      date: new Date(2025, 5, 10), // 10 de junio de 2025
      type: 'deadline'
    },
    {
      id: '3',
      title: 'Vacaciones',
      date: new Date(2025, 5, 15), // 15 de junio de 2025
      type: 'vacation'
    }
  ];

  constructor(private anuncioService: AnuncioService, private authService: AuthServiceService, private router: Router) {
    this.generateCalendar();
    // Seleccionar el día actual por defecto
    this.selectedDate = new Date();
  }

  ngOnInit(): void {
    this.loadAnuncios();
    this.esRolMarketing();
  }

  // Cargar anuncios desde el servicio
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

  // Obtener todos los anuncios (sin filtro por estado)
  get todosLosAnuncios(): Anuncio[] {
    return this.anuncios;
  }

  // Obtener el color del estado (solo badge y punto)
  getEstadoColor(estado: string): { bg: string, text: string, dot: string } {
    const estadoLower = estado.toLowerCase();
    
    if (estadoLower === 'urgente') {
      return {
        bg: 'bg-red-100 dark:bg-red-900/50',
        text: 'text-red-800 dark:text-red-200',
        dot: 'bg-red-500'
      };
    } else if (estadoLower === 'activo') {
      return {
        bg: 'bg-green-100 dark:bg-green-900/50',
        text: 'text-green-800 dark:text-green-200',
        dot: 'bg-green-500'
      };
    } else {
      return {
        bg: 'bg-gray-100 dark:bg-gray-700/50',
        text: 'text-gray-800 dark:text-gray-200',
        dot: 'bg-gray-400'
      };
    }
  }

  // Mouse drag functionality
  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;

  onMouseDown(event: MouseEvent, container: HTMLElement) {
    this.isDragging = true;
    this.startX = event.pageX - container.offsetLeft;
    this.scrollLeft = container.scrollLeft;
    container.style.cursor = 'grabbing';
    container.style.userSelect = 'none';
  }

  onMouseMove(event: MouseEvent, container: HTMLElement) {
    if (!this.isDragging) return;
    event.preventDefault();
    const x = event.pageX - container.offsetLeft;
    const walk = (x - this.startX) * 2; // Velocidad del scroll
    container.scrollLeft = this.scrollLeft - walk;
  }

  onMouseUp(container: HTMLElement) {
    this.isDragging = false;
    container.style.cursor = 'grab';
    container.style.userSelect = 'auto';
  }

  onMouseLeave(container: HTMLElement) {
    this.isDragging = false;
    container.style.cursor = 'grab';
    container.style.userSelect = 'auto';
  }

  // Obtener las iniciales del nombre para el avatar
  getInitials(nombre: string): string {
    return nombre
      .split(' ')
      .map(word => word.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  // Obtener un color de avatar basado en el nombre
  getAvatarColor(nombre: string): string {
    const colors = [
      'from-blue-400 to-blue-600',
      'from-green-400 to-green-600',
      'from-purple-400 to-purple-600',
      'from-orange-400 to-orange-600',
      'from-red-400 to-red-600',
      'from-indigo-400 to-indigo-600',
      'from-pink-400 to-pink-600',
      'from-teal-400 to-teal-600'
    ];
    
    const index = nombre.length % colors.length;
    return colors[index];
  }

  // Formatear fecha
  formatDate(dateString?: string): string {
    if (!dateString) {
      return new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  // Truncar texto si es muy largo
  truncateText(text: string, maxLength: number = 200): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  generateCalendar() {
    this.calendarDays = [];
    
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    // Primer día del mes
    const firstDay = new Date(year, month, 1);
    // Último día del mes
    const lastDay = new Date(year, month + 1, 0);
    
    // Primer día de la semana (Lunes = 1, Domingo = 0)
    let startDate = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Ajustar para que Lunes sea el primer día
    startDate.setDate(firstDay.getDate() - daysToSubtract);
    
    // Generar 42 días (6 semanas)
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isToday = this.isToday(date);
      const isSelected = this.selectedDate ? this.isSameDay(date, this.selectedDate) : false;
      const hasEvents = this.hasEventsOnDate(date);
      const dayEvents = this.getEventsForDate(date);
      
      this.calendarDays.push({
        date: date,
        day: date.getDate(),
        isCurrentMonth,
        isToday,
        isSelected,
        hasEvents,
        events: dayEvents
      });
    }
  }

  // Navegar al mes anterior
  previousMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar();
  }

  // Navegar al mes siguiente
  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar();
  }

  // Seleccionar una fecha
  selectDate(day: CalendarDay) {
    if (day.isCurrentMonth) {
      this.selectedDate = new Date(day.date);
      this.generateCalendar(); // Regenerar para actualizar la selección
    }
  }

  // Verificar si una fecha es hoy
  isToday(date: Date): boolean {
    const today = new Date();
    return this.isSameDay(date, today);
  }

  // Verificar si dos fechas son el mismo día
  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  // Verificar si hay eventos en una fecha
  hasEventsOnDate(date: Date): boolean {
    return this.events.some(event => this.isSameDay(event.date, date));
  }

  // Obtener eventos para una fecha específica
  getEventsForDate(date: Date): string[] {
    return this.events
      .filter(event => this.isSameDay(event.date, date))
      .map(event => event.title);
  }

  // Obtener el nombre del mes actual
  get currentMonthName(): string {
    return this.monthNames[this.currentDate.getMonth()];
  }

  // Obtener el año actual
  get currentYear(): number {
    return this.currentDate.getFullYear();
  }

  // Ir al día de hoy
  goToToday() {
    this.currentDate = new Date();
    this.selectedDate = new Date();
    this.generateCalendar();
  }

  // Solicitar ausencia (función de ejemplo) no se implementará todavia
  requestAbsence() {
    if (this.selectedDate) {
      const selectedDateStr = this.selectedDate.toLocaleDateString('es-ES');
      alert(`Solicitando ausencia para el día ${selectedDateStr}`);
      
      // Aquí podrías agregar la lógica para abrir un modal o navegar a otra página
      // Por ejemplo, agregar un evento de ausencia
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: 'Ausencia solicitada',
        date: new Date(this.selectedDate),
        type: 'vacation'
      };
      
      this.events.push(newEvent);
      this.generateCalendar();
    } else {
      alert('Por favor, selecciona una fecha primero');
    }
  }

  // Obtener clases CSS para cada día
  getDayClasses(day: CalendarDay): string {
    let classes = 'text-sm text-center py-3 rounded-lg cursor-pointer transition-colors relative ';
    
    if (!day.isCurrentMonth) {
      classes += 'text-gray-400 dark:text-gray-600 ';
    } else if (day.isToday) {
      classes += 'text-white bg-gradient-to-r from-blue-600 to-blue-700 font-semibold shadow-lg ';
    } else if (day.isSelected) {
      classes += 'text-white bg-gradient-to-r from-orange-500 to-orange-600 font-semibold shadow-md ';
    } else {
      classes += 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 ';
    }
    
    return classes;
  }

  // Obtener eventos del día seleccionado
  getSelectedDayEvents(): CalendarEvent[] {
    if (!this.selectedDate) return [];
    
    return this.events.filter(event => this.isSameDay(event.date, this.selectedDate!));
  }
  
  // Obtener el texto del día seleccionado
  getSelectedDateText(): string {
    if (!this.selectedDate) return 'Ninguna fecha seleccionada';
    
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    return this.selectedDate.toLocaleDateString('es-ES', options);
  }


  //-------------------------------------------------------------------------------
  //metodo para verificar si el usuario tiene rol de marketing
  esRolMarketing(): void {
    
  this.authService.getProfile()
    .subscribe({
      next: (profile) => {
        this.userProfile = profile;

        //para que pille si es marketing o admin y asi mostrar el boton de anuncios (crear)
        if (this.userProfile?.roles.includes('Marketing') || this.userProfile?.roles.includes('admin')) {
          document.getElementById("botonAnuncios")?.removeAttribute("hidden");
          //console.log('aaaa');
          //console.log('Perfil de usuario:', this.userProfile);
          
        }
       
      },
      error: (error: any) => {
        console.error('Error al cargar perfil:', error);
      }
    });
  }

  navigateToAnuncios(): void {
    // Navegar a la página de anuncios
    this.router.navigate(['/editor-anuncios']);
  }

  navigateToAnuncio(id: number) {
    this.router.navigate(
    ['/anuncios'], 
    { fragment: id.toString() }
  );
  }


  //-------------------------------------------------------------------------------





}