import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { UserProfileComponent } from './user-profile.component';
import { GithubApiService } from '../../../core/services/github-api.service';
import { LanguageBadgeComponent } from '../../../shared/components/language-badge/language-badge.component';
import { StatChipComponent } from '../../../shared/components/stat-chip/stat-chip.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '../../../shared/components/error-banner/error-banner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { NumberFormatPipe } from '../../../shared/pipes/number-format.pipe';
import { RelativeDatePipe } from '../../../shared/pipes/relative-date.pipe';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let mockGithubService: jasmine.SpyObj<GithubApiService>;

  beforeEach(async () => {
    mockGithubService = jasmine.createSpyObj('GithubApiService', [
      'getUser',
      'getUserRepositories',
      'getUserFollowers',
      'getUserFollowing'
    ]);

    mockGithubService.getUser.and.returnValue(of({
      login: 'torvalds',
      id: 1,
      avatar_url: 'http://avatar',
      html_url: 'http://user',
      name: 'Linus Torvalds',
      company: 'Linux Foundation',
      location: 'Portland, OR',
      bio: 'Linux creator',
      public_repos: 5,
      followers: 200000,
      following: 0,
      created_at: '2011-09-03T15:26:22Z',
      type: 'User'
    } as any));

    mockGithubService.getUserRepositories.and.returnValue(of({
      data: [
        {
          id: 1,
          name: 'linux',
          full_name: 'torvalds/linux',
          owner: { login: 'torvalds', avatar_url: '', html_url: '' },
          html_url: 'https://github.com/torvalds/linux',
          description: 'Linux kernel source tree',
          stargazers_count: 180000,
          forks_count: 55000,
          watchers_count: 10000,
          open_issues_count: 50,
          language: 'C',
          default_branch: 'master',
          topics: ['kernel', 'linux'],
          updated_at: '2026-10-25T00:00:00Z',
          created_at: '2011-09-04T00:00:00Z',
          private: false
        } as any
      ],
      links: {}
    }));

    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule],
      declarations: [
        UserProfileComponent,
        LanguageBadgeComponent,
        StatChipComponent,
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
            params: of({ username: 'torvalds' })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should load user profile and repositories', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(mockGithubService.getUser).toHaveBeenCalledWith('torvalds');
    expect(component.user?.login).toBe('torvalds');
    expect(component.repos.length).toBe(1);
    expect(component.repos[0].name).toBe('linux');
  });

  it('should handle user not found error', () => {
    mockGithubService.getUser.and.returnValue(throwError(() => ({ status: 404 })));
    component.loadProfile();
    fixture.detectChanges();

    expect(component.error).toContain('not found');
  });
});

