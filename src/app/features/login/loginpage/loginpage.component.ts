import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; 
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { HttpClient, HttpClientModule } from '@angular/common/http'; 
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-loginpage',
  standalone: true, 
  imports: [
    RouterModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule, 
    HttpClientModule,
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

  
  constructor(private http: HttpClient, private router: Router) {}

  
  onSubmit() {
    this.errorMessage = null; 

    
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;


      this.http.post('http://localhost:8000/api/login/', { username, password })
        .subscribe({
          next: (response: any) => {
            console.log('LoginpageComponent: Login successful, response:', response); 
            localStorage.setItem('jwt_token', response.token);
             console.log('LoginpageComponent: Token saved to localStorage with key "jwt_token":', localStorage.getItem('jwt_token')); // <-- THIS ONE
            this.router.navigate(['/admin']);
          },
          error: (error) => {
            console.error('Error de login:', error);
            this.errorMessage = 'Usuario o contraseña incorrectos.';
          }
        });
    } else {
      this.errorMessage = 'Por favor, introduce tu usuario y contraseña.';
    }
  }
}
