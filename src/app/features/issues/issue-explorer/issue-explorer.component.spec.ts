import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { IssueExplorerComponent } from './issue-explorer.component';
import { GithubApiService } from '../../../core/services/github-api.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '../../../shared/components/error-banner/error-banner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { RelativeDatePipe } from '../../../shared/pipes/relative-date.pipe';

describe('IssueExplorerComponent', () => {
  let component: IssueExplorerComponent;
  let fixture: ComponentFixture<IssueExplorerComponent>;
  let mockGithubService: jasmine.SpyObj<GithubApiService>;

  beforeEach(async () => {
    mockGithubService = jasmine.createSpyObj('GithubApiService', ['getRepositoryIssues']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule],
      declarations: [
        IssueExplorerComponent,
        LoadingSpinnerComponent,
        ErrorBannerComponent,
        EmptyStateComponent,
        RelativeDatePipe
      ],
      providers: [
        { provide: GithubApiService, useValue: mockGithubService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    mockGithubService.getRepositoryIssues.and.returnValue(of({
      data: [
        {
          id: 1,
          number: 101,
          title: 'Add virtual threads support',
          user: { login: 'dev', avatar_url: '', html_url: '' },
          state: 'open',
          comments: 3,
          created_at: '2026-10-24T00:00:00Z',
          updated_at: '2026-10-25T00:00:00Z',
          html_url: 'https://github.com/spring-projects/spring-boot/issues/101',
          labels: [{ id: 1, name: 'enhancement', color: 'a2eeef' }]
        } as any
      ],
      links: {}
    }));

    fixture = TestBed.createComponent(IssueExplorerComponent);
    component = fixture.componentInstance;
  });

  it('should create and load repository issues', fakeAsync(() => {
    component.repoInput = 'spring-projects/spring-boot';
    fixture.detectChanges();
    tick(400);

    expect(component).toBeTruthy();
    expect(mockGithubService.getRepositoryIssues).toHaveBeenCalled();
    expect(component.issues.length).toBe(1);
    expect(component.issues[0].title).toBe('Add virtual threads support');
  }));

  it('should handle repository not found error', fakeAsync(() => {
    mockGithubService.getRepositoryIssues.and.returnValue(throwError(() => ({ status: 404 })));
    fixture.detectChanges();
    tick(400);

    expect(component.error).toContain('not found');
    expect(component.issues.length).toBe(0);
  }));
});
