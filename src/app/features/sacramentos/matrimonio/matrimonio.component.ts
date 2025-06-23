import { Component } from '@angular/core';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-matrimonio',
  imports: [NavbarComponent, FooterComponent, RouterModule],
  templateUrl: './matrimonio.component.html',
  styleUrl: './matrimonio.component.css'
})
export class MatrimonioComponent {

}
