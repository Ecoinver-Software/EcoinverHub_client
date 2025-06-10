import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aplicacion } from '../types/aplicacion';

@Injectable({
  providedIn: 'root'
})
export class AplicacionesService {
  url=environment.url+'/Applications';
  constructor(private http:HttpClient) { }

  get():Observable<Aplicacion[]>{
    return this.http.get<Aplicacion[]>(this.url);
  }

  post(formData:FormData):Observable<Aplicacion>{
    return this.http.post<Aplicacion>(this.url,formData);
  }

  delete(id:number){
   return this.http.delete(this.url+'/'+id);
  }
   put(id:number,form:FormData):Observable<Aplicacion>{
    return this.http.put<Aplicacion>(this.url+'/'+id,form);
  }
}
