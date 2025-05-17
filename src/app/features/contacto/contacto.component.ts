import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import emailjs from 'emailjs-com';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {
  contactoForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.contactoForm = this.fb.group({
      nombre:    ['', Validators.required],
      mail:      ['', [Validators.required, Validators.email]],
      mensaje:   ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.contactoForm.invalid) {
      alert('Todos los campos son obligatorios y el correo debe tener formato válido.');
      return;
    }

    const { nombre, mail, mensaje } = this.contactoForm.value;

    emailjs.send(
      'service_hdzmjsb',        // tu Service ID
      'template_p4awnkq',       // tu Template ID
      {
        from_name: nombre,
        message: mensaje,
        reply_to: mail
      },
      'i5bpqOQH5kvoK7dZ5'       // tu User ID (Public Key)
    ).then(
      result => {
        console.log('Email enviado:', result.text);
        alert('Formulario enviado correctamente');
        this.contactoForm.reset();
      },
      error => {
        console.error('Error al enviar el formulario:', error.text);
        alert('Error al enviar el formulario. Intente de nuevo.');
      }
    );
  }
}
