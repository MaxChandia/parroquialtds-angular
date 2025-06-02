import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';  

export interface Post {
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

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiURL}posts/`);
  }

  getPostBySlug(slug: string): Observable<Post> {
    return this.http.get<Post>(`${this.apiURL}posts/${slug}/`);
  }

  createPost(postData: Partial<Post>): Observable <Post>{
    return this.http.post<Post>(`${this.apiURL}post/`, postData);
  }

  deletePost(slug: String): Observable<Post>{
    return this.http.delete<Post>(`${this.apiURL}post/${slug}`)
  }

  editPost(slug: String, editData: Partial<Post>): Observable<Post>{
    return this.http.put<Post>(`${this.apiURL}post/${slug}/`, editData)
  }
}