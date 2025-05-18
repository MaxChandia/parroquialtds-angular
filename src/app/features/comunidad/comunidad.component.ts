import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { Image } from '../../shared/models/image.models';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-comunidad',
  imports: [NavbarComponent, FooterComponent, NgFor],
  templateUrl: './comunidad.component.html',
  styleUrl: './comunidad.component.css'
})
export class ComunidadComponent {
  slides: Image[] = [{
    id: 1, src: 'assets/parro1.jpg', alt: 'imagen-parroquia-1'},
    {
    id: 2, src: 'assets/parro2.jpg', alt: 'imagen-parroquia-2' },
    {
    id: 3, src: 'assets/parro3.jpg', alt: 'imagen-parroquia-3'}]
 
}
