import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { GithubApiService } from '../../../core/services/github-api.service';
import { GithubUserItem } from '../../../core/models/github-user.model';
import { PaginationLinks } from '../../../core/models/pagination.model';

@Component({
  selector: 'app-user-search',
  standalone: false,
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css']
})
export class UserSearchComponent implements OnInit, OnDestroy {
  searchTerm = 'angular';
  users: GithubUserItem[] = [];
  totalCount = 0;
  currentPage = 1;
  pageSize = 10;
  paginationLinks: PaginationLinks = {};

  isLoading = false;
  error: string | null = null;
  hasSearched = false;

  private searchSubject = new Subject<{ query: string; page: number }>();
  private searchSub?: Subscription;

  constructor(private githubService: GithubApiService) {}

  ngOnInit(): void {
    this.searchSub = this.searchSubject.pipe(
      debounceTime(350),
      distinctUntilChanged((prev, curr) => prev.query === curr.query && prev.page === curr.page),
      switchMap(({ query, page }) => {
        if (!query.trim()) {
          this.isLoading = false;
          return of({ data: [], totalCount: 0, links: {} });
        }
        this.isLoading = true;
        this.error = null;
        return this.githubService.searchUsers({ query, page, perPage: this.pageSize }).pipe(
          catchError(err => {
            this.isLoading = false;
            if (err.status === 403) {
              this.error = 'API rate limit exceeded. Please wait a few moments before trying again.';
            } else {
              this.error = 'Failed to search users. Please check your network and try again.';
            }
            return of({ data: [], totalCount: 0, links: {} });
          })
        );
      })
    ).subscribe(result => {
      this.isLoading = false;
      this.users = result.data;
      this.totalCount = result.totalCount || 0;
      this.paginationLinks = result.links;
      this.hasSearched = true;
    });

    this.executeSearch();
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  onSearchInput(): void {
    this.currentPage = 1;
    this.executeSearch();
  }

  onFormSubmit(e: Event): void {
    e.preventDefault();
    this.currentPage = 1;
    this.executeSearch();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.executeSearch();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private executeSearch(): void {
    this.searchSubject.next({
      query: this.searchTerm,
      page: this.currentPage
    });
  }
}

