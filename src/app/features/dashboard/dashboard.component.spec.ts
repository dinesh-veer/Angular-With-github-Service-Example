import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { GithubApiService } from '../../core/services/github-api.service';
import { LanguageBadgeComponent } from '../../shared/components/language-badge/language-badge.component';
import { StatChipComponent } from '../../shared/components/stat-chip/stat-chip.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '../../shared/components/error-banner/error-banner.component';
import { NumberFormatPipe } from '../../shared/pipes/number-format.pipe';
import { RelativeDatePipe } from '../../shared/pipes/relative-date.pipe';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockGithubService: jasmine.SpyObj<GithubApiService>;
  let router: Router;

  beforeEach(async () => {
    mockGithubService = jasmine.createSpyObj('GithubApiService', ['getRepository', 'searchRepositories']);
    mockGithubService.searchRepositories.and.returnValue(of({
      data: [
        {
          id: 1,
          name: 'angular',
          full_name: 'angular/angular',
          owner: { login: 'angular', avatar_url: '', html_url: '' },
          html_url: 'https://github.com/angular/angular',
          description: 'Framework',
          stargazers_count: 90000,
          forks_count: 24000,
          watchers_count: 2000,
          open_issues_count: 500,
          language: 'TypeScript',
          default_branch: 'main',
          topics: ['angular'],
          updated_at: '2026-10-25T00:00:00Z',
          created_at: '2014-01-01T00:00:00Z',
          private: false
        } as any
      ],
      totalCount: 1,
      links: {}
    }));

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule],
      declarations: [
        DashboardComponent,
        LanguageBadgeComponent,
        StatChipComponent,
        LoadingSpinnerComponent,
        ErrorBannerComponent,
        NumberFormatPipe,
        RelativeDatePipe
      ],
      providers: [
        { provide: GithubApiService, useValue: mockGithubService }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create dashboard and load popular repos', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(mockGithubService.searchRepositories).toHaveBeenCalled();
  });

  it('should route to repositories when searching with repository scope', () => {
    spyOn(router, 'navigate');
    component.searchQuery = 'spring-boot';
    component.searchScope = 'repositories';
    component.onSearch();

    expect(router.navigate).toHaveBeenCalledWith(['/repositories'], { queryParams: { q: 'spring-boot' } });
  });

  it('should route to users when searching with users scope', () => {
    spyOn(router, 'navigate');
    component.searchQuery = 'john';
    component.searchScope = 'users';
    component.onSearch();

    expect(router.navigate).toHaveBeenCalledWith(['/users'], { queryParams: { q: 'john' } });
  });

  it('should route to issues when searching with issues scope', () => {
    spyOn(router, 'navigate');
    component.searchQuery = 'spring-projects/spring-boot';
    component.searchScope = 'issues';
    component.onSearch();

    expect(router.navigate).toHaveBeenCalledWith(['/issues'], { queryParams: { repo: 'spring-projects/spring-boot' } });
  });
});
