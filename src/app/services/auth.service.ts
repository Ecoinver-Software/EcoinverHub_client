import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { User } from '../types/User';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  url = environment.url + '/Auth';
  constructor(private http: HttpClient) { }

  login(usuario: User): Observable<{ token: string, id: number, rol: string }> {

    return this.http.post<{ token: string, id: number, rol: string }>(`${this.url}/login`, usuario);

  }
  setToken(token: string) {
    localStorage.setItem('jwt', token);
  }
  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  logout(): void {
    localStorage.removeItem('jwt');
  }

  getProfile(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.url}/profile`, { headers });
  }
  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      // Accede directamente a la claim esperada
      const userIdString = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      return userIdString ? parseInt(userIdString) : null;

    } catch (e) {
      console.error('Error al decodificar el token', e);
      return null;
    }
  }



}
