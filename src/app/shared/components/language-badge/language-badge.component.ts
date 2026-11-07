import { Component, Input } from '@angular/core';

const LANGUAGE_COLORS: { [key: string]: string } = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Java: '#b07219',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Go: '#00ADD8',
  Rust: '#dea584',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Shell: '#89e051',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  Dart: '#00B4AB',
  Vue: '#41b883',
  SCSS: '#c6538c'
};

@Component({
  selector: 'app-language-badge',
  standalone: false,
  template: `
    <span class="language-badge" *ngIf="language">
      <span class="color-dot" [style.backgroundColor]="color"></span>
      <span class="language-name">{{ language }}</span>
    </span>
  `,
  styles: [`
    .language-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: #57606a;
      font-weight: 500;
    }
    .color-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
      flex-shrink: 0;
    }
    .language-name {
      line-height: 1;
    }
  `]
})
export class LanguageBadgeComponent {
  @Input() language: string | null = null;

  get color(): string {
    if (!this.language) return '#8c959f';
    return LANGUAGE_COLORS[this.language] || '#8c959f';
  }
}

