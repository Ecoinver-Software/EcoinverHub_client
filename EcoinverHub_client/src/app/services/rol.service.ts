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
}
