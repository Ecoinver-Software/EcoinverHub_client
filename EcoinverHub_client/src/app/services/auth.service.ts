import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { User } from '../types/User';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  url=environment.url + '/Auth';
  constructor(private http:HttpClient) { }

  login(usuario:User):Observable<{token:string,rol:string}>{
    
    return this.http.post<{token:string,rol:string}>(`${this.url}/login`, usuario);   
    
  }
  setToken(token:string){
    localStorage.setItem('jwt',token);
  }
  getToken(){
    localStorage.getItem('jwt');
  }
}
