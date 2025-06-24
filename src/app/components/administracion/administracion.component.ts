import { Component, OnInit } from '@angular/core';
import { Usuario, UsuarioPost } from '../../types/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { Rol } from '../../types/rol';
import { RolService } from '../../services/rol.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AplicacionesService } from '../../services/aplicaciones.service';
import { Aplicacion } from '../../types/aplicacion';
import { AsignarAplicaciones } from '../../types/asignarAplicaciones';
import { AsignarAplicacionesService } from '../../services/asignarAplicaciones.service';
import { EquiposService } from '../../services/equipos.service';
import { Equipos } from '../../types/equipos';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-adminitracion',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, NgSelectModule],
  templateUrl: './administracion.component.html',
  styleUrl: './administracion.component.css'
})
export class AdminitracionComponent implements OnInit {

  usuarios: Usuario[] = [];
  roles: Rol[] = [];
  equipos: Equipos[] = [];
  equiposFiltrados: Equipos[] = [];
  usuariosAplicaciones: Usuario[] = [];
  usuariosAplicacionesFiltros: Usuario[] = [];//Para el filtro de los usuarios de cada aplicación.
  rolesAplicaciones: AsignarAplicaciones[] = [];
  rolesAplicacionesFiltros: AsignarAplicaciones[] = [];
  aplicaciones: Aplicacion[] = [];
  id: number = 0;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  showDeleteModalRol: boolean = false;
  showDeleteModalAplicacion: boolean = false;
  showModalAsignacion: boolean = false;
  showEditModalAplicacion: boolean = false;
  showEditModalEquipo: boolean = false;
  showEquipos: boolean = false;
  showUsuarios: boolean = false;
  busquedaUsuarios: string = '';
  modalErrores: boolean = false;
  errorMessage: string = '';
  // Propiedades para la paginación de usuarios
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;

  // Propiedades para la paginación de roles
  currentPageRoles: number = 1;
  itemsPerPageRoles: number = 5;
  totalPagesRoles: number = 0;
  // Propiedades para la paginación de roles
  currentPageEquipos: number = 1;
  itemsPerPageEquipos: number = 5;
  totalPagesEquipos: number = 0;

  // Propiedades para la paginación de aplicaciones
  currentPageAplicaciones: number = 1;
  itemsPerPageAplicaciones: number = 5;
  totalPagesAplicaciones: number = 0;
  imagenUrl: string = '';
  selectedFile: File | null = null; // Solo un archivo 
  addAplication: FormGroup;
  activeTab: string = 'usuarios';
  buscar: string = '';
  buscarRoles: string = '';
  bEquipos: string = '';
  buscarAplicaciones: string = '';
  addUser: FormGroup;
  editUser: FormGroup;
  exito: boolean = false;
  usuariosFiltrados: Usuario[] = [];
  rolesFiltrados: Rol[] = [];
  aplicacionesFiltradas: Aplicacion[] = [];
  addRol: FormGroup;
  showEditModalRol: boolean = false;
  editRol: FormGroup;
  rolesFiltros: Rol[] = [];
  editAplication: FormGroup;
  addEquipos: FormGroup;
  editEquipos: FormGroup;
  showDeleteModalEquipos: boolean = false;
  aplicacionesAsignacion: string = '';
  usuariosAsignacion: string = '';

