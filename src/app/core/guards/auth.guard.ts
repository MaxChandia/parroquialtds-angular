import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    // Verificar si existe el token en localStorage
    const token = localStorage.getItem('jwt_token');
    
    if (token) {
      // Aquí podrías agregar validación adicional del token si es necesario
      // Por ejemplo, verificar si no ha expirado
      return true;
    } else {
      // Si no hay token, redirigir al login
      this.router.navigate(['/login']);
      return false;
    }
  }

  // Método auxiliar para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('jwt_token');
  }

  // Método para hacer logout
  logout(): void {
    localStorage.removeItem('jwt_token');
    this.router.navigate(['/login']);
  }
}