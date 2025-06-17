import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipos, EquiposPost } from '../types/equipos';

@Injectable({
  providedIn: 'root'
})
export class EquiposService {
  url=environment.url+'/Equipos';
  constructor(private http:HttpClient) { }

  get():Observable<Equipos[]>{
    return this.http.get<Equipos[]>(this.url);
  }

  post(equipo:EquiposPost):Observable<Equipos>{
    
    return this.http.post<Equipos>(this.url,equipo);

  }

  put(id:number,equipo:EquiposPost):Observable<Equipos>{

    return this.http.put<Equipos>(this.url+'/'+id,equipo);

  }

  delete(id:number){
    return this.http.delete(this.url+'/'+id);
  }
  
}
