import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8000/api';
  private readonly TOKEN_KEY = 'jwt_token';
  
  // BehaviorSubject para mantener el estado de autenticación
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  // Método de login
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/login/`, { username, password })
      .pipe(
        tap((response: any) => {
          if (response.token) {
            this.setToken(response.token);
            this.isAuthenticatedSubject.next(true);
          }
        })
      );
  }

  // Método de logout
  logout(): void {
    this.removeToken();
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return this.hasToken();
  }

  // Obtener token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Guardar token
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Eliminar token
  private removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // Verificar si existe token
  private hasToken(): boolean {
    return !!this.getToken();
  }

  // Método para validar token (opcional - si tu backend lo soporta)
  validateToken(): Observable<any> {
    return this.http.get(`${this.API_URL}/validate-token/`);
  }
}