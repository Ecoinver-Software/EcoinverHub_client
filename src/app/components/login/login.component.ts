import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { User } from '../../types/User';
import { AuthServiceService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  login: FormGroup;
  errorMessage:boolean=false;
  connectionError:boolean=false;
  constructor(private authService: AuthServiceService,private ruta:Router
  ) {
    this.login = new FormGroup({
      usuario: new FormControl('', Validators.required),
      contrasena: new FormControl('', Validators.required)
    });
  }

  acceso() {
    if (this.login.valid) {
      const user: User = {
        username: this.login.get('usuario')?.value,
        email:'',
        password: this.login.get('contrasena')?.value

      }
      console.log(user);
      this.authService.login(user).subscribe(
        (data) => {
          console.log(data.token);
          
          this.authService.setToken(data.token);
          this.ruta.navigate(['/home']);
        },
        (error) => {
          console.log(error);
          this.errorMessage=true;
          setTimeout(()=>{
            this.errorMessage=false;
            alert('Acceso incorrecto');
          },2500);
        }


      )

    }
  }

}
