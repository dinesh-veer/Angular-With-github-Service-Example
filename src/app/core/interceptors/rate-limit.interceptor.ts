import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { RateLimitService } from '../services/rate-limit.service';

@Injectable()
export class RateLimitInterceptor implements HttpInterceptor {
  constructor(private rateLimitService: RateLimitService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isSearch = request.url.includes('/search/');
    const resource: 'core' | 'search' = isSearch ? 'search' : 'core';

    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          const limit = event.headers.get('x-ratelimit-limit');
          const remaining = event.headers.get('x-ratelimit-remaining');
          const reset = event.headers.get('x-ratelimit-reset');
          this.rateLimitService.updateFromHeaders(limit, remaining, reset, resource);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403 || error.status === 429) {
          const limit = error.headers.get('x-ratelimit-limit');
          const remaining = error.headers.get('x-ratelimit-remaining');
          const reset = error.headers.get('x-ratelimit-reset');

          if (reset) {
            const resetEpoch = parseInt(reset, 10) * 1000;
            this.rateLimitService.setExceeded(new Date(resetEpoch), resource);
          } else {
            // Default 1 hour fallback
            this.rateLimitService.setExceeded(new Date(Date.now() + 3600000), resource);
          }
        }
        return throwError(() => error);
      })
    );
  }
}

