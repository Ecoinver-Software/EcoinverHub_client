import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../types/usuario';
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
}
