import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../types/usuario';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-adminitracion',
  imports: [],
  templateUrl: './adminitracion.component.html',
  styleUrl: './adminitracion.component.css'
})
export class AdminitracionComponent implements OnInit {

  usuarios: Usuario[] = [];

  constructor(private userService:UsuarioService){}

  ngOnInit(): void {
   this.userService.get().subscribe(
    (data)=>{
      this.usuarios=data;
      
      console.log(data);
    },
    (error)=>{
      console.log(error);
    }
   );
  }

}
