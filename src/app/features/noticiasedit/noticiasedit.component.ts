import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { DataService, News } from '../../core/services/data.service';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router'; // Import Router for navigation
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-noticiasedit',
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    NavbarComponent,
    FooterComponent,
    ReactiveFormsModule 
  ],
  standalone: true,
  templateUrl: './noticiasedit.component.html',
  styleUrl: './noticiasedit.component.css'
})
export class NoticiaseditComponent implements OnInit {
  news: News | null = null;
  sanitizedContent: SafeHtml | undefined;
  loading = true;
  error: string | null = null;
  @ViewChild('titleInput', { static: false }) titleInput!: ElementRef<HTMLDivElement>;
  @ViewChild('editor', { static: false }) editor!: ElementRef<HTMLDivElement>;
  @ViewChild('image', { static: true }) image!: ElementRef<HTMLImageElement>;

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
  
  constructor(
    private dataService: DataService, 
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.loadNewsBySlug(slug);
    } else {
      this.error = null;
      this.loading = false;
    }
  }


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

  loadNewsBySlug(slug: string): void {
  this.dataService.getNewsBySlug(slug).subscribe({
    next: (news) => {
      this.news = news;
      this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(news.content);
      this.loading = false;
    },
    error: (err: HttpErrorResponse) => {
      console.error('Error loading news:', err);
      this.error = 'Error al cargar la noticia';
      this.loading = false;
    }
  });
}

  editNews(): void {
    // Verificación adicional de seguridad
    if (!this.titleInput || !this.editor) {
      console.error('Elementos del editor no disponibles');
      return;
    }

    if (this.news) {
      // Obtener valores actualizados directamente del DOM
      const updatedTitle = this.titleInput.nativeElement.innerText;
      const updatedContent = this.editor.nativeElement.innerHTML;
      
      const editData: Partial<News> = {
        title: updatedTitle,
        content: updatedContent,
        imageUrls: this.news.imageUrls
      };
      
      this.dataService.editNews(this.news.slug, editData).subscribe({
        next: (updatedNews) => {
          console.log('Noticia actualizada:', updatedNews);
          // Actualizar solo los campos necesarios
          this.news!.title = updatedNews.title;
          this.news!.content = updatedNews.content;
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error actualizando:', err);
          this.error = 'Error al guardar cambios';
        }
      });
    }
  }

  clearContent(): void {
    if (this.news) {
      this.news.content = '';
      this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml('');
    }
  }

    clearError(): void {
      this.error = null;
  }

   removeImage(imageUrl: string): void {
    if (this.news && this.news.imageUrls) {
      // Filtrar la imagen a eliminar
      this.news.imageUrls = this.news.imageUrls.filter(url => url !== imageUrl);}
}
  canSave(): boolean {
  return !!this.news && !!this.titleInput && !!this.editor;
}

}