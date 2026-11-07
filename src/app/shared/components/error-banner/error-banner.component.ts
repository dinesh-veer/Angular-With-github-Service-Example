import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-error-banner',
  standalone: false,
  template: `
    <div class="error-banner" [class.rate-limit]="isRateLimit">
      <div class="icon">
        <svg *ngIf="!isRateLimit" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
          <path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/>
        </svg>
        <svg *ngIf="isRateLimit" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
          <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v3.5a.75.75 0 0 1-1.5 0V4.75a.75.75 0 0 1 1.5 0ZM8 10.5a.875.875 0 1 1 0 1.75.875.875 0 0 1 0-1.75Z"/>
        </svg>
      </div>
      <div class="content">
        <div class="title">{{ title || (isRateLimit ? 'API Rate Limit Reached' : 'Error') }}</div>
        <div class="message">{{ message }}</div>
      </div>
      <button *ngIf="showRetry" class="retry-btn" (click)="retry.emit()">Retry</button>
    </div>
  `,
  styles: [`
    .error-banner {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 14px 16px;
      border-radius: 8px;
      background: #ffebe9;
      border: 1px solid rgba(255, 129, 130, 0.4);
      color: #cf222e;
      margin: 16px 0;
      font-size: 13px;
    }
    .error-banner.rate-limit {
      background: #fff8c5;
      border-color: rgba(212, 167, 44, 0.4);
      color: #9a6700;
    }
    .icon {
      flex-shrink: 0;
      padding-top: 2px;
    }
    .content {
      flex: 1;
    }
    .title {
      font-weight: 600;
      margin-bottom: 2px;
    }
    .message {
      color: #57606a;
      line-height: 1.4;
    }
    .rate-limit .message {
      color: #7d4e00;
    }
    .retry-btn {
      padding: 4px 12px;
      font-size: 12px;
      font-weight: 500;
      border-radius: 6px;
      border: 1px solid rgba(27, 31, 36, 0.15);
      background: #fff;
      color: #24292f;
      cursor: pointer;
    }
    .retry-btn:hover {
      background: #f6f8fa;
    }
  `]
})
export class ErrorBannerComponent {
  @Input() title?: string;
  @Input() message = 'Something went wrong while communicating with GitHub API.';
  @Input() isRateLimit = false;
  @Input() showRetry = false;
  @Output() retry = new EventEmitter<void>();
}

