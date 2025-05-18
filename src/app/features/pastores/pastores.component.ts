import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-pastores',
  imports: [
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './pastores.component.html',
  styleUrl: './pastores.component.css'
})
export class PastoresComponent {

}
