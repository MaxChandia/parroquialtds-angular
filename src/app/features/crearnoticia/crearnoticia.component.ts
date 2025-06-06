import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DataService, News } from '../../core/services/data.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-crearnoticia',
  imports: [CommonModule, FormsModule, HttpClientModule, MatButtonModule],
  templateUrl: './crearnoticia.component.html',
  styleUrls: ['./crearnoticia.component.css']
})
export class CrearnoticiaComponent implements OnInit {
  @ViewChild('editor', { static: true }) editor!: ElementRef<HTMLDivElement>;
  @ViewChild('titleInput', { static: true }) titleInput!: ElementRef<HTMLDivElement>;

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

  // Propiedades para el CRUD
  news: News[] = [];
  loading: boolean = true;
  error: string | null = null;
  isPublishing: boolean = false;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadNews();
  }

  // ========== MÉTODOS DEL EDITOR ==========
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
    this.titleInput.nativeElement.innerHTML = '';
    this.error = null;
  }

  // ========== MÉTODOS CRUD ==========
  loadNews(): void {
    this.loading = true;
    this.error = null;
    
    this.dataService.getNews().subscribe({
      next: (data) => {
        this.news = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'No se pudieron cargar las noticias';
        this.loading = false;
        console.error('Error cargando noticias:', error);
      }
    });
  }

  // Método para publicar noticia
  publishNews(): void {
    const title = this.titleInput.nativeElement.innerText.trim();
    const content = this.editor.nativeElement.innerHTML.trim();

    // Validaciones
    if (!title) {
      this.error = 'El título es obligatorio';
      this.titleInput.nativeElement.focus();
      return;
    }

    if (!content || content === '<br>' || content === '<div><br></div>') {
      this.error = 'El contenido es obligatorio';
      this.editor.nativeElement.focus();
      return;
    }

    this.isPublishing = true;
    this.error = null;

    const newNews: Partial<News> = {
      title: title,
      content: content,
    };

    this.dataService.createNews(newNews as News).subscribe({
      next: (createdPost) => {
        this.news.unshift(createdPost);
        this.clearContent();
        this.isPublishing = false;
        console.log('Noticia publicada exitosamente');
      },
      error: (error) => {
        this.error = 'No se pudo publicar la noticia. Intenta nuevamente.';
        this.isPublishing = false;
        console.error('Error publicando noticia:', error);
      }
    });
  }


  deleteNews(slug: string): void {
    if (!confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
      return;
    }

    this.error = null;

    this.dataService.deleteNews(slug).subscribe({
      next: () => {
        this.news = this.news.filter(n => n.slug !== slug);
        console.log('Noticia eliminada exitosamente');
      },
      error: (error) => {
        this.error = 'No se pudo eliminar la noticia. Intenta nuevamente.';
        console.error('Error eliminando noticia:', error);
      }
    });
  }

  editNews(updatedPost: News): void {
    this.dataService.editNews(updatedPost.slug, updatedPost).subscribe({
      next: (data) => {
        const index = this.news.findIndex(p => p.slug === data.slug);
        if (index !== -1) {
          this.news[index] = data;
        }
      },
      error: (error) => {
        this.error = 'No se pudo actualizar el contenido';
        console.error('Error actualizando noticia:', error);
      }
    });
  }

  clearError(): void {
    this.error = null;
  }

  trackBySlug(index: number, item: News): string {
    return item.slug;
  }
}