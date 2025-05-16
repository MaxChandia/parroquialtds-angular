import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-aportes',
  imports: [NavbarComponent,
    FooterComponent
  ],
  templateUrl: './aportes.component.html',
  styleUrl: './aportes.component.css'
})
export class AportesComponent {

}
