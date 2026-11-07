import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GithubApiService } from './github-api.service';
import { environment } from '../../../environments/environment';

describe('GithubApiService', () => {
  let service: GithubApiService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.githubApiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GithubApiService]
    });

    service = TestBed.inject(GithubApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should search repositories with query parameters and parse Link header', () => {
    const mockResponse = {
      total_count: 42,
      incomplete_results: false,
      items: [
        {
          id: 1,
          name: 'spring-boot',
          full_name: 'spring-projects/spring-boot',
          owner: { login: 'spring-projects', avatar_url: 'http://avatar', html_url: 'http://user' },
          html_url: 'http://repo',
          description: 'Framework',
          stargazers_count: 50000,
          forks_count: 30000,
          watchers_count: 1200,
          open_issues_count: 200,
          language: 'Java',
          default_branch: 'main',
          topics: ['spring', 'java'],
          updated_at: '2026-10-25T10:00:00Z',
          created_at: '2012-10-25T10:00:00Z',
          private: false
        }
      ]
    };

    service.searchRepositories({
      query: 'spring-boot',
      language: 'java',
      page: 1,
      perPage: 10
    }).subscribe(res => {
      expect(res.data.length).toBe(1);
      expect(res.totalCount).toBe(42);
      expect(res.data[0].name).toBe('spring-boot');
      expect(res.links.next).toBe(2);
    });

    const req = httpMock.expectOne(r => r.url === `${baseUrl}/search/repositories`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('q')).toContain('spring-boot');
    expect(req.request.params.get('q')).toContain('language:java');

    req.flush(mockResponse, {
      headers: {
        Link: '<https://api.github.com/search/repositories?q=spring-boot&page=2>; rel="next", <https://api.github.com/search/repositories?q=spring-boot&page=5>; rel="last"'
      }
    });
  });

  it('should search users with pagination', () => {
    const mockUsers = {
      total_count: 1,
      incomplete_results: false,
      items: [
        { login: 'angular', id: 123, avatar_url: 'http://avatar', html_url: 'http://angular', type: 'Organization' }
      ]
    };

    service.searchUsers({ query: 'angular', page: 1, perPage: 10 }).subscribe(res => {
      expect(res.data.length).toBe(1);
      expect(res.data[0].login).toBe('angular');
      expect(res.totalCount).toBe(1);
    });

    const req = httpMock.expectOne(r => r.url === `${baseUrl}/search/users`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('q')).toBe('angular');
    req.flush(mockUsers);
  });

  it('should get a single user profile', () => {
    const mockUser = {
      login: 'octocat',
      id: 1,
      avatar_url: 'http://avatar',
      html_url: 'http://user',
      name: 'The Octocat',
      company: 'GitHub',
      location: 'San Francisco',
      bio: 'Developer',
      public_repos: 8,
      followers: 2000,
      following: 5,
      created_at: '2011-01-25T18:44:36Z',
      type: 'User'
    };

    service.getUser('octocat').subscribe(user => {
      expect(user.login).toBe('octocat');
      expect(user.name).toBe('The Octocat');
      expect(user.public_repos).toBe(8);
    });

    const req = httpMock.expectOne(`${baseUrl}/users/octocat`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should get user repositories', () => {
    service.getUserRepos('octocat', 1, 10).subscribe(res => {
      expect(res.data.length).toBe(1);
      expect(res.data[0].name).toBe('hello-world');
    });

    const req = httpMock.expectOne(r => r.url === `${baseUrl}/users/octocat/repos`);
    expect(req.request.method).toBe('GET');
    req.flush([{ name: 'hello-world' }]);
  });

  it('should get repository details', () => {
    service.getRepository('angular', 'angular').subscribe(repo => {
      expect(repo.name).toBe('angular');
    });

    const req = httpMock.expectOne(`${baseUrl}/repos/angular/angular`);
    expect(req.request.method).toBe('GET');
    req.flush({ name: 'angular', full_name: 'angular/angular' });
  });

  it('should get repository issues with filters', () => {
    service.getRepositoryIssues({
      owner: 'facebook',
      repo: 'react',
      state: 'open',
      labels: 'bug'
    }).subscribe(res => {
      expect(res.data.length).toBe(1);
      expect(res.data[0].title).toBe('Bug in useEffect');
    });

    const req = httpMock.expectOne(r => r.url === `${baseUrl}/repos/facebook/react/issues`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('state')).toBe('open');
    expect(req.request.params.get('labels')).toBe('bug');
    req.flush([{ id: 101, title: 'Bug in useEffect', state: 'open' }]);
  });

  it('should get repository languages', () => {
    service.getRepositoryLanguages('angular', 'angular').subscribe(langs => {
      expect(langs['TypeScript']).toBe(100000);
    });

    const req = httpMock.expectOne(`${baseUrl}/repos/angular/angular/languages`);
    expect(req.request.method).toBe('GET');
    req.flush({ TypeScript: 100000, HTML: 2000 });
  });

  it('should get repository readme', () => {
    service.getRepositoryReadme('angular', 'angular').subscribe(readme => {
      expect(readme.name).toBe('README.md');
    });

    const req = httpMock.expectOne(`${baseUrl}/repos/angular/angular/readme`);
    expect(req.request.method).toBe('GET');
    req.flush({ name: 'README.md', content: 'IyBBbmd1bGFy', encoding: 'base64' });
  });

  it('should get rate limit information', () => {
    service.getRateLimit().subscribe(rate => {
      expect(rate.resources.core.remaining).toBe(55);
    });

    const req = httpMock.expectOne(`${baseUrl}/rate_limit`);
    expect(req.request.method).toBe('GET');
    req.flush({
      resources: {
        core: { limit: 60, remaining: 55, reset: 1700000000, used: 5 },
        search: { limit: 10, remaining: 9, reset: 1700000000, used: 1 }
      }
    });
  });
});

