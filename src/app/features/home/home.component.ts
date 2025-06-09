import { Component } from '@angular/core';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { CarrouselComponent } from '../../shared/components/carrousel/carrousel.component';
import { MatButtonModule } from '@angular/material/button';
import { DataService, News } from '../../core/services/data.service';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FooterComponent, 
    NavbarComponent,
    CarrouselComponent,
    MatButtonModule,  
    CommonModule,
    HttpClientModule,
    RouterModule,
    CardComponent
  ],
  providers: [DataService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  churchImages = [
    {
      url: 'assets/parroquialanding.jpg',
      alt: 'Church interior with stained glass',
      title: 'Parroquia la Transfiguración del Señor',
      title2: 'Bienvenidos a nuestra comunidad',
    },
    {
      url: 'assets/misaslide.jpg',
      alt: 'Church exterior view',
      title: 'Horarios de Misas',
      title2: 'Martes a Sábado: 20:00 Domingos 12:00 y 20:00'
    },
    {
      url: 'assets/parro3.jpg',
      alt: 'Community gathering',
      title: 'Community Events',
      title2: 'Martes a Sábado: 20:00 Domingos 12:00 y 20:00'
    }
  ];

  posts: News[] = [];
    loading: boolean = true;
    error: string | null = null;
  
    constructor(private dataService: DataService) {}
  
    ngOnInit(): void {
      this.loadPosts();
    }
  
    loadPosts(): void {
      this.dataService.getNews().subscribe({
        next: (posts) => {
          this.posts = posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error al cargar las noticias';
          this.loading = false;
          console.error('Error loading posts:', error);
        }
      });
    }
  
    getMainImage(post: News): string {
      return post.imageUrls && post.imageUrls.length > 0 
        ? post.imageUrls[0] 
        : 'assets/images/default-news.jpg';
    }
  
  
    getTruncatedContent(content: string, maxLength: number = 150): string {
      const cleanContent = content.replace(/<[^>]*>/g, '').trim();
      
      if (cleanContent.length <= maxLength) {
        return cleanContent;
      }
      return cleanContent.substring(0, maxLength) + '...';
    }
}