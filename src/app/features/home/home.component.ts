import { Component } from '@angular/core';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { CarrouselComponent } from '../../shared/components/carrousel/carrousel.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FooterComponent, 
    NavbarComponent,
    CarrouselComponent,
    MatButtonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  churchImages = [
    {
      url: 'assets/parro1.jpg',
      alt: 'Church interior with stained glass',
      title: 'Te invitamos a participar de nuestra comunidad',
      title2: 'Martes a Sábado: 20:00 Domingos 12:00 y 20:00'
    },
    {
      url: 'assets/parro2.jpg',
      alt: 'Church exterior view',
      title: 'Horario de Misa',
      title2: 'Martes a Sábado: 20:00 Domingos 12:00 y 20:00'
    },
    {
      url: 'assets/parro3.jpg',
      alt: 'Community gathering',
      title: 'Community Events',
      title2: 'Martes a Sábado: 20:00 Domingos 12:00 y 20:00'
    }
  ];
}