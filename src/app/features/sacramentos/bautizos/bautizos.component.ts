import { Component } from '@angular/core';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-bautizos',
  imports: [NavbarComponent, FooterComponent, RouterModule],
  templateUrl: './bautizos.component.html',
  styleUrl: './bautizos.component.css'
})
export class BautizosComponent {

}
