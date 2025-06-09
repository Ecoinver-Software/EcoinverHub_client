import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aplicacion } from '../aplicacion';

@Injectable({
  providedIn: 'root'
})
export class AplicacionesService {
  url=environment.url+'/Applications';
  constructor(private http:HttpClient) { }

  get():Observable<Aplicacion[]>{
    return this.http.get<Aplicacion[]>(this.url);
  }

  post(formData:FormData){
    return this.http.post(this.url,formData);
  }
}
