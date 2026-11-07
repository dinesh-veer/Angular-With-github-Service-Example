import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { UserSearchComponent } from './user-search.component';
import { GithubApiService } from '../../../core/services/github-api.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '../../../shared/components/error-banner/error-banner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { NumberFormatPipe } from '../../../shared/pipes/number-format.pipe';

describe('UserSearchComponent', () => {
  let component: UserSearchComponent;
  let fixture: ComponentFixture<UserSearchComponent>;
  let mockGithubService: jasmine.SpyObj<GithubApiService>;

  beforeEach(async () => {
    mockGithubService = jasmine.createSpyObj('GithubApiService', ['searchUsers']);
    mockGithubService.searchUsers.and.returnValue(of({
      data: [
        {
          login: 'angular',
          id: 123,
          avatar_url: 'http://avatar',
          html_url: 'http://angular',
          type: 'Organization'
        } as any
      ],
      totalCount: 1,
      links: {}
    }));

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule],
      declarations: [
        UserSearchComponent,
        LoadingSpinnerComponent,
        ErrorBannerComponent,
        EmptyStateComponent,
        PaginationComponent,
        NumberFormatPipe
      ],
      providers: [
        { provide: GithubApiService, useValue: mockGithubService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserSearchComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create and search initial users', fakeAsync(() => {
    fixture.detectChanges();
    tick(400);

    expect(component).toBeTruthy();
    expect(mockGithubService.searchUsers).toHaveBeenCalled();
    expect(component.users.length).toBe(1);
    expect(component.users[0].login).toBe('angular');
  }));

  it('should handle search error gracefully', fakeAsync(() => {
    mockGithubService.searchUsers.and.returnValue(throwError(() => ({ status: 403 })));
    fixture.detectChanges();
    tick(400);

    expect(component.error).toContain('rate limit');
    expect(component.users.length).toBe(0);
  }));
});

