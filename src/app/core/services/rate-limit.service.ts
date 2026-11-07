import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RateLimitStatus } from '../models/rate-limit.model';

@Injectable({
  providedIn: 'root'
})
export class RateLimitService {
  private statusSubject = new BehaviorSubject<RateLimitStatus | null>(null);
  public status$: Observable<RateLimitStatus | null> = this.statusSubject.asObservable();

  updateFromHeaders(limitHeader: string | null, remainingHeader: string | null, resetHeader: string | null, resource: 'core' | 'search' = 'core'): void {
    if (limitHeader && remainingHeader && resetHeader) {
      const limit = parseInt(limitHeader, 10);
      const remaining = parseInt(remainingHeader, 10);
      const resetEpoch = parseInt(resetHeader, 10) * 1000;
      const resetTime = new Date(resetEpoch);

      this.statusSubject.next({
        limit,
        remaining,
        resetTime,
        isExceeded: remaining <= 0,
        resource
      });
    }
  }

  setExceeded(resetTime: Date, resource: 'core' | 'search' = 'core'): void {
    const current = this.statusSubject.value;
    this.statusSubject.next({
      limit: current?.limit || 60,
      remaining: 0,
      resetTime,
      isExceeded: true,
      resource
    });
  }

  clear(): void {
    this.statusSubject.next(null);
  }
}

