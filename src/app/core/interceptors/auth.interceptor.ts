import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthUseCase } from '../domain/use-cases/auth.usecase';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authUseCase: AuthUseCase) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authUseCase.getToken();

    if (token && !request.url.includes('/api/auth/signin')) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return next.handle(request);
  }
}
