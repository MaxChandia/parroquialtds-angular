import { Component } from '@angular/core';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-comunion',
  imports: [NavbarComponent, FooterComponent, RouterModule],
  templateUrl: './comunion.component.html',
  styleUrl: './comunion.component.css'
})
export class ComunionComponent {

}
