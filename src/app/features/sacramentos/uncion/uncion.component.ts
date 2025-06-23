import { Component } from '@angular/core';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-uncion',
  imports: [NavbarComponent, FooterComponent, RouterModule],
  templateUrl: './uncion.component.html',
  styleUrl: './uncion.component.css'
})
export class UncionComponent {

}
