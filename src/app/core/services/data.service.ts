import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';  

export interface News {
  id: string; 
  title: string;
  slug: string;
  content: string;
  imageUrls: string[]; 
  createdAt: string; 
  author_username?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiURL = 'http://127.0.0.1:8000/api/';
  
  constructor(private http: HttpClient) {}

  getNews(): Observable<News[]> {
    return this.http.get<News[]>(`${this.apiURL}noticias/`);
  }

  getNewsBySlug(slug: string): Observable<News> {
    return this.http.get<News>(`${this.apiURL}noticias/${slug}/`);
  }

  createNews(noticiasData: Partial<News>): Observable <News>{
    return this.http.post<News>(`${this.apiURL}noticias/`, noticiasData);
  }

  deleteNews(slug: String): Observable<News>{
    return this.http.delete<News>(`${this.apiURL}noticias/${slug}`)
  }

  editNews(slug: String, editData: Partial<News>): Observable<News>{
    return this.http.put<News>(`${this.apiURL}noticias/${slug}/`, editData)
  }
}