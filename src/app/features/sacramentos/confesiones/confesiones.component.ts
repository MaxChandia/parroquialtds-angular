import { Component } from '@angular/core';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-confesiones',
  imports: [NavbarComponent, FooterComponent, RouterModule],
  templateUrl: './confesiones.component.html',
  styleUrl: './confesiones.component.css'
})
export class ConfesionesComponent {

}