  constructor(private userService: UsuarioService, private rolService: RolService, private aplicacionService: AplicacionesService, private rolesAplicacionesService: AsignarAplicacionesService, private equipoService: EquiposService) {
    this.addUser = new FormGroup({//Para añadir un nuevo usuario.
      userName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/)]),
      password: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      roleId: new FormControl('', Validators.required),
      name: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]),
      lastName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]),
      empresa: new FormControl('', Validators.required)
    });

    this.editUser = new FormGroup({//Para editar un usuario
      userName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/)]),
      password: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      roleId: new FormControl('', Validators.required),
      name: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]),
      lastName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]),
      empresa: new FormControl('', Validators.required)
    });

    this.addRol = new FormGroup({//Para añadir un nuevo rol.
      name: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/)]),
      description: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]),
      level: new FormControl('', Validators.required)
    });

    this.editRol = new FormGroup({//Para editar un rol
      name: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/)]),
      description: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]),
      level: new FormControl('', Validators.required)
    });

    this.addAplication = new FormGroup({//Para añadir una nueva aplicación
      name: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/)]),
      description: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,:;()\-_"']+$/)]),
      url: new FormControl('', Validators.required),
      estado: new FormControl('', Validators.required),
      version: new FormControl('', Validators.required),
      autor: new FormControl('', Validators.required)
    });


    this.editAplication = new FormGroup({//Para editar una aplicación
      name: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/)]),
      description: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,:;()\-_"']+$/)]),
      url: new FormControl('', Validators.required),
      estado: new FormControl('', Validators.required),
      version: new FormControl('', Validators.required),
      autor: new FormControl('', Validators.required)
    });

    this.addEquipos = new FormGroup({//Para agregar un nuevo equipo.
      nombre: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/)]),
      jefeEquipo: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]+$/)]),
      empresa: new FormControl('', Validators.required)
    });

    this.editEquipos = new FormGroup({//Para agregar un nuevo equipo.
      nombre: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/)]),
      jefeEquipo: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]+$/)]),
      empresa: new FormControl('', Validators.required)
    });

  }

  ngOnInit(): void {
    this.userService.get().subscribe(
      (data) => {
        this.usuarios = data;
        this.usuariosFiltrados = data;
        this.calculateTotalPages();
        console.log(data);
      },
      (error) => {
        console.log(error);
      }
    );

    this.rolService.get().subscribe(
      (data) => {
        this.roles = data;
        this.rolesFiltrados = data;
        this.calculateTotalPagesRoles();
      },
      (error) => {
        console.log(error);
      }
    );

    this.aplicacionService.get().subscribe(
      (data) => {
        this.aplicaciones = data;
        this.aplicacionesFiltradas = data;
        console.log(this.aplicacionesFiltradas);
        this.calculateTotalPagesAplicaciones();
      },
      (error) => {
        console.log(error);
      }
    );

    this.rolesAplicacionesService.get().subscribe(
      (data) => {
        this.rolesAplicaciones = data;
        console.log(data);
      },
      (error) => {
        console.log(error);
      }
    );
    //Nos traemos los equipos de la DB
    this.equipoService.get().subscribe(
      (data) => {
        this.equipos = data;//Para el array original
        this.equiposFiltrados = data;//Para el array que se muestra en la tabla pudiendo añadirle filtros.
        this.calculateTotalPagesEquipos();
      },
      (error) => {
        console.log(error);
      }
    );

  }

  // ===== MÉTODOS DE PAGINACIÓN PARA USUARIOS =====
  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.usuariosFiltrados.length / this.itemsPerPage);
  }

  getPaginatedUsers(): Usuario[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.usuarios.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  hasPreviousPage(): boolean {
    return this.currentPage > 1;
  }

  hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }

  getCurrentPageEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.usuariosFiltrados.length);
  }

  // ===== MÉTODOS DE PAGINACIÓN PARA ROLES =====
  calculateTotalPagesRoles(): void {
    this.totalPagesRoles = Math.ceil(this.rolesFiltrados.length / this.itemsPerPageRoles);
  }

  getPaginatedRoles(): Rol[] {
    const startIndex = (this.currentPageRoles - 1) * this.itemsPerPageRoles;
    const endIndex = startIndex + this.itemsPerPageRoles;
    return this.rolesFiltrados.slice(startIndex, endIndex);
  }

  previousPageRoles(): void {
    if (this.currentPageRoles > 1) {
      this.currentPageRoles--;
    }
  }

  nextPageRoles(): void {
    if (this.currentPageRoles < this.totalPagesRoles) {
      this.currentPageRoles++;
    }
  }

  goToPageRoles(page: number): void {
    if (page >= 1 && page <= this.totalPagesRoles) {
      this.currentPageRoles = page;
    }
  }

  getPageNumbersRoles(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPageRoles - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPagesRoles, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  hasPreviousPageRoles(): boolean {
    return this.currentPageRoles > 1;
  }

  hasNextPageRoles(): boolean {
    return this.currentPageRoles < this.totalPagesRoles;
  }

  getCurrentPageEndIndexRoles(): number {
    return Math.min(this.currentPageRoles * this.itemsPerPageRoles, this.rolesFiltrados.length);
  }

  // ===== MÉTODOS DE PAGINACIÓN PARA APLICACIONES =====
  calculateTotalPagesAplicaciones(): void {
    this.totalPagesAplicaciones = Math.ceil(this.aplicacionesFiltradas.length / this.itemsPerPageAplicaciones);
  }

  getPaginatedAplicaciones(): Aplicacion[] {
    const startIndex = (this.currentPageAplicaciones - 1) * this.itemsPerPageAplicaciones;
    const endIndex = startIndex + this.itemsPerPageAplicaciones;
    return this.aplicacionesFiltradas.slice(startIndex, endIndex);
  }

  previousPageAplicaciones(): void {
    if (this.currentPageAplicaciones > 1) {
      this.currentPageAplicaciones--;
    }
  }

  nextPageAplicaciones(): void {
    if (this.currentPageAplicaciones < this.totalPagesAplicaciones) {
      this.currentPageAplicaciones++;
    }
  }

  goToPageAplicaciones(page: number): void {
    if (page >= 1 && page <= this.totalPagesAplicaciones) {
      this.currentPageAplicaciones = page;
    }
  }

  getPageNumbersAplicaciones(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPageAplicaciones - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPagesAplicaciones, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  hasPreviousPageAplicaciones(): boolean {
    return this.currentPageAplicaciones > 1;
  }

  hasNextPageAplicaciones(): boolean {
    return this.currentPageAplicaciones < this.totalPagesAplicaciones;
  }

  getCurrentPageEndIndexAplicaciones(): number {
    return Math.min(this.currentPageAplicaciones * this.itemsPerPageAplicaciones, this.aplicacionesFiltradas.length);
  }

  // ===== MÉTODOS DE BÚSQUEDA =====
  busqueda() {
    this.usuariosFiltrados = this.usuarios.filter(item =>
      item.userName.toLowerCase().trim().includes(this.buscar.toLowerCase()) ||
      item.roles.toLowerCase().includes(this.buscar.toLowerCase()) ||
      item.email.toLowerCase().includes(this.buscar.toLowerCase())
    );
    this.currentPage = 1; // Resetear a la primera página
    this.calculateTotalPages();
  }

  busquedaRoles() {
    this.rolesFiltrados = this.roles.filter(item =>
      item.name.toLowerCase().trim().includes(this.buscarRoles.toLowerCase()) ||
      item.description.toLowerCase().includes(this.buscarRoles.toLowerCase())
    );
    this.currentPageRoles = 1; // Resetear a la primera página
    this.calculateTotalPagesRoles();
  }

  busquedaAplicaciones() {
    this.aplicacionesFiltradas = this.aplicaciones.filter(item =>
      item.name.toLowerCase().trim().includes(this.buscarAplicaciones.toLowerCase()) ||
      item.description.toLowerCase().includes(this.buscarAplicaciones.toLowerCase()) ||
      item.url.toLowerCase().includes(this.buscarAplicaciones.toLowerCase())
    );
    this.currentPageAplicaciones = 1; // Resetear a la primera página
    this.calculateTotalPagesAplicaciones();
  }

  // ===== MÉTODOS EXISTENTES =====
  crearUsuario() {
    const body: UsuarioPost = {
      userName: this.addUser.get('userName')?.value,
      password: this.addUser.get('password')?.value,
      email: this.addUser.get('email')?.value,
      roleId: this.addUser.get('roleId')?.value,
      name: this.addUser.get('name')?.value,
      lastname: this.addUser.get('lastName')?.value,
      empresa: this.addUser.get('empresa')?.value
    }

    this.userService.post(body).subscribe(
      (data) => {
        console.log(data)
        this.usuarios.push(data);

        // CAMBIO: Actualizar array filtrado según búsqueda actual
        if (this.buscar.trim()) {
          this.busqueda();
        } else {
          this.usuariosFiltrados = [...this.usuarios];
        }

        this.calculateTotalPages();

        const lastPageItems = this.usuariosFiltrados.length % this.itemsPerPage;
        if (lastPageItems === 1 && this.usuariosFiltrados.length > this.itemsPerPage) {
          this.currentPage = this.totalPages;
        }
        this.exito = true;
        this.addUser.reset();
      },
      (error) => {
        console.log(error);
         this.errorMessage=error.status+' - '+error.error.message;
        this.modalErrores = true;
      }
    )
  }

  borrar() {
    this.userService.delete(this.id).subscribe(
      (data) => {
        console.log(data);
        const pos = this.usuarios.findIndex(item => item.id == this.id);

        this.usuarios.splice(pos, 1);

        this.showDeleteModal = false;
        this.calculateTotalPages();

        const currentPageStartIndex = (this.currentPage - 1) * this.itemsPerPage;
        if (currentPageStartIndex >= this.usuariosFiltrados.length && this.currentPage > 1) {
          this.currentPage = this.currentPage - 1;
        }

        if (this.usuariosFiltrados.length === 0) {
          this.currentPage = 1;
        }
      },
      (error) => {
        this.modalErrores = true;
         this.errorMessage=error.status+' - '+error.error.message;
        console.log(error);
      }
    );
  }

  crearRol() {
    const body: Rol = {
      id: 0,
      name: this.addRol.get('name')?.value,
      description: this.addRol.get('description')?.value,
      level: this.addRol.get('level')?.value
    }
    this.rolService.post(body).subscribe(
      (data) => {
        console.log(data);
        this.roles.push(data);

        // CAMBIO: Actualizar array filtrado según búsqueda actual
        if (this.buscarRoles.trim()) {
          this.busquedaRoles();
        } else {
          this.rolesFiltrados = [...this.roles];
        }

        this.calculateTotalPagesRoles();

        const lastPageItems = this.rolesFiltrados.length % this.itemsPerPageRoles;
        if (lastPageItems === 1 && this.rolesFiltrados.length > this.itemsPerPageRoles) {
          this.currentPageRoles = this.totalPagesRoles;
        }
        this.exito = true;
        this.addRol.reset();
      },
      (error) => {
        this.modalErrores = true;
         this.errorMessage=error.status+' - '+error.error.message;
        console.log(error);
      }
    );
  }

  borrarRol() {
    this.rolService.delete(this.id).subscribe(
      (data) => {
        console.log(data);
        const pos = this.roles.findIndex(item => item.id == this.id);

        this.roles.splice(pos, 1);
        this.rolesFiltrados=this.roles;
        this.showDeleteModalRol = false;
        this.calculateTotalPagesRoles();

        const currentPageStartIndex = (this.currentPageRoles - 1) * this.itemsPerPageRoles;
        if (currentPageStartIndex >= this.rolesFiltrados.length && this.currentPageRoles > 1) {
          this.currentPageRoles = this.currentPageRoles - 1;
        }

        if (this.rolesFiltrados.length === 0) {
          this.currentPageRoles = 1;
        }
      },
      (error) => {
        this.modalErrores = true;
        this.errorMessage = error.status + ' - ' + error.error.message;
        console.log(error);
      }
    );
  }

  updateRol() {
    const body = {
      id: 0,
      name: this.editRol.get('name')?.value,
      description: this.editRol.get('description')?.value,
      level: this.editRol.get('level')?.value
    }
    console.log(body);
    this.rolService.put(this.id, body).subscribe(
      (data) => {
        this.showEditModalRol = false;
        this.exito = true;
        const pos = this.roles.findIndex(item => item.id == this.id);
        const posFiltrado = this.rolesFiltrados.findIndex(item => item.id == this.id);

        // Actualizar en ambos arrays
        this.roles[pos].level = data.level;
        this.roles[pos].description = data.description;
        this.roles[pos].name = data.name;

        this.rolesFiltrados[posFiltrado].level = data.level;
        this.rolesFiltrados[posFiltrado].description = data.description;
        this.rolesFiltrados[posFiltrado].name = data.name;

        this.editRol.reset();
      },
      (error) => {
        this.modalErrores = true;
        this.errorMessage = error.status + ' - ' + error.error.message;
        console.log(error);
      }
    );
  }

  // ===== MÉTODOS DE MODALES Y UTILIDADES =====
  closeDeleteModal() {
    this.showDeleteModal = false;
  }

  abrirDeleteModal(id: number) {
    this.showDeleteModal = true;
    this.id = id;
  }

  abrirEditModal(id: number) {
    const pos = this.usuarios.findIndex(item => item.id == id);
    const rolId = this.roles.find(item => item.name == this.usuarios[pos].roles);

    //Par el edit colocamos los valores correspondientes a ese usuario
    this.editUser.get('userName')?.setValue(this.usuarios[pos].userName);
    this.editUser.get('email')?.setValue(this.usuarios[pos].email);
    this.editUser.get('roleId')?.setValue(rolId?.id);
    this.editUser.get('name')?.setValue(this.usuarios[pos].name);
    this.editUser.get('lastName')?.setValue(this.usuarios[pos].lastname);
    this.editUser.get('empresa')?.setValue(this.usuarios[pos].empresa);
    this.showEditModal = true;
    this.id = id;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  updateUsuario() {
    const body: UsuarioPost = {
      userName: this.editUser.get('userName')?.value,
      password: this.editUser.get('password')?.value,
      email: this.editUser.get('email')?.value,
      roleId: this.editUser.get('roleId')?.value,
      name: this.editUser.get('name')?.value,
      lastname: this.editUser.get('lastName')?.value,
      empresa: this.editUser.get('empresa')?.value
    }
    this.userService.put(this.id, body).subscribe(
      (data) => {
        console.log(data);
        const pos = this.usuarios.findIndex(item => item.id == this.id);
        const posFiltrado = this.usuariosFiltrados.findIndex(item => item.id == this.id);
        const role = this.roles.find(item => item.id == body.roleId)?.name;

        // Actualizar en ambos arrays
        this.usuarios[pos].email = body.email;
        this.usuarios[pos].id = this.id;
        this.usuarios[pos].userName = body.userName;
        this.usuarios[pos].name = body.name;
        this.usuarios[pos].lastname = body.lastname;
        this.usuarios[pos].empresa = body.empresa;
        console.log(this.usuarios[pos]);
        if (role) {
          this.usuarios[pos].roles = role;
        }

        this.usuariosFiltrados[posFiltrado].email = body.email;
        this.usuariosFiltrados[posFiltrado].id = this.id;
        this.usuariosFiltrados[posFiltrado].userName = body.userName;
        if (role) {
          this.usuariosFiltrados[posFiltrado].roles = role;
        }

        this.showEditModal = false;
        this.exito = true;
      },
      (error) => {
        this.modalErrores = true;
        this.errorMessage = error.status + ' - ' + error.error.message;
        console.log(error);
      }
    )
  }

  cerrarModal() {
    this.exito = false;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  usuarioAvatar() {
    const pos = this.usuarios.findIndex(item => item.id == this.id);
    return this.usuarios[pos].userName.substring(0, 2).toUpperCase();
  }

  nombreUsuario() {
    const pos = this.usuarios.findIndex(item => item.id == this.id);
    return this.usuarios[pos].userName;
  }

  calcularUsuariosAsignados(rol: string) {
    return this.usuariosFiltrados.filter(item => item.roles == rol).length;
  }

  closeDeleteModalRol() {
    this.showDeleteModalRol = false;
  }

  abrirDeleteModalRol(id: number) {
    this.showDeleteModalRol = true;
    this.id = id;
  }

  abrirEditModalRol(id: number) {
    const pos = this.roles.findIndex(item => item.id == id);
    this.editRol.get('name')?.setValue(this.roles[pos].name);
    this.editRol.get('level')?.setValue(this.roles[pos].level);
    this.editRol.get('description')?.setValue(this.roles[pos].description);

    this.showEditModalRol = true;
    this.id = id;
  }

  closeEditModalRol() {
    this.showEditModalRol = false;
  }

  nombreRol() {
    const pos = this.roles.findIndex(item => item.id == this.id);
    return this.roles[pos].name;
  }

  scrollToElement(elementId: string) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  onFilesSelected(event: any): void {
    const file = event.target.files[0]; // Obtiene el primer archivo seleccionado
    if (file) {
      this.selectedFile = file;
    }

    const imagePreview = document.getElementById('imagePreview') as HTMLImageElement;
    if (imagePreview) {
      imagePreview.src = URL.createObjectURL(file);//Crea una ruta temporal para las imagenes;
    }
  }

  crearAplicacion() {
    if (this.selectedFile == null) {
      return;
    }

    const formData = new FormData();
    const imagePreview = document.getElementById('imagePreview') as HTMLImageElement;
    formData.append('image', this.selectedFile);
    formData.append('name', this.addAplication.get('name')?.value);
    formData.append('description', this.addAplication.get('description')?.value);
    formData.append('url', this.addAplication.get('url')?.value);
    formData.append('estado', this.addAplication.get('estado')?.value);
    formData.append('version', this.addAplication.get('version')?.value);
    formData.append('autor', this.addAplication.get('autor')?.value);

    this.aplicacionService.post(formData).subscribe(
      (data) => {
        console.log(data);

        // Solo agregar al array principal
        this.aplicaciones.push({
          id: data.id,
          name: data.name,
          description: data.description,
          url: data.url,
          icon: data.icon,
          estado: data.estado,
          version: data.version,
          autor: data.autor,
          fechaActualizacion: data.fechaActualizacion

        });
        imagePreview.src = '';

        // Actualizar el array filtrado basándose en la búsqueda actual
        if (this.buscarAplicaciones.trim()) {
          this.busquedaAplicaciones(); // Esto actualizará aplicacionesFiltradas
        } else {
          this.aplicacionesFiltradas = [...this.aplicaciones]; // Sin búsqueda, mostrar todas
        }

        this.calculateTotalPagesAplicaciones();

        const lastPageItems = this.aplicacionesFiltradas.length % this.itemsPerPageAplicaciones;
        if (lastPageItems === 1 && this.aplicacionesFiltradas.length > this.itemsPerPageAplicaciones) {
          this.currentPageAplicaciones = this.totalPagesAplicaciones;
        }

        this.exito = true;
        this.addAplication.reset();
        this.selectedFile = null;
      },
      (error) => {
        this.modalErrores = true;
        this.errorMessage = error.status + ' - ' + error.error.message;
        console.log(error);
      }
    );
  }

  closeDeleteModalAplicacion() {
    this.showDeleteModalAplicacion = false;
  }

  borrarAplicacion() {
    this.aplicacionService.delete(this.id).subscribe(
      (data) => {
        console.log(data);
        const pos = this.aplicaciones.findIndex(item => item.id == this.id);


        this.aplicaciones.splice(pos, 1);

        this.showDeleteModalAplicacion = false;
        this.calculateTotalPagesAplicaciones();

        const currentPageStartIndex = (this.currentPageAplicaciones - 1) * this.itemsPerPageAplicaciones;
        if (currentPageStartIndex >= this.aplicacionesFiltradas.length && this.currentPageAplicaciones > 1) {
          this.currentPageAplicaciones = this.currentPageAplicaciones - 1;
        }

        if (this.aplicacionesFiltradas.length === 0) {
          this.currentPageAplicaciones = 1;
        }
      },
      (error) => {
        this.modalErrores = true;
        this.errorMessage = error.status + ' - ' + error.error.message;
        console.log(error);
      }
    )
  }

  abrirModalDeleteAplicacion(id: number) {
    this.id = id;
    this.showDeleteModalAplicacion = true;
  }

  abrirModalAsignacion(id: number) {
    const i = this.usuariosFiltrados.findIndex(item => item.id == id);
    this.id = i;//Realmente esto no es el id es la posicion del array de los usarios, pero nos sirve en este caso.
    this.showModalAsignacion = true;
  }

  abrirModalAsignacionEquipos(i: number) {

    this.id = i;//Realmente esto no es el id es la posicion del array de los usuarios, pero nos sirve en este caso.
    this.showModalAsignacion = true;
  }

  cerrarModalAsignacion() {
    this.aplicacionesFiltradas = this.aplicaciones;
    this.aplicacionesAsignacion = '';
    this.showModalAsignacion = false;
  }
  cerrarModalAsignacionEquipos() {
    this.showEquipos = false;
    this.usuariosAsignacion = '';
    this.usuariosFiltrados = this.usuarios;

  }

  guardarRolesAplicaciones(idUsuario: number) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    let longitudChecbox = 0;
    for (let i = 0; i < checkboxes.length; i++) {
      const checkbox = checkboxes[i] as HTMLInputElement;
      const encontrado = this.rolesAplicaciones.find(item => item.userId == idUsuario && item.applicationId == Number(checkbox.value));

      if (checkbox.checked && encontrado == undefined) {
        longitudChecbox++;

      }
    }

    let completado = 0;

    for (let i = 0; i < checkboxes.length; i++) {
      const checkbox = checkboxes[i] as HTMLInputElement;
      if (checkbox.checked) {
        const encontrado = this.rolesAplicaciones.find(item => item.userId == idUsuario && item.applicationId == Number(checkbox.value));
        if (encontrado === undefined) {
          const body = {
            id: 0,
            userId: idUsuario,
            applicationId: Number(checkbox.value)

          };
          this.rolesAplicacionesService.post(body).subscribe(
            (data) => {
              console.log(data);
              this.rolesAplicaciones.push({
                id: data.id,
                userId: data.userId,
                applicationId: data.applicationId
              });


              completado++;

              if (completado == longitudChecbox) {
                this.cerrarModalAsignacion();//Para cerrar el modal
                this.exito = true;
              }

              console.log(this.rolesAplicaciones);
            },
            (error) => {
              this.modalErrores = true;
              this.errorMessage = error.status + ' - ' + error.error.message;
              console.log(error);
            }
          );
        }

      }
      else {
        const encontrado = this.rolesAplicaciones.find(item => item.userId == idUsuario && item.applicationId == Number(checkbox.value));
        if (encontrado !== undefined) {

          this.rolesAplicacionesService.delete(encontrado.id).subscribe(
            (data) => {
              const pos = this.rolesAplicaciones.findIndex(item => item.id == encontrado.id);
              this.rolesAplicaciones.splice(pos, 1);
              console.log(data);
              if (completado == longitudChecbox) {
                this.cerrarModalAsignacion();//Para cerrar el modal
                this.exito = true;
              }
            },
            (error) => {
              this.modalErrores = true;
              this.errorMessage = error.status + ' - ' + error.error.message;
              console.log(error);
            }
          );
        }

      }

    }
  }
  guardarUsuariosEquipos(idEquipo: number) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    let longitudChecbox = 0;
    for (let i = 0; i < checkboxes.length; i++) {
      const checkbox = checkboxes[i] as HTMLInputElement;
      const encontrado = this.usuariosFiltrados.find(item => item.id == Number(checkbox.value) && item.equipoId == idEquipo);

      if (checkbox.checked && encontrado == undefined) {
        longitudChecbox++;

      }
    }

    let completado = 0;

    for (let i = 0; i < checkboxes.length; i++) {
      const checkbox = checkboxes[i] as HTMLInputElement;
      if (checkbox.checked) {
        const encontrado = this.usuariosFiltrados.find(item => item.id == Number(checkbox.value) && item.equipoId == idEquipo);
        if (encontrado === undefined) {

          this.userService.patch(Number(checkbox.value), idEquipo).subscribe(
            (data) => {

              const pos = this.usuarios.findIndex(item => item.id == Number(checkbox.value))

              this.usuarios[pos].equipoId = data.equipoId;
              completado++;

              if (completado == longitudChecbox) {
                this.cerrarModalAsignacionEquipos();
                this.exito = true;
              }

              console.log(this.usuarios);
            },
            (error) => {
              this.modalErrores = true;
               this.errorMessage=error.status+' - '+error.error.message;
              console.log(error);
            }
          );
        }

      }
      else {
        const encontrado = this.usuarios.find(item => item.id == Number(checkbox.value) && item.equipoId == idEquipo);
        if (encontrado !== undefined) {

          this.userService.patch(Number(checkbox.value), null).subscribe(
            (data) => {
              const pos = this.usuarios.findIndex(item => item.id == encontrado.id);
              this.usuarios[pos].equipoId = data.equipoId;
              console.log(data);
              if (completado == longitudChecbox) {
                this.cerrarModalAsignacionEquipos();
                this.exito = true;
              }
            },
            (error) => {
              this.modalErrores = true;
               this.errorMessage=error.status+' - '+error.error.message;
              console.log(error);
            }
          );
        }

      }

    }
  }
  comprobar(idUsuario: Number, idAplicacion: number) {
    const encontrado = this.rolesAplicaciones.find(item => item.userId == idUsuario && item.applicationId == idAplicacion);
    if (encontrado !== undefined) {
      return true;
    }
    else {
      return false;
    }
  }
  comprobarEquipos(idEquipo: Number, idUsuario: number) {
    const encontrado = this.usuarios.find(item => item.id == idUsuario && item.equipoId == idEquipo);
    if (encontrado !== undefined) {
      return true;
    }
    else {
      return false;
    }
  }

  comp(idEquipo: Number, idUsuario: number) {//Para comprobar que el usuario aparezca si no pertenece a ningun equipo.
    const encontrado = this.usuarios.find(item => item.id == idUsuario && item.equipoId == idEquipo);
    const encontrar = this.usuarios.find(item => item.id == idUsuario && item.equipoId == null);
    const nombreUsuario = this.usuarios.find(item => item.id == idUsuario)?.name;
    console.log(encontrado);
    const jefeEquipo = this.equipos.find(item => item.nombreJefe == nombreUsuario);


    if (jefeEquipo !== undefined) {
      return false;
    }
    if (encontrado !== undefined || encontrar !== undefined) {
      return true;
    }
    else {
      return false;
    }
  }
  calcularUsuarios(idAplicacion: number) {

    return this.rolesAplicaciones.filter(item => item.applicationId == idAplicacion).length;
  }

  abrirShowUsuarios(idAplicacion: number) {
    this.usuariosAplicaciones = [];
    this.usuariosAplicacionesFiltros = [];
    const aplicaciones = this.rolesAplicaciones.filter(item => item.applicationId == idAplicacion);
    this.showUsuarios = true;
    if (aplicaciones !== undefined) {
      for (let i = 0; i < aplicaciones.length; i++) {
        const usuario = this.usuarios.find(item => item.id == aplicaciones[i].userId);
        if (usuario !== undefined) {
          this.usuariosAplicaciones.push(usuario);
          this.usuariosAplicacionesFiltros.push(usuario);
        }

      }
    }

  }

  cerrarUsuarios() {

    this.showUsuarios = false;

  }

  // Agregar este método en tu componente TypeScript
  tieneAsignacion(usuarioId: number, aplicacionId: number): boolean {

    return this.rolesAplicaciones.find(item =>
      item.userId === usuarioId && item.applicationId === aplicacionId
    ) !== undefined;
  }

  //Para la búsqueda de usuarios en la lista de aplicaciones.
  buscarUsuarios() {
    this.usuariosAplicacionesFiltros = this.usuariosAplicaciones.filter(item => item.userName.toLowerCase().includes(this.busquedaUsuarios.toLowerCase()));

  }
  abrirModalAplicacion(i: number) {
    this.editAplication.get('name')?.setValue(this.aplicaciones[i].name);
    this.editAplication.get('description')?.setValue(this.aplicaciones[i].description);
    this.editAplication.get('url')?.setValue(this.aplicaciones[i].url);
    this.editAplication.get('version')?.setValue(this.aplicaciones[i].version);
    this.editAplication.get('autor')?.setValue(this.aplicaciones[i].autor);
    this.editAplication.get('estado')?.setValue(this.aplicaciones[i].estado);
    console.log(this.editAplication);
    this.id = this.aplicaciones[i].id;

    this.imagenUrl = 'https://localhost:7028/' + this.aplicaciones[i].icon;

    console.log(this.imagenUrl);
    this.showEditModalAplicacion = true;
  }
  cerrarModalAplicacion() {
    this.showEditModalAplicacion = false;
  }

  updateAplicacion() {

    const form = new FormData();
    if (this.selectedFile !== null) {
      form.append('image', this.selectedFile);
    }
    console.log(this.selectedFile);
    form.append('name', this.editAplication.get('name')?.value);
    form.append('description', this.editAplication.get('description')?.value);
    form.append('url', this.editAplication.get('url')?.value);
    form.append('estado', this.editAplication.get('estado')?.value);
    form.append('version', this.editAplication.get('version')?.value);
    form.append('autor', this.editAplication.get('autor')?.value);
    this.aplicacionService.put(this.id, form).subscribe(
      (data) => {
        //Actualizamos la vista con los nuevos valores.
        const pos = this.aplicaciones.findIndex(item => item.id == this.id);
        this.aplicaciones[pos].icon = data.icon;
        this.aplicaciones[pos].name = data.name;
        this.aplicaciones[pos].url = data.url;
        this.aplicaciones[pos].description = data.description;
        this.aplicaciones[pos].autor = data.autor;
        this.aplicaciones[pos].estado = data.estado;
        this.aplicaciones[pos].version = data.version;
        this.aplicaciones[pos].fechaActualizacion = data.fechaActualizacion;
        console.log(data);
        this.selectedFile = null;
        this.showEditModalAplicacion = false;
        this.exito = true;

      },
      (error) => {
        this.modalErrores = true;
         this.errorMessage=error.status+' - '+error.error.message;
        console.log(error);
      }
    )

  }

  cambiarImagen(evento: Event) {

    const input = evento.target as HTMLInputElement;
    this.selectedFile = null;
    URL.revokeObjectURL(this.imagenUrl);
    if (input && input.files && input.files.length > 0) {
      const imagen = input.files[0];
      this.selectedFile = imagen;

      //El problema es que a veces no entra aqui 
      this.imagenUrl = URL.createObjectURL(imagen);
    }
  }


  crearEquipo() {
    const body = {
      nombre: this.addEquipos.get('nombre')?.value,
      jefeEquipoId: this.addEquipos.get('jefeEquipo')?.value,
      empresa: this.addEquipos.get('empresa')?.value
    }

    this.equipoService.post(body).subscribe(
      (data) => {
        console.log(data);
        this.equipos.push(data);

        // Actualizar array filtrado según búsqueda actual
        if (this.bEquipos.trim()) {
          this.buscarEquipo();
        } else {
          this.equiposFiltrados = [...this.equipos];
        }

        this.calculateTotalPagesEquipos();

        // Ir a la última página si se agregó un nuevo elemento
        const lastPageItems = this.equiposFiltrados.length % this.itemsPerPageEquipos;
        if (lastPageItems === 1 && this.equiposFiltrados.length > this.itemsPerPageEquipos) {
          this.currentPageEquipos = this.totalPagesEquipos;
        }

        this.exito = true;
        this.addEquipos.reset();
      },
      (error) => {
        this.modalErrores = true;
         this.errorMessage=error.status+' - '+error.error.message;
        console.log(error);
      }
    );
  }

  showModalDeleteEquipos(id: number) {
    this.showDeleteModalEquipos = true;
    this.id = id;

  }
  closeDeleteModalEquipos() {
    this.showDeleteModalEquipos = false;
  }

  // ===== MÉTODO BORRAR EQUIPO =====
  borrarEquipo() {
    this.equipoService.delete(this.id).subscribe(
      (data) => {
        console.log(data);
        const pos = this.equipos.findIndex(item => item.id == this.id);
        const pos2=this.equiposFiltrados.findIndex(item=>item.id==this.id);

        this.equipos.splice(pos, 1);
        this.equiposFiltrados.splice(pos2,1);
        this.showDeleteModalEquipos = false;
        this.calculateTotalPagesEquipos();

        // Ajustar página actual si es necesario
        const currentPageStartIndex = (this.currentPageEquipos - 1) * this.itemsPerPageEquipos;
        if (currentPageStartIndex >= this.equiposFiltrados.length && this.currentPageEquipos > 1) {
          this.currentPageEquipos = this.currentPageEquipos - 1;
        }

        if (this.equiposFiltrados.length === 0) {
          this.currentPageEquipos = 1;
        }
      },
      (error) => {
        this.modalErrores = true;
         this.errorMessage=error.status+' - '+error.error.message;
        console.log(error);
      }
    );
  }
  buscarUsuariosEquipos(id: number) {
    return this.usuarios.filter(item => item.equipoId == id).length;
  }

  showModalEditEquipos(id: number) {
    this.id = id;
    const pos = this.equipos.findIndex(item => item.id == this.id);
    const encontrado = this.usuarios.find(item => item.name == this.equiposFiltrados[pos].nombreJefe)?.id;

    // Resetear completamente el formulario
    this.editEquipos.reset();
    this.editEquipos.markAsUntouched();
    this.editEquipos.markAsPristine();

    this.showEditModalEquipo = true;

    setTimeout(() => {
      this.editEquipos.patchValue({
        nombre: this.equiposFiltrados[pos].nombre || '',
        jefeEquipo: encontrado || null,
        empresa: this.equiposFiltrados[pos].empresa || ''
      });
    }, 100);

    console.log(encontrado);
  }

  closeEditEquipos() {
    this.showEditModalEquipo = false;
  }

  nombreIcono() {
    return this.equiposFiltrados.find(item => item.id == this.id)?.nombre.substring(0, 2).toUpperCase();
  }

  updateEquipos() {

    const body = {
      nombre: this.editEquipos.get('nombre')?.value,
      jefeEquipoId: this.editEquipos.get('jefeEquipo')?.value,
      empresa: this.editEquipos.get('empresa')?.value
    }
    const pos = this.equipos.findIndex(item => item.id == this.id);
    this.equipoService.put(this.id, body).subscribe(
      (data) => {
        this.equipos[pos].empresa = this.editEquipos.get('empresa')?.value;
        this.equipos[pos].nombre = this.editEquipos.get('nombre')?.value;
        this.equipos[pos].nombreJefe = data.nombreJefe;
        console.log(data.nombreJefe);
        this.showEditModalEquipo = false;
      },
      (error) => {
        this.modalErrores = true;
         this.errorMessage=error.status+' - '+error.error.message;
        console.log(error);
      }
    );
  }

  equiposUsuarios(id: number) {
    const i = this.equiposFiltrados.findIndex(item => item.id == id);
    this.id = i;
    this.showEquipos = true;
  }
  buscarEquipo() {
    this.equiposFiltrados = this.equipos.filter(item =>
      item.nombre.toLowerCase().includes(this.bEquipos.toLowerCase()) ||
      item.empresa.toLowerCase().includes(this.bEquipos.toLowerCase()) ||
      item.nombreJefe.toLowerCase().includes(this.bEquipos.toLowerCase())
    );
    this.currentPageEquipos = 1; // Resetear a la primera página
    this.calculateTotalPagesEquipos();
  }

  // ===== MÉTODOS DE PAGINACIÓN PARA Equipos=====
  calculateTotalPagesEquipos(): void {
    this.totalPagesEquipos = Math.ceil(this.equiposFiltrados.length / this.itemsPerPageEquipos);
  }

  getPaginatedEquipos(): Equipos[] {
    const startIndex = (this.currentPageEquipos - 1) * this.itemsPerPageEquipos;
    const endIndex = startIndex + this.itemsPerPageEquipos;
    return this.equiposFiltrados.slice(startIndex, endIndex);
  }

  previousPageEquipos(): void {
    if (this.currentPageEquipos > 1) {
      this.currentPageEquipos--;
    }
  }

  nextPageEquipos(): void {
    if (this.currentPageEquipos < this.totalPagesEquipos) {
      this.currentPageEquipos++;
    }
  }

  goToPageEquipos(page: number): void {
    if (page >= 1 && page <= this.totalPagesEquipos) {
      this.currentPageEquipos = page;
    }
  }

  getPageNumbersEquipos(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPageEquipos - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPagesEquipos, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  hasPreviousPageEquipos(): boolean {
    return this.currentPageEquipos > 1;
  }

  hasNextPageEquipos(): boolean {
    return this.currentPageEquipos < this.totalPagesEquipos;
  }

  getCurrentPageEndIndexEquipos(): number {
    return Math.min(this.currentPageEquipos * this.itemsPerPageEquipos, this.equiposFiltrados.length);
  }

  buscarAplicacionesAsignacion() {

    this.aplicacionesFiltradas = this.aplicaciones.filter(item =>
      item.name.toLowerCase().trim().includes(this.aplicacionesAsignacion.toLowerCase()) ||
      item.description.toLowerCase().includes(this.aplicacionesAsignacion.toLowerCase()) ||
      item.url.toLowerCase().includes(this.aplicacionesAsignacion.toLowerCase())
    );
  }

  buscarUsuariosAsignacion() {
    this.usuariosFiltrados = this.usuarios.filter(item =>
      item.userName.toLowerCase().trim().includes(this.usuariosAsignacion.toLowerCase()) ||
      item.name.toLowerCase().includes(this.usuariosAsignacion.toLowerCase()) ||
      item.email.toLowerCase().includes(this.usuariosAsignacion.toLowerCase())
    );
  }

  cerrarModalErrores() {
    this.modalErrores = false;
  }

}