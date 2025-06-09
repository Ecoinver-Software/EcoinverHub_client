import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { Observable } from 'rxjs';
import { AsignarAplicaciones } from '../types/asignarAplicaciones';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AsignarAplicacionesService {
  url=environment.url+'/RoleApplication';
  constructor(private http:HttpClient) { }

  get():Observable<AsignarAplicaciones[]>{
    return this.http.get<AsignarAplicaciones[]>(this.url);
  }

  post(rolAplicaciones:AsignarAplicaciones):Observable<AsignarAplicaciones>{
    const body={
      userId:rolAplicaciones.userId,
      applicationId:rolAplicaciones.applicationId
    };

    return this.http.post<AsignarAplicaciones>(this.url,body);
  }

  delete(id:number){
    return this.http.delete(this.url+'/'+id);
  }

}
