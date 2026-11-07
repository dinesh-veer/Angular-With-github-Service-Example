import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { GithubApiService } from '../../../core/services/github-api.service';
import { GithubRepo } from '../../../core/models/github-repo.model';

@Component({
  selector: 'app-repository-search',
  standalone: false,
  templateUrl: './repository-search.component.html',
  styleUrls: ['./repository-search.component.css']
})
export class RepositorySearchComponent implements OnInit, OnDestroy {
  searchQuery = 'angular';
  selectedLanguage = '';
  selectedSort: 'stars' | 'forks' | 'updated' | '' = 'stars';
  selectedOrder: 'desc' | 'asc' = 'desc';

  currentPage = 1;
  perPage = 10;
  totalCount = 0;
  repositories: GithubRepo[] = [];

  isLoading = false;
  errorMessage: string | null = null;
  isRateLimit = false;

  readonly popularLanguages = [
    'TypeScript',
    'JavaScript',
    'Python',
    'Java',
    'Go',
    'Rust',
    'C++',
    'C#',
    'PHP',
    'Ruby',
    'HTML',
    'CSS'
  ];

  private searchInput$ = new Subject<string>();
  private sub?: Subscription;
  private queryParamSub?: Subscription;

  constructor(
    private githubService: GithubApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Debounce search input typing
    this.sub = this.searchInput$.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(query => {
      this.searchQuery = query;
      this.currentPage = 1;
      this.syncUrlAndSearch();
    });

    // Read query params from route on load
    this.queryParamSub = this.route.queryParams.subscribe(params => {
      if (params['q']) this.searchQuery = params['q'];
      if (params['language']) this.selectedLanguage = params['language'];
      if (params['sort']) this.selectedSort = params['sort'];
      if (params['page']) this.currentPage = parseInt(params['page'], 10) || 1;
      this.executeSearch();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.queryParamSub?.unsubscribe();
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchInput$.next(value);
  }

  onSearchSubmit(): void {
    this.currentPage = 1;
    this.syncUrlAndSearch();
  }

  onLanguageChange(lang: string): void {
    this.selectedLanguage = lang;
    this.currentPage = 1;
    this.syncUrlAndSearch();
  }

  onSortChange(sort: string): void {
    this.selectedSort = sort as any;
    this.currentPage = 1;
    this.syncUrlAndSearch();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.syncUrlAndSearch();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private syncUrlAndSearch(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: this.searchQuery.trim() || null,
        language: this.selectedLanguage || null,
        sort: this.selectedSort || null,
        page: this.currentPage > 1 ? this.currentPage : null
      },
      queryParamsHandling: 'merge'
    });
  }

  executeSearch(): void {
    const query = this.searchQuery.trim();
    if (!query) {
      this.repositories = [];
      this.totalCount = 0;
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.isRateLimit = false;

    this.githubService.searchRepositories({
      query,
      language: this.selectedLanguage || undefined,
      sort: this.selectedSort || undefined,
      order: this.selectedOrder,
      page: this.currentPage,
      perPage: this.perPage
    }).subscribe({
      next: (result) => {
        this.repositories = result.data;
        this.totalCount = result.totalCount || 0;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 403 || err.status === 429) {
          this.isRateLimit = true;
          this.errorMessage = 'GitHub API rate limit exceeded. Please wait a few moments before trying again.';
        } else {
          this.errorMessage = err.error?.message || 'Failed to search repositories. Please check your network and try again.';
        }
      }
    });
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.perPage + 1;
  }

  get endIndex(): number {
    return Math.min(this.currentPage * this.perPage, this.totalCount);
  }
}

