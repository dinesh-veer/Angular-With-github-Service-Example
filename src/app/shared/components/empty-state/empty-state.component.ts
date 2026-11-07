import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: false,
  template: `
    <div class="empty-state">
      <div class="icon">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </div>
      <h3 class="title">{{ title }}</h3>
      <p class="description">{{ description }}</p>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .empty-state {
      text-align: center;
      padding: 48px 16px;
      color: #57606a;
      max-width: 480px;
      margin: 0 auto;
    }
    .icon {
      color: #8c959f;
      margin-bottom: 16px;
    }
    .title {
      font-size: 16px;
      font-weight: 600;
      color: #24292f;
      margin: 0 0 8px;
    }
    .description {
      font-size: 14px;
      margin: 0;
      line-height: 1.5;
    }
  `]
})
export class EmptyStateComponent {
  @Input() title = 'No results found';
  @Input() description = 'Try searching with different keywords or removing filters.';
}

