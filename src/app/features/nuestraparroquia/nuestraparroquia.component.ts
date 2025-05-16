import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-nuestraparroquia',
  imports: [NavbarComponent,
    FooterComponent
  ],
  templateUrl: './nuestraparroquia.component.html',
  styleUrl: './nuestraparroquia.component.css'
})
export class NuestraparroquiaComponent {

}
