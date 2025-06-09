import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rol } from '../types/rol';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  url = environment.url + '/Roles';
  constructor(private http: HttpClient) { }

  get(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.url);
  }

  post(rol:Rol):Observable<Rol>{
    const body={
      name:rol.name,
      description:rol.description,
      level:rol.level
    }
    return this.http.post<Rol>(this.url+'/create',body);
  }
  delete(id:number){
    return this.http.delete(this.url+'/'+id);
  }
  put(id:number,rol:Rol):Observable<Rol>{
    const body={
      name:rol.name,
    description:rol.description,
    level:rol.level   
    }

    return this.http.put<Rol>(this.url+'/'+id,body);
  }
}
