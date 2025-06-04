import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // ── Import necesario para *ngFor, *ngIf, etc.
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DataService, News } from '../../core/services/data.service';
import { error } from 'console';

@Component({
  standalone: true,
  selector: 'app-crearnoticia',
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [DataService],
  templateUrl: './crearnoticia.component.html',
  styleUrls: ['./crearnoticia.component.css']
})
export class CrearnoticiaComponent implements OnInit {
  @ViewChild('editor', { static: true }) editor!: ElementRef<HTMLDivElement>;


  public fontSizes = [
    { label: '10px', value: '10px' },
    { label: '12px', value: '12px' },
    { label: '14px', value: '14px' },
    { label: '16px', value: '16px' },
    { label: '18px', value: '18px' },
    { label: '24px', value: '24px' },
    { label: '32px', value: '32px' }
  ];

  public selectedFontSize = this.fontSizes[2].value;

  public applyCommand(command: string, value?: string) {
    this.editor.nativeElement.focus();
    document.execCommand(command, false, value);
  }

  public changeFont(event: Event) {
    const font = (event.target as HTMLSelectElement).value;
    this.applyCommand('fontName', font);
  }

  public changeFontSize(event: Event) {
    const size = (event.target as HTMLSelectElement).value;
    this.selectedFontSize = size;

    document.execCommand('styleWithCSS', false, 'true');
    this.applyCommand('fontSize', '7');

    const el = this.editor.nativeElement;
    const fonts = el.getElementsByTagName('font');
    if (fonts.length) {
      const lastFont = fonts[fonts.length - 1];
      lastFont.removeAttribute('size');
      lastFont.style.fontSize = size;
    }
  }

  public insertBulletList() {
    this.applyCommand('insertUnorderedList');
  }

  public insertNumberedList() {
    this.applyCommand('insertOrderedList');
  }


  public clearContent() {
    this.editor.nativeElement.innerHTML = '';
  }

  // Lógica CRUD

  constructor (private dataService: DataService) {}

  news: News[] = [];
  loading: boolean = true
  error: string | null = null

  ngOnInit(): void {
     this.loadNews();
  }

  loadNews(): void {
    this.dataService.getNews().subscribe({
      next: (data) => {
        this.news = data
        this.loading = false },
      error: (error) => {
        this.error = 'No se pudieron cargar los post'
        this.loading = false
        console.error('Error en el llamado', error)
      }
    })
  }

  createNews(newPost: News): void {
    this.dataService.createNews(newPost).subscribe({
      next: (createdPost) => {
          this.news.unshift(createdPost);
      },
      error: (error) => {
        this.error = 'No se pudo publicar el post'
        console.error('No se pudo publicar el post', error)
      }

    })

  }

  editNews(updatedPost: News):void {
    this.dataService.editNews(updatedPost.slug, updatedPost).subscribe({
      next: (data) => {
        const index = this.news.findIndex(p => p.slug === data.slug);
        if (index !== -1){
          this.news[index] = data;
        }
      },
      error: (error) => {
        this.error = 'No se pudo actualizar el contenido'
        console.error('No se pudo actualizar el contenido', error)
      }
    })

  }

  deleteNews(slug: String): void {
    this.dataService.deleteNews(slug).subscribe({
      next: (data) => {
        const index = this.news.findIndex(p => p.slug === data.slug)
        if (index !== -1){
          this.news.splice(index, 1);
        }
      },
      error: (error) => {
        this.error = 'No se pudo eliminar noticia'
        console.error('No se pudo borrar contenido', error)}
    })
  }


  

}
