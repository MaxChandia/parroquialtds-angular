import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DataService, News } from '../../core/services/data.service';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CloudinaryService } from '../../core/services/cloudinary/cloudinary.service';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators'; 
import {RouterLink} from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-crearnoticia',
  imports: [CommonModule, FormsModule, HttpClientModule, MatButtonModule, MatPaginatorModule , RouterLink],
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
  currentPage = 0;
  pageSize = 6;
  imageUrls: { url: string; name: string }[] = []; 
  isUploadingImages: boolean = false; 


  constructor(
    private dataService: DataService,
    private cloudinaryService: CloudinaryService
  ) {}

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
    this.titleInput.nativeElement.innerText = ''; 
    this.error = null;
    this.imageUrls = [];
  }

   removeImageByUrl(urlToRemove: string): void {
      this.imageUrls = this.imageUrls.filter(img => img.url !== urlToRemove);
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }
  // ========== MÉTODOS CRUD ==========
  loadNews(): void {
    this.loading = true;
    this.error = null;
    
    this.dataService.getNews().subscribe({
      next: (data) => {
        this.news = data.sort ((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.currentPage = 0;
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
      imageUrls: this.imageUrls.map(img => img.url), 
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


  onImageSelected(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (!files || files.length === 0) return;

    this.isUploadingImages = true; 
    this.error = null; 

    const uploadObservables = Array.from(files).map(file => 
      this.cloudinaryService.uploadImage(file)
    );

    forkJoin(uploadObservables)
      .pipe(
        finalize(() => {
          this.isUploadingImages = false; 
        })
      )
      .subscribe({
        next: (responses) => {
          const newImageUrls: { url: string; name: string }[] = [];
          responses.forEach((data, index) => {
            const file = files[index];
            newImageUrls.push({ url: data.secure_url, name: file.name });

          });
          this.imageUrls = [...this.imageUrls, ...newImageUrls];
          console.log('URLs de las imágenes subidas:', this.imageUrls);
        },
        error: (err) => {
          this.error = 'Error al subir una o más imágenes. Intenta nuevamente.';
          this.isUploadingImages = false;
          console.error('Error al subir imágenes:', err);
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