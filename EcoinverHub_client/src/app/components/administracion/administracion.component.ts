import { Component, OnInit } from '@angular/core';
import { Usuario, UsuarioPost } from '../../types/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { Rol } from '../../types/rol';
import { RolService } from '../../services/rol.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-adminitracion',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './administracion.component.html',
  styleUrl: './administracion.component.css'
})
export class AdminitracionComponent implements OnInit {

  usuarios: Usuario[] = [];
  roles: Rol[] = [];
  id: number = 0;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  // Propiedades para la paginación
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;
  activeTab: string = 'usuarios';
  buscar: string = '';
  addUser: FormGroup;
  editUser: FormGroup;
  exito: boolean = false;
  usuariosFiltrados: Usuario[] = [];

  constructor(private userService: UsuarioService, private rolService: RolService) {
    this.addUser = new FormGroup({
      userName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      roleId: new FormControl('', Validators.required)
    });
    this.editUser = new FormGroup({
      userName: new FormControl('', Validators.required),
      password: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      roleId: new FormControl('', Validators.required)
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
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // Calcular el total de páginas
  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.usuarios.length / this.itemsPerPage);
  }

  // Obtener usuarios para la página actual
  getPaginatedUsers(): Usuario[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    console.log('Hola mundo');
    return this.usuariosFiltrados.slice(startIndex, endIndex);
    
  }

  // Ir a la página anterior
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Ir a la página siguiente
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Ir a una página específica
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Obtener array de números de página para mostrar
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    // Ajustar si estamos cerca del final
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  // Verificar si la página anterior está disponible
  hasPreviousPage(): boolean {
    return this.currentPage > 1;
  }

  // Verificar si la página siguiente está disponible
  hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }

  // Método para obtener el índice final de la página actual
  getCurrentPageEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.usuarios.length);
  }

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
        console.log(data);
        this.calculateTotalPages(); // Recalcular páginas después de agregar usuario

        // Si estamos en la última página y se llena, ir a la nueva página
        const lastPageItems = this.usuarios.length % this.itemsPerPage;
        if (lastPageItems === 1 && this.usuarios.length > this.itemsPerPage) {
          this.currentPage = this.totalPages;

        }
        this.exito = true;
        this.addUser.reset(); // Limpiar formulario después de crear usuario
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
        this.usuarios.splice(pos, 1);
        this.showDeleteModal = false;
        this.calculateTotalPages(); // Recalcular páginas después de agregar usuario
        // Si estamos en la última página y se queda vacía, ir a la página anterior
        const currentPageStartIndex = (this.currentPage - 1) * this.itemsPerPage;
        if (currentPageStartIndex >= this.usuarios.length && this.currentPage > 1) {
          this.currentPage = this.currentPage - 1;
        }

        // Si no hay usuarios, resetear a página 1
        if (this.usuarios.length === 0) {
          this.currentPage = 1;
        }

      },
      (error) => {
        console.log(error);
      }
    )
  }
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
        const role = this.roles.find(item => item.id == body.roleId)?.name;

        this.usuarios[pos].email = body.email;
        this.usuarios[pos].id = this.id;
        this.usuarios[pos].userName = body.userName;
        if (role) {
          this.usuarios[pos].roles = role;
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

  busqueda() {


    this.usuariosFiltrados = this.usuarios.filter(item => item.userName.toLowerCase().trim().includes(this.buscar) || item.roles.toLowerCase().includes(this.buscar) || item.email.toLowerCase().includes(this.buscar));

  }
}