import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  GithubRepo,
  GithubRepoSearchResult,
  GithubContributor,
  GithubLanguages,
  GithubReadme
} from '../models/github-repo.model';
import { GithubUser, GithubUserSearchResult, GithubUserItem } from '../models/github-user.model';
import { GithubIssue } from '../models/github-issue.model';
import { GithubCommit } from '../models/github-commit.model';
import { GithubRateLimit } from '../models/rate-limit.model';
import { PaginationLinks } from '../models/pagination.model';
import { parseLinkHeader } from '../utils/link-header.parser';

export interface PaginatedResult<T> {
  data: T;
  links: PaginationLinks;
  totalCount?: number;
}

export interface RepoSearchParams {
  query: string;
  language?: string;
  topic?: string;
  owner?: string;
  sort?: 'stars' | 'forks' | 'updated';
  order?: 'desc' | 'asc';
  page?: number;
  perPage?: number;
}

export interface UserSearchParams {
  query: string;
  page?: number;
  perPage?: number;
}

export interface IssueSearchParams {
  owner: string;
  repo: string;
  state?: 'open' | 'closed' | 'all';
  labels?: string;
  assignee?: string;
  page?: number;
  perPage?: number;
}

@Injectable({
  providedIn: 'root'
})
export class GithubApiService {
  private readonly baseUrl = environment.githubApiUrl || 'https://api.github.com';

  constructor(private http: HttpClient) {}

  /**
   * Search repositories by keyword, language, owner, topic, sorted and paginated
   */
  searchRepositories(params: RepoSearchParams): Observable<PaginatedResult<GithubRepo[]>> {
    let q = params.query.trim();
    if (params.language) {
      q += ` language:${params.language}`;
    }
    if (params.topic) {
      q += ` topic:${params.topic}`;
    }
    if (params.owner) {
      q += ` user:${params.owner}`;
    }

    let httpParams = new HttpParams()
      .set('q', q || 'stars:>1000')
      .set('page', (params.page || 1).toString())
      .set('per_page', (params.perPage || 10).toString());

    if (params.sort) {
      httpParams = httpParams.set('sort', params.sort);
    }
    if (params.order) {
      httpParams = httpParams.set('order', params.order);
    }

    return this.http.get<GithubRepoSearchResult>(`${this.baseUrl}/search/repositories`, {
      params: httpParams,
      observe: 'response'
    }).pipe(
      map((response: HttpResponse<GithubRepoSearchResult>) => {
        const body = response.body;
        const linkHeader = response.headers.get('Link');
        return {
          data: body?.items || [],
          totalCount: body?.total_count || 0,
          links: parseLinkHeader(linkHeader)
        };
      })
    );
  }

  /**
   * Search users by keyword, paginated
   */
  searchUsers(params: UserSearchParams): Observable<PaginatedResult<GithubUserSearchResult['items']>> {
    const httpParams = new HttpParams()
      .set('q', params.query.trim() || 'type:user')
      .set('page', (params.page || 1).toString())
      .set('per_page', (params.perPage || 10).toString());

    return this.http.get<GithubUserSearchResult>(`${this.baseUrl}/search/users`, {
      params: httpParams,
      observe: 'response'
    }).pipe(
      map((response: HttpResponse<GithubUserSearchResult>) => {
        const body = response.body;
        const linkHeader = response.headers.get('Link');
        return {
          data: body?.items || [],
          totalCount: body?.total_count || 0,
          links: parseLinkHeader(linkHeader)
        };
      })
    );
  }

  /**
   * Get public profile of a user
   */
  getUser(username: string): Observable<GithubUser> {
    return this.http.get<GithubUser>(`${this.baseUrl}/users/${encodeURIComponent(username)}`);
  }

