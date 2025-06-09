import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { DataService, News } from '../../core/services/data.service';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  standalone: true,
  selector: 'app-noticias',
  imports: [
    CommonModule,
    HttpClientModule,
    NavbarComponent,
    FooterComponent,
    CardComponent,
    MatPaginatorModule
  ],
  providers: [DataService],
  templateUrl: './noticias.component.html',
  styleUrl: './noticias.component.css'
})
export class NoticiasComponent implements OnInit {
  posts: News[] = [];
  loading: boolean = true;
  error: string | null = null;
  currentPage = 0;
  pageSize = 12;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

   onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
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