import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Anuncio, AnuncioPost, AnuncioPut } from '../types/anuncio';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnuncioService {

  constructor(private http:HttpClient) { }
 
  url=environment.url+'/Anuncios';

  get():Observable<Anuncio[]>{
      return this.http.get<Anuncio[]>(this.url);
  }

  getById(id:number):Observable<Anuncio>{
    return this.http.get<Anuncio>(`${this.url}/${id}`);
  }

  post(anuncio:Anuncio):Observable<AnuncioPost>{
    return this.http.post<AnuncioPost>(this.url,anuncio);
  }

  put(id:number,anuncio:Anuncio):Observable<AnuncioPut>{
    return this.http.put<AnuncioPut>(`${this.url}/${id}`,anuncio);
  }

  delete(id:number){
    return this.http.delete(this.url+'/'+id);
  }
  

}
