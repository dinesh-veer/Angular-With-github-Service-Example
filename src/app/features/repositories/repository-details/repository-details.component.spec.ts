import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RepositoryDetailsComponent } from './repository-details.component';
import { GithubApiService } from '../../../core/services/github-api.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '../../../shared/components/error-banner/error-banner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { NumberFormatPipe } from '../../../shared/pipes/number-format.pipe';
import { RelativeDatePipe } from '../../../shared/pipes/relative-date.pipe';

describe('RepositoryDetailsComponent', () => {
  let component: RepositoryDetailsComponent;
  let fixture: ComponentFixture<RepositoryDetailsComponent>;
  let mockGithubService: jasmine.SpyObj<GithubApiService>;

  beforeEach(async () => {
    mockGithubService = jasmine.createSpyObj('GithubApiService', [
      'getRepository',
      'getRepositoryLanguages',
      'getRepositoryContributors',
      'getRepositoryReadme',
      'getRepositoryCommits',
      'getRepositoryIssues'
    ]);

    mockGithubService.getRepository.and.returnValue(of({
      id: 1,
      name: 'spring-boot',
      full_name: 'spring-projects/spring-boot',
      owner: { login: 'spring-projects', avatar_url: '', html_url: '' },
      html_url: 'https://github.com/spring-projects/spring-boot',
      description: 'Spring Boot framework',
      stargazers_count: 70000,
      forks_count: 40000,
      watchers_count: 1000,
      open_issues_count: 300,
      language: 'Java',
      default_branch: 'main',
      topics: ['spring', 'java'],
      updated_at: '2026-10-25T00:00:00Z',
      created_at: '2012-01-01T00:00:00Z',
      private: false
    } as any));

    mockGithubService.getRepositoryLanguages.and.returnValue(of({
      Java: 80000,
      Kotlin: 20000
    }));

    mockGithubService.getRepositoryContributors.and.returnValue(of({
      data: [{ login: 'dev', avatar_url: '', contributions: 50, html_url: '' } as any],
      links: {}
    }));

    mockGithubService.getRepositoryReadme.and.returnValue(of({
      name: 'README.md',
      content: btoa('# Spring Boot'),
      encoding: 'base64',
      html_url: ''
    } as any));

    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule],
      declarations: [
        RepositoryDetailsComponent,
        LoadingSpinnerComponent,
        ErrorBannerComponent,
        EmptyStateComponent,
        NumberFormatPipe,
        RelativeDatePipe
      ],
      providers: [
        { provide: GithubApiService, useValue: mockGithubService },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ owner: 'spring-projects', repo: 'spring-boot' })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RepositoryDetailsComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should load repository details, languages, contributors, and readme', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(mockGithubService.getRepository).toHaveBeenCalledWith('spring-projects', 'spring-boot');
    expect(component.repo?.name).toBe('spring-boot');
    expect(component.languages.length).toBe(2);
    expect(component.contributors.length).toBe(1);
    expect(component.readmeContent).toContain('# Spring Boot');
  });

  it('should switch tabs', () => {
    fixture.detectChanges();
    expect(component.activeTab).toBe('overview');

    mockGithubService.getRepositoryCommits.and.returnValue(of({ data: [], links: {} }));
    component.setTab('commits');
    expect(component.activeTab).toBe('commits');
    expect(mockGithubService.getRepositoryCommits).toHaveBeenCalled();
  });

  it('should handle repository not found error', () => {
    mockGithubService.getRepository.and.returnValue(throwError(() => ({ status: 404 })));
    component.loadRepoDetails();
    fixture.detectChanges();

    expect(component.error).toContain('not found');
  });
});

