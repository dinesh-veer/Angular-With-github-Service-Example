import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GithubApiService } from '../../../core/services/github-api.service';
import {
  GithubRepo,
  GithubContributor,
  GithubLanguages,
  GithubReadme
} from '../../../core/models/github-repo.model';
import { GithubCommit } from '../../../core/models/github-commit.model';
import { GithubIssue } from '../../../core/models/github-issue.model';

export interface LanguageStat {
  name: string;
  bytes: number;
  percentage: number;
  color: string;
}

const LANGUAGE_COLORS: { [key: string]: string } = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Java: '#b07219',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Go: '#00ADD8',
  Rust: '#dea584',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Kotlin: '#A97BFF',
  Swift: '#F05138'
};

@Component({
  selector: 'app-repository-details',
  standalone: false,
  templateUrl: './repository-details.component.html',
  styleUrls: ['./repository-details.component.css']
})
export class RepositoryDetailsComponent implements OnInit {
  owner = '';
  repoName = '';

  repo: GithubRepo | null = null;
  readme: GithubReadme | null = null;
  readmeContent = '';
  languages: LanguageStat[] = [];
  contributors: GithubContributor[] = [];
  commits: GithubCommit[] = [];
  issues: GithubIssue[] = [];

  activeTab: 'overview' | 'readme' | 'commits' | 'contributors' | 'issues' | 'languages' = 'overview';

  isLoading = true;
  isLoadingTab = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private githubService: GithubApiService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.owner = params['owner'];
      this.repoName = params['repo'];
      if (this.owner && this.repoName) {
        this.loadRepoDetails();
      }
    });
  }

  loadRepoDetails(): void {
    this.isLoading = true;
    this.error = null;

    forkJoin({
      repo: this.githubService.getRepository(this.owner, this.repoName),
      languages: this.githubService.getRepositoryLanguages(this.owner, this.repoName).pipe(catchError(() => of({}))),
      contributors: this.githubService.getRepositoryContributors(this.owner, this.repoName, 1, 10).pipe(catchError(() => of({ data: [], links: {} }))),
      readme: this.githubService.getRepositoryReadme(this.owner, this.repoName).pipe(catchError(() => of(null)))
    }).subscribe({
      next: (results) => {
        this.repo = results.repo;
        this.processLanguages(results.languages);
        this.contributors = results.contributors.data;
        this.readme = results.readme;
        if (this.readme?.content) {
          try {
            // Base64 decode
            this.readmeContent = atob(this.readme.content.replace(/\s/g, ''));
          } catch {
            this.readmeContent = 'Unable to decode README content.';
          }
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 404) {
          this.error = `Repository "${this.owner}/${this.repoName}" was not found.`;
        } else if (err.status === 403) {
          this.error = 'GitHub API rate limit exceeded. Please try again later.';
        } else {
          this.error = 'Failed to load repository details. Please try again.';
        }
      }
    });
  }

  setTab(tab: 'overview' | 'readme' | 'commits' | 'contributors' | 'issues' | 'languages'): void {
    this.activeTab = tab;
    if (tab === 'commits' && this.commits.length === 0) {
      this.loadCommits();
    } else if (tab === 'issues' && this.issues.length === 0) {
      this.loadIssues();
    }
  }

  loadCommits(): void {
    this.isLoadingTab = true;
    this.githubService.getRepositoryCommits(this.owner, this.repoName, 1, 15).subscribe({
      next: (res) => {
        this.commits = res.data;
        this.isLoadingTab = false;
      },
      error: () => {
        this.isLoadingTab = false;
      }
    });
  }

  loadIssues(): void {
    this.isLoadingTab = true;
    this.githubService.getRepositoryIssues({
      owner: this.owner,
      repo: this.repoName,
      state: 'open',
      page: 1,
      perPage: 15
    }).subscribe({
      next: (res) => {
        this.issues = res.data;
        this.isLoadingTab = false;
      },
      error: () => {
        this.isLoadingTab = false;
      }
    });
  }

  private processLanguages(langs: GithubLanguages): void {
    const total = Object.values(langs).reduce((sum, bytes) => sum + bytes, 0);
    if (total === 0) {
      this.languages = [];
      return;
    }

    this.languages = Object.entries(langs).map(([name, bytes]) => ({
      name,
      bytes,
      percentage: Math.round((bytes / total) * 1000) / 10,
      color: LANGUAGE_COLORS[name] || '#8c959f'
    })).sort((a, b) => b.bytes - a.bytes);
  }
}

