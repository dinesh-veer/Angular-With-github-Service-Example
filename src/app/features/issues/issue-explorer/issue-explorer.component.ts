import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { GithubApiService } from '../../../core/services/github-api.service';
import { GithubIssue } from '../../../core/models/github-issue.model';
import { PaginationLinks } from '../../../core/models/pagination.model';

@Component({
  selector: 'app-issue-explorer',
  standalone: false,
  templateUrl: './issue-explorer.component.html',
  styleUrls: ['./issue-explorer.component.css']
})
export class IssueExplorerComponent implements OnInit, OnDestroy {
  repoInput = 'spring-projects/spring-boot';
  stateFilter: 'open' | 'closed' | 'all' = 'open';
  labelsFilter = '';
  assigneeFilter = '';

  issues: GithubIssue[] = [];
  currentPage = 1;
  pageSize = 15;
  paginationLinks: PaginationLinks = {};

  isLoading = false;
  error: string | null = null;
  hasSearched = false;

  private searchSubject = new Subject<void>();
  private searchSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private githubService: GithubApiService
  ) {}

  ngOnInit(): void {
    // Check if repo queryParam passed (e.g., from repo details)
    this.route.queryParams.subscribe(params => {
      if (params['repo']) {
        this.repoInput = params['repo'];
      } else if (params['q']) {
        this.repoInput = params['q'];
      }
      if (params['state']) {
        this.stateFilter = params['state'];
      }
    });

    this.searchSub = this.searchSubject.pipe(
      debounceTime(350),
      switchMap(() => {
        const trimmed = this.repoInput.trim();
        if (!trimmed || !trimmed.includes('/')) {
          this.isLoading = false;
          this.error = 'Please enter a valid repository in "owner/repository" format (e.g. "angular/angular").';
          return of({ data: [], links: {} });
        }

        const [owner, repo] = trimmed.split('/');
        if (!owner || !repo) {
          this.isLoading = false;
          this.error = 'Invalid repository format. Use owner/repository.';
          return of({ data: [], links: {} });
        }

        this.isLoading = true;
        this.error = null;

        return this.githubService.getRepositoryIssues({
          owner: owner.trim(),
          repo: repo.trim(),
          state: this.stateFilter,
          labels: this.labelsFilter.trim() || undefined,
          assignee: this.assigneeFilter.trim() || undefined,
          page: this.currentPage,
          perPage: this.pageSize
        }).pipe(
          catchError(err => {
            this.isLoading = false;
            if (err.status === 404) {
              this.error = `Repository "${trimmed}" was not found or has issues disabled.`;
            } else if (err.status === 403) {
              this.error = 'API rate limit exceeded. Please wait a few moments before trying again.';
            } else {
              this.error = 'Failed to load issues for this repository.';
            }
            return of({ data: [], links: {} });
          })
        );
      })
    ).subscribe(result => {
      this.isLoading = false;
      this.issues = result.data;
      this.paginationLinks = result.links;
      this.hasSearched = true;
    });

    this.executeFetch();
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.executeFetch();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.executeFetch();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSubmit(e: Event): void {
    e.preventDefault();
    this.currentPage = 1;
    this.executeFetch();
  }

  private executeFetch(): void {
    this.searchSubject.next();
  }
}

