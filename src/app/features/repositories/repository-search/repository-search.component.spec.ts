import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { RepositorySearchComponent } from './repository-search.component';
import { GithubApiService } from '../../../core/services/github-api.service';
import { LanguageBadgeComponent } from '../../../shared/components/language-badge/language-badge.component';
import { StatChipComponent } from '../../../shared/components/stat-chip/stat-chip.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '../../../shared/components/error-banner/error-banner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { NumberFormatPipe } from '../../../shared/pipes/number-format.pipe';
import { RelativeDatePipe } from '../../../shared/pipes/relative-date.pipe';

describe('RepositorySearchComponent', () => {
  let component: RepositorySearchComponent;
  let fixture: ComponentFixture<RepositorySearchComponent>;
  let mockGithubService: jasmine.SpyObj<GithubApiService>;

  beforeEach(async () => {
    mockGithubService = jasmine.createSpyObj('GithubApiService', ['searchRepositories']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule],
      declarations: [
        RepositorySearchComponent,
        LanguageBadgeComponent,
        StatChipComponent,
        LoadingSpinnerComponent,
        ErrorBannerComponent,
        EmptyStateComponent,
        PaginationComponent,
        NumberFormatPipe,
        RelativeDatePipe
      ],
      providers: [
        { provide: GithubApiService, useValue: mockGithubService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    mockGithubService.searchRepositories.and.returnValue(of({
      data: [
        {
          id: 1,
          name: 'angular',
          full_name: 'angular/angular',
          owner: { login: 'angular', avatar_url: '', html_url: '' },
          html_url: 'https://github.com/angular/angular',
          description: 'The modern web framework',
          stargazers_count: 90000,
          forks_count: 24000,
          watchers_count: 2000,
          open_issues_count: 500,
          language: 'TypeScript',
          default_branch: 'main',
          topics: ['framework', 'typescript'],
          updated_at: '2026-10-20T00:00:00Z',
          created_at: '2014-01-01T00:00:00Z',
          private: false
        } as any
      ],
      totalCount: 1,
      links: {}
    }));

    fixture = TestBed.createComponent(RepositorySearchComponent);
    component = fixture.componentInstance;
  });

  it('should create and search initial repositories', fakeAsync(() => {
    fixture.detectChanges();
    tick(400);

    expect(component).toBeTruthy();
    expect(mockGithubService.searchRepositories).toHaveBeenCalled();
    expect(component.repositories.length).toBe(1);
    expect(component.repositories[0].name).toBe('angular');
  }));

  it('should handle search error gracefully', fakeAsync(() => {
    mockGithubService.searchRepositories.and.returnValue(throwError(() => ({ status: 403 })));

    fixture.detectChanges();
    tick(400);

    expect(component.errorMessage).toContain('rate limit');
    expect(component.repositories.length).toBe(0);
  }));
});
