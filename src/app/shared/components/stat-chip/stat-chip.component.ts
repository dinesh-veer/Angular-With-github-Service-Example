import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-chip',
  standalone: false,
  template: `
    <span class="stat-chip" [title]="title || label">
      <!-- Star icon -->
      <svg *ngIf="icon === 'star'" viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
        <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/>
      </svg>
      <!-- Fork icon -->
      <svg *ngIf="icon === 'fork'" viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
        <path d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 2.122a2.25 2.25 0 1 0-1.5 0v.878A2.25 2.25 0 0 0 5.75 8.5h4.5A2.25 2.25 0 0 0 12.5 6.25v-.878a2.25 2.25 0 1 0-1.5 0v.878a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 6.25v-.878ZM12.5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM8 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.25 12a2.25 2.25 0 1 0-2.5 0v-1.75a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 .75.75V12Z"/>
      </svg>
      <!-- Watchers / Eye icon -->
      <svg *ngIf="icon === 'eye'" viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
        <path d="M8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.45.678-1.367 1.932-2.637 3.023C11.67 13.008 9.981 14 8 14c-1.981 0-3.671-.992-4.933-2.078C1.797 10.83.88 9.576.43 8.898a1.62 1.62 0 0 1 0-1.798c.45-.678 1.367-1.932 2.637-3.023C4.33 2.992 6.019 2 8 2ZM1.679 7.932a.12.12 0 0 0 0 .136c.411.622 1.241 1.75 2.366 2.717C5.176 11.758 6.527 12.5 8 12.5c1.473 0 2.825-.742 3.955-1.715 1.124-.967 1.954-2.096 2.366-2.717a.12.12 0 0 0 0-.136c-.412-.621-1.242-1.75-2.366-2.717C10.824 4.242 9.473 3.5 8 3.5c-1.473 0-2.824.742-3.955 1.715-1.124.967-1.954 2.096-2.366 2.717ZM8 10a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"/>
      </svg>
      <!-- Issue / Circle dot icon -->
      <svg *ngIf="icon === 'issue'" viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
        <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/>
        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"/>
      </svg>
      <span class="count">{{ value | numberFormat }}</span>
      <span *ngIf="label" class="label">{{ label }}</span>
    </span>
  `,
  styles: [`
    .stat-chip {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 12px;
      color: #57606a;
      line-height: 1;
    }
    .stat-chip svg {
      color: #57606a;
    }
    .count {
      font-weight: 600;
      color: #24292f;
    }
    .label {
      color: #57606a;
    }
  `]
})
export class StatChipComponent {
  @Input() icon: 'star' | 'fork' | 'eye' | 'issue' = 'star';
  @Input() value: number | null | undefined = 0;
  @Input() label?: string;
  @Input() title?: string;
}

