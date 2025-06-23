import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-loginpage',
  standalone: true,
  imports: [
    RouterModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './loginpage.component.html',
  styleUrl: './loginpage.component.css'
})
export class LoginpageComponent {
  
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  errorMessage: string | null = null;
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Si ya está autenticado, redirigir
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/admin']);
    }
  }

  onSubmit() {
    this.errorMessage = null;
    
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { username, password } = this.loginForm.value;
      
      this.authService.login(username!, password!).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.router.navigate(['/admin']); // o donde quieras redirigir
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error de login:', error);
          this.errorMessage = 'Usuario o contraseña incorrectos.';
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'Por favor, introduce tu usuario y contraseña.';
    }
  }
}