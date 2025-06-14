import { HttpInterceptorFn } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  // Define la URL de la API de Cloudinary para subida
  const cloudinaryUploadUrl = 'https://api.cloudinary.com/v1_1/dqp4mnozy/image/upload';

  if (isPlatformBrowser(platformId)) {
    console.log('AuthInterceptor: Request intercepted. URL:', req.url);

    // Si la URL de la solicitud es la de Cloudinary, omitir añadir el encabezado de autorización
    if (req.url.startsWith(cloudinaryUploadUrl)) {
      console.log('AuthInterceptor: Skipping Authorization header for Cloudinary upload request.');
      return next(req); // Continúa con la solicitud original sin modificar
    }

    const authToken = localStorage.getItem('jwt_token');
    console.log('AuthInterceptor: Token from localStorage:', authToken ? 'Token found (length: ' + authToken.length + ')' : 'Token NOT found');

    if (authToken) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${authToken}`)
      });
      console.log('AuthInterceptor: Request cloned with Authorization header.');
      console.log('AuthInterceptor: Cloned Request Headers (Authorization):', cloned.headers.get('Authorization'));
      return next(cloned);
    }
  } else {
    console.log('AuthInterceptor: Not running in browser, skipping token logic.');
  }

  console.log('AuthInterceptor: No token or not in browser, proceeding with original request.');
  return next(req);
};