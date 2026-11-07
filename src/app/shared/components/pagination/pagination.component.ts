import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: false,
  template: `
    <nav class="pagination-nav" *ngIf="totalPages > 1" aria-label="Pagination">
      <button
        class="page-btn prev"
        [disabled]="currentPage <= 1 || disabled"
        (click)="goToPage(currentPage - 1)"
        aria-label="Previous page">
        &lsaquo;
      </button>

      <ng-container *ngFor="let page of visiblePages">
        <button
          *ngIf="page !== -1"
          class="page-btn number"
          [class.active]="page === currentPage"
          [disabled]="disabled"
          (click)="goToPage(page)">
          {{ page }}
        </button>
        <span *ngIf="page === -1" class="page-ellipsis">&hellip;</span>
      </ng-container>

      <button
        class="page-btn next"
        [disabled]="currentPage >= totalPages || disabled"
        (click)="goToPage(currentPage + 1)"
        aria-label="Next page">
        &rsaquo;
      </button>
    </nav>
  `,
  styles: [`
    .pagination-nav {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      margin: 24px 0 16px;
    }
    .page-btn {
      min-width: 32px;
      height: 32px;
      padding: 0 8px;
      font-size: 13px;
      font-weight: 500;
      border: 1px solid #d0d7de;
      border-radius: 6px;
      background: #fff;
      color: #24292f;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
    }
    .page-btn:hover:not(:disabled) {
      background: #f6f8fa;
      border-color: #afb8c1;
    }
    .page-btn.active {
      background: #0969da;
      border-color: #0969da;
      color: #fff;
      font-weight: 600;
    }
    .page-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .page-ellipsis {
      padding: 0 4px;
      color: #57606a;
      user-select: none;
    }
  `]
})
export class PaginationComponent implements OnChanges {
  @Input() currentPage = 1;
  @Input() totalCount = 0;
  @Input() perPage = 10;
  @Input() maxTotalItems = 1000; // GitHub limits search results to 1000
  @Input() disabled = false;
  @Output() pageChange = new EventEmitter<number>();

  totalPages = 1;
  visiblePages: number[] = [];

  ngOnChanges(): void {
    const effectiveTotal = Math.min(this.totalCount, this.maxTotalItems);
    this.totalPages = Math.max(1, Math.ceil(effectiveTotal / this.perPage));
    this.buildVisiblePages();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage && !this.disabled) {
      this.pageChange.emit(page);
    }
  }

  private buildVisiblePages(): void {
    const current = this.currentPage;
    const total = this.totalPages;

    if (total <= 7) {
      this.visiblePages = Array.from({ length: total }, (_, i) => i + 1);
      return;
    }

    const pages: number[] = [];
    pages.push(1);

    if (current > 3) {
      pages.push(-1); // ellipsis
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current < total - 2) {
      pages.push(-1); // ellipsis
    }

    pages.push(total);
    this.visiblePages = pages;
  }
}

