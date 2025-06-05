import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Usuario, UsuarioPost } from '../types/usuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  url=environment.url+'/User';
  constructor(private http:HttpClient) { }

  get():Observable<Usuario[]>{
    return this.http.get<Usuario[]>(this.url);
  }
  
  getById(id:number):Observable<Usuario>{
    return this.http.get<Usuario>(`${this.url}/${id}`);

  }
  post(usuario:UsuarioPost):Observable<Usuario>{
   
    return this.http.post<Usuario>(this.url,usuario);
  }
  delete(id:number){
    return this.http.delete(this.url+'/'+id);
  }
  put(id:number,usuario:UsuarioPost){
    const body={
      userName:usuario.userName,
      email:usuario.email,
      roleId:usuario.roleId,
      password:usuario.password

    }
    return this.http.put(this.url+'/'+id,body);
  }
}
