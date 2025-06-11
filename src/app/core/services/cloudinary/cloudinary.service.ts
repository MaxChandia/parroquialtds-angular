// src/app/core/services/cloudinary/cloudinary.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  // Asegúrate de reemplazar 'TU_CLOUD_NAME' y 'TU_UPLOAD_PRESET' con tus valores reales de Cloudinary.
  private cloudName = 'dqp4mnozy'; 
  private uploadPreset = 'ml_default';

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;
    return this.http.post(url, formData);
  }
}