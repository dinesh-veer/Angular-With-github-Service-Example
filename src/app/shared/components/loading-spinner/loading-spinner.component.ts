import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: false,
  template: `
    <div class="spinner-wrapper" [class.overlay]="overlay">
      <div class="spinner" [style.width.px]="size" [style.height.px]="size"></div>
      <p *ngIf="message" class="spinner-message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .spinner-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px 16px;
      gap: 12px;
    }
    .spinner-wrapper.overlay {
      position: absolute;
      inset: 0;
      background: rgba(255, 255, 255, 0.85);
      z-index: 10;
    }
    .spinner {
      border: 3px solid rgba(0, 0, 0, 0.08);
      border-top-color: #0969da;
      border-radius: 50%;
      animation: spin 0.75s linear infinite;
    }
    .spinner-message {
      font-size: 13px;
      color: #656d76;
      margin: 0;
      font-weight: 500;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() size = 32;
  @Input() message = 'Loading...';
  @Input() overlay = false;
}

