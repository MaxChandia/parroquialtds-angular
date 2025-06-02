import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { DataService, Post } from '../../core/services/data.service';

@Component({
  standalone: true,
  selector: 'app-noticias',
  imports: [
    CommonModule,
    HttpClientModule,
    NavbarComponent,
    FooterComponent,
    CardComponent
  ],
  providers: [DataService],
  templateUrl: './noticias.component.html',
  styleUrl: './noticias.component.css'
})
export class NoticiasComponent implements OnInit {
  posts: Post[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.dataService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar las noticias';
        this.loading = false;
        console.error('Error loading posts:', error);
      }
    });
  }

  // Método helper para obtener la primera imagen o una por defecto
  getMainImage(post: Post): string {
    return post.imageUrls && post.imageUrls.length > 0 
      ? post.imageUrls[0] 
      : 'assets/images/default-news.jpg';
  }

  // Método helper para limpiar HTML y truncar el contenido
  getTruncatedContent(content: string, maxLength: number = 150): string {
    // Remover tags HTML
    const cleanContent = content.replace(/<[^>]*>/g, '').trim();
    
    if (cleanContent.length <= maxLength) {
      return cleanContent;
    }
    return cleanContent.substring(0, maxLength) + '...';
  }
}