import { Component, OnInit } from '@angular/core';
import { Usuario, UsuarioPost } from '../../types/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { Rol } from '../../types/rol';
import { RolService } from '../../services/rol.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AplicacionesService } from '../../services/aplicaciones.service';
import { Aplicacion } from '../../aplicacion';

@Component({
  selector: 'app-adminitracion',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './administracion.component.html',
  styleUrl: './administracion.component.css'
})
export class AdminitracionComponent implements OnInit {

  usuarios: Usuario[] = [];
  roles: Rol[] = [];
  aplicaciones:Aplicacion[]=[];
  id: number = 0;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  showDeleteModalRol: boolean = false;
  
  // Propiedades para la paginación de usuarios
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;
  
  // Propiedades para la paginación de roles
  currentPageRoles: number = 1;
  itemsPerPageRoles: number = 5;
  totalPagesRoles: number = 0;
  selectedFile: File | null = null; // Solo un archivo 
  addAplication:FormGroup;
  activeTab: string = 'usuarios';
  buscar: string = '';
  buscarRoles: string = '';
  addUser: FormGroup;
  editUser: FormGroup;
  exito: boolean = false;
  usuariosFiltrados: Usuario[] = [];
  rolesFiltrados: Rol[] = [];
  addRol: FormGroup;
  showEditModalRol: boolean = false;
  editRol: FormGroup;
  rolesFiltros:Rol[]=[];
  constructor(private userService: UsuarioService, private rolService: RolService,private aplicacionService:AplicacionesService) {
    this.addUser = new FormGroup({
      userName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+$/)]),
      password: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      roleId: new FormControl('', Validators.required)
    });

    this.editUser = new FormGroup({
      userName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+$/)]),
      password: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      roleId: new FormControl('', Validators.required)
    });

    this.addRol = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+$/)]),
      description: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]),
      level: new FormControl('', Validators.required)
    });

    this.editRol = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+$/)]),
      description: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]),
      level: new FormControl('', Validators.required)
    });

    this.addAplication=new FormGroup({
        name:new FormControl('',[Validators.required,Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+$/)]),
        description:new FormControl('',[Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]),
        url:new FormControl('',Validators.required)
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
      (data)=>{
        this.aplicaciones=data;
      },
      (error)=>{
        console.log(error);
      }
    )
  }

  // ===== MÉTODOS DE PAGINACIÓN PARA USUARIOS =====
  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.usuariosFiltrados.length / this.itemsPerPage);
  }

  getPaginatedUsers(): Usuario[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.usuariosFiltrados.slice(startIndex, endIndex);
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

  // ===== MÉTODOS EXISTENTES =====
  crearUsuario() {
    const body: UsuarioPost = {
      userName: this.addUser.get('userName')?.value,
      password: this.addUser.get('password')?.value,
      email: this.addUser.get('email')?.value,
      roleId: this.addUser.get('roleId')?.value
    }

    this.userService.post(body).subscribe(
      (data) => {
        console.log(data)
        this.usuarios.push(data);
        this.usuariosFiltrados.push(data);
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
      }
    )
  }

  borrar() {
    this.userService.delete(this.id).subscribe(
      (data) => {
        console.log(data);
        const pos = this.usuarios.findIndex(item => item.id == this.id);
        const posFiltrado = this.usuariosFiltrados.findIndex(item => item.id == this.id);
        
        this.usuarios.splice(pos, 1);
        this.usuariosFiltrados.splice(posFiltrado, 1);
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
        this.rolesFiltrados.push(data);
        this.calculateTotalPagesRoles();

        const lastPageItems = this.rolesFiltrados.length % this.itemsPerPageRoles;
        if (lastPageItems === 1 && this.rolesFiltrados.length > this.itemsPerPageRoles) {
          this.currentPageRoles = this.totalPagesRoles;
        }
        this.exito = true;
        this.addRol.reset();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  borrarRol() {
    this.rolService.delete(this.id).subscribe(
      (data) => {
        console.log(data);
        const pos = this.roles.findIndex(item => item.id == this.id);
        const posFiltrado = this.rolesFiltrados.findIndex(item => item.id == this.id);
        
        this.roles.splice(pos, 1);
        this.rolesFiltrados.splice(posFiltrado, 1);
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
      roleId: this.editUser.get('roleId')?.value
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
  }
  crearAplicacion(){
    if(this.selectedFile==null){
      return;
    }

    const formData=new FormData();

    formData.append('imagen',this.selectedFile);
    formData.append('name',this.addAplication.get('name')?.value);
    formData.append('description',this.addAplication.get('description')?.value);
    formData.append('url',this.addAplication.get('url')?.value);
    this.aplicacionService.post(formData).subscribe(
      (data)=>{
        console.log(data);
      },
      (error)=>{
        console.log(error);
      }
    )

  }
}