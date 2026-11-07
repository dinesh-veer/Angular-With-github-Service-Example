import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { RateLimitService } from '../../../core/services/rate-limit.service';
import { RateLimitStatus } from '../../../core/models/rate-limit.model';

@Component({
  selector: 'app-rate-limit-banner',
  standalone: false,
  template: `
    <div *ngIf="status && (status.isExceeded || status.remaining <= 5)" class="rate-limit-banner" [class.danger]="status.isExceeded">
      <div class="content">
        <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
          <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v3.5a.75.75 0 0 1-1.5 0V4.75a.75.75 0 0 1 1.5 0ZM8 10.5a.875.875 0 1 1 0 1.75.875.875 0 0 1 0-1.75Z"/>
        </svg>
        <span *ngIf="status.isExceeded">
          <strong>GitHub API rate limit exceeded</strong> ({{ status.remaining }}/{{ status.limit }} remaining). Resets in {{ resetMinutes }}m {{ resetSeconds }}s.
        </span>
        <span *ngIf="!status.isExceeded">
          GitHub API requests remaining: <strong>{{ status.remaining }}/{{ status.limit }}</strong> (resets in {{ resetMinutes }}m).
        </span>
      </div>
    </div>
  `,
  styles: [`
    .rate-limit-banner {
      background: #fff8c5;
      border-bottom: 1px solid rgba(212, 167, 44, 0.4);
      color: #7d4e00;
      padding: 8px 16px;
      font-size: 13px;
    }
    .rate-limit-banner.danger {
      background: #ffebe9;
      border-color: rgba(255, 129, 130, 0.4);
      color: #cf222e;
    }
    .content {
      display: flex;
      align-items: center;
      gap: 8px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .content svg {
      flex-shrink: 0;
    }
  `]
})
export class RateLimitBannerComponent implements OnInit, OnDestroy {
  status: RateLimitStatus | null = null;
  resetMinutes = 0;
  resetSeconds = 0;

  private sub?: Subscription;
  private timerSub?: Subscription;

  constructor(private rateLimitService: RateLimitService) {}

  ngOnInit(): void {
    this.sub = this.rateLimitService.status$.subscribe(status => {
      this.status = status;
      this.updateCountdown();
    });

    this.timerSub = interval(1000).subscribe(() => {
      this.updateCountdown();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.timerSub?.unsubscribe();
  }

  private updateCountdown(): void {
    if (!this.status?.resetTime) return;
    const diff = Math.max(0, this.status.resetTime.getTime() - Date.now());
    this.resetMinutes = Math.floor(diff / 60000);
    this.resetSeconds = Math.floor((diff % 60000) / 1000);

    if (diff === 0 && this.status.isExceeded) {
      this.rateLimitService.clear();
    }
  }
}