  /**
   * Get public repositories belonging to a user
   */
  getUserRepos(username: string, page = 1, perPage = 10, sort = 'updated'): Observable<PaginatedResult<GithubRepo[]>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString())
      .set('sort', sort);

    return this.http.get<GithubRepo[]>(`${this.baseUrl}/users/${encodeURIComponent(username)}/repos`, {
      params,
      observe: 'response'
    }).pipe(
      map((response: HttpResponse<GithubRepo[]>) => ({
        data: response.body || [],
        links: parseLinkHeader(response.headers.get('Link'))
      }))
    );
  }

  /**
   * Alias for getUserRepos
   */
  getUserRepositories(username: string, page = 1, perPage = 10, sort = 'updated'): Observable<PaginatedResult<GithubRepo[]>> {
    return this.getUserRepos(username, page, perPage, sort);
  }

  /**
   * Get followers of a user
   */
  getUserFollowers(username: string, page = 1, perPage = 30): Observable<PaginatedResult<GithubUserItem[]>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<GithubUserItem[]>(`${this.baseUrl}/users/${encodeURIComponent(username)}/followers`, {
      params,
      observe: 'response'
    }).pipe(
      map((response: HttpResponse<GithubUserItem[]>) => ({
        data: response.body || [],
        links: parseLinkHeader(response.headers.get('Link'))
      }))
    );
  }

  /**
   * Get users followed by a user
   */
  getUserFollowing(username: string, page = 1, perPage = 30): Observable<PaginatedResult<GithubUserItem[]>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<GithubUserItem[]>(`${this.baseUrl}/users/${encodeURIComponent(username)}/following`, {
      params,
      observe: 'response'
    }).pipe(
      map((response: HttpResponse<GithubUserItem[]>) => ({
        data: response.body || [],
        links: parseLinkHeader(response.headers.get('Link'))
      }))
    );
  }

  /**
   * Get repository details by owner and repo name
   */
  getRepository(owner: string, repo: string): Observable<GithubRepo> {
    return this.http.get<GithubRepo>(`${this.baseUrl}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`);
  }

  /**
   * Get repository issues, with state, label, assignee filters
   */
  getRepositoryIssues(params: IssueSearchParams): Observable<PaginatedResult<GithubIssue[]>> {
    let httpParams = new HttpParams()
      .set('state', params.state || 'open')
      .set('page', (params.page || 1).toString())
      .set('per_page', (params.perPage || 10).toString());

    if (params.labels) {
      httpParams = httpParams.set('labels', params.labels);
    }
    if (params.assignee) {
      httpParams = httpParams.set('assignee', params.assignee);
    }

    return this.http.get<GithubIssue[]>(
      `${this.baseUrl}/repos/${encodeURIComponent(params.owner)}/${encodeURIComponent(params.repo)}/issues`,
      { params: httpParams, observe: 'response' }
    ).pipe(
      map((response: HttpResponse<GithubIssue[]>) => ({
        data: response.body || [],
        links: parseLinkHeader(response.headers.get('Link'))
      }))
    );
  }

  /**
   * Get languages breakdown for a repository
   */
  getRepositoryLanguages(owner: string, repo: string): Observable<GithubLanguages> {
    return this.http.get<GithubLanguages>(
      `${this.baseUrl}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`
    );
  }

  /**
   * Get contributors list for a repository
   */
  getRepositoryContributors(owner: string, repo: string, page = 1, perPage = 10): Observable<PaginatedResult<GithubContributor[]>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<GithubContributor[]>(
      `${this.baseUrl}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contributors`,
      { params, observe: 'response' }
    ).pipe(
      map((response: HttpResponse<GithubContributor[]>) => ({
        data: response.body || [],
        links: parseLinkHeader(response.headers.get('Link'))
      }))
    );
  }

  /**
   * Get recent commits for a repository
   */
  getRepositoryCommits(owner: string, repo: string, page = 1, perPage = 10): Observable<PaginatedResult<GithubCommit[]>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<GithubCommit[]>(
      `${this.baseUrl}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits`,
      { params, observe: 'response' }
    ).pipe(
      map((response: HttpResponse<GithubCommit[]>) => ({
        data: response.body || [],
        links: parseLinkHeader(response.headers.get('Link'))
      }))
    );
  }

  /**
   * Get README content of a repository
   */
  getRepositoryReadme(owner: string, repo: string): Observable<GithubReadme> {
    return this.http.get<GithubReadme>(
      `${this.baseUrl}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`
    );
  }

  /**
   * Get current rate limit status
   */
  getRateLimit(): Observable<GithubRateLimit> {
    return this.http.get<GithubRateLimit>(`${this.baseUrl}/rate_limit`);
  }
}
