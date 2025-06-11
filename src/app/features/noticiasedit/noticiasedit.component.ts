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

@Component({
  selector: 'app-noticiasedit',
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    NavbarComponent,
    FooterComponent,
    ReactiveFormsModule // Required for [formGroup]
  ],
  standalone: true,
  templateUrl: './noticiasedit.component.html',
  styleUrl: './noticiasedit.component.css'
})
export class NoticiaseditComponent implements OnInit {

  newsItem: News | null = null; // Stores the news item being edited
  loading: boolean = true;
  error: string | null = null;
  // sanitizedContent: SafeHtml | null = null; // No longer strictly needed if content is in a form field

  noticiaForm!: FormGroup; // Declare the FormGroup

  constructor(
    private dataService: DataService,
    private sanitizer: DomSanitizer, // Still useful if you want to display a preview
    private route: ActivatedRoute, // To get route parameters (slug)
    private router: Router // To navigate after successful update
  ) {
    // Initialize the form controls.
    // The names here ('title', 'content') MUST match your News model properties
    // and the formControlName in your HTML.
    this.noticiaForm = new FormGroup({
      title: new FormControl('', Validators.required), // Changed from 'titulo' to 'title' to match News model
      content: new FormControl('', Validators.required),
      // Add other editable fields from your News model here (e.g., imageUrls, author_id if editable)
      // imageUrls: new FormControl<string[]>([]), // Example for an array
    });
  }

  ngOnInit(): void {
    // Subscribe to route parameters to get the slug
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug'); // Get the slug from the URL
      if (slug) {
        this.loadNewsBySlug(slug);
      } else {
        this.error = 'No se proporcionó un slug para cargar la noticia. Redireccionando...';
        this.loading = false;
        // Redirect if no slug is present, as editing requires one
        setTimeout(() => {
          this.router.navigate(['/crearnoticia']); // Adjust this path if needed
        }, 2000);
      }
    });
  }

  loadNewsBySlug(slug: string): void {
    this.loading = true;
    this.error = null;

    this.dataService.getNewsBySlug(slug).subscribe({
      next: (news: News) => {
        this.newsItem = news;
        this.error = null;

        // Populate the form with the fetched data
        // The keys in patchValue must match the FormControl names defined in the FormGroup
        this.noticiaForm.patchValue({
          title: this.newsItem.title, // Corrected from 'titulo' to 'title'
          content: this.newsItem.content
        });

        // If you still want to sanitize and display content somewhere else, keep this
        // if (this.newsItem.content) {
        //   this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(this.newsItem.content);
        // }

        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading news by slug:', err);
        if (err.status === 404) {
          this.error = 'La noticia no fue encontrada.';
        } else {
          this.error = 'No se pudo cargar la noticia. Por favor, inténtelo de nuevo más tarde.';
        }
        this.loading = false;
        this.newsItem = null; // Ensure newsItem is null on error
      }
    });
  }

  onSubmit(): void {
    if (this.noticiaForm.valid && this.newsItem) {
      // Create an updated News object using the form values
      // We use the spread operator to keep properties that are not part of the form
      const updatedNews: News = {
        ...this.newsItem, // Keep existing properties like slug, createdAt, etc.
        title: this.noticiaForm.get('title')?.value, // Get value from 'title' FormControl
        content: this.noticiaForm.get('content')?.value, // Get value from 'content' FormControl
        // If you have more editable fields, add them here:
        // imageUrls: this.noticiaForm.get('imageUrls')?.value,
      };

      // Call the DataService to update the news item
      // Make sure your DataService has an 'updateNews' method that takes slug and updated data
      this.dataService.editNews(this.newsItem.slug, updatedNews).subscribe({
        next: (response: News) => {
          console.log('Noticia actualizada exitosamente', response);
          this.newsItem = response; // Update newsItem with the response from the server
          this.error = null; // Clear any previous errors
          // Optionally, navigate back to the news list or show a success message
          this.router.navigate(['/crearnoticia']); // Navigate back to the management component
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al actualizar la noticia:', err);
          this.error = 'Error al guardar cambios. Por favor, inténtelo de nuevo.';
        }
      });
    } else {
      this.error = 'Por favor, complete todos los campos requeridos.';
      this.noticiaForm.markAllAsTouched(); // This will display validation errors
    }
  }

  clearError(): void {
    this.error = null;
  }
}