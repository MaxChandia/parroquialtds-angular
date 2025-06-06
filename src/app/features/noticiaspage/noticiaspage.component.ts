// src/app/features/noticiaspage/noticiaspage.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';           
import { DataService, News } from '../../core/services/data.service';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-noticiaspage',
  standalone: true,
  imports: [
    CommonModule,    
    RouterModule,
    HttpClientModule,
    NavbarComponent,
    FooterComponent
  ],
  providers: [DataService],
  templateUrl: './noticiaspage.component.html',
  styleUrls: ['./noticiaspage.component.css']
})
export class NoticiaspageComponent implements OnInit {
  news: News | null = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.loadNewsBySlug(slug);
    } else {
      this.error = true;
      this.loading = false;
    }
  }

  loadNewsBySlug(slug: string): void {
    this.loading = true;
    this.error = false;

    this.dataService.getNewsBySlug(slug).subscribe({
      next: (news: News) => {
        this.news = news;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading news by slug:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }
}
